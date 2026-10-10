#!/usr/bin/env node
// PublishOnce CLI for AI agents. Zero dependencies (Node.js 18+ built-in fetch only). Every command prints JSON.
//
//   publishonce.js setup --key po_live_xxx [--global]
//   publishonce.js config show
//   publishonce.js connections [--platform youtube]
//   publishonce.js media upload <file>
//   publishonce.js posts create --data '<JSON>' | --data-file <path>
//   publishonce.js posts list [--status completed] [--limit 20] [--cursor <c>]
//   publishonce.js posts get <id>
//   publishonce.js posts publish <id> [--data '<JSON>']
//   publishonce.js posts delete <id>
//
// The API key is never printed. Key lookup order: env PUBLISHONCE_API_KEY > ./.publishonce/config.json > ~/.config/publishonce/config.json
// The API base URL defaults to https://publishonce.app (override: env PUBLISHONCE_API_URL, e.g. for a local test server).
// Messages are in English by default; Japanese when PUBLISHONCE_LANG=ja (or the system locale is Japanese). The agent translates them for the user.

"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const DEFAULT_ORIGIN = "https://publishonce.app";
const LOCAL_CONFIG = path.join(process.cwd(), ".publishonce", "config.json");
const GLOBAL_CONFIG = path.join(os.homedir(), ".config", "publishonce", "config.json");
const MIME = { ".mp4": "video/mp4", ".mov": "video/quicktime", ".webm": "video/webm" };
const MAX_UPLOAD_BYTES = 1024 * 1024 * 1024; // the largest plan limit; the server enforces the real per-plan limit

// ---- messages (en / ja)
const MESSAGES = {
  en: {
    no_key: "No API key is set. Run `setup --key <KEY>` or set the environment variable PUBLISHONCE_API_KEY.",
    no_key_hint: "Create a key at https://publishonce.app/settings/api",
    connect_failed: "Could not connect: {detail}",
    data_file_unreadable: "Could not read --data-file: {file}",
    data_required: "--data '<JSON>' or --data-file <path> is required.",
    data_invalid: "--data is not valid JSON: {detail}",
    data_invalid_hint: "Put long text in a JSON file and pass it with --data-file.",
    key_invalid: "--key must be a key that starts with po_live_ or po_test_.",
    file_required: "Give the path of the file to upload.",
    file_type: "Supported formats: MP4, MOV, WEBM.",
    file_too_big: "The file is too large (limit 1 GB; the limit may be smaller on your plan).",
    upload_failed: "Upload failed: {detail}",
    upload_failed_http: "Upload failed (HTTP {status}).",
    upload_note: "Use this video_path as video_path in `posts create`.",
    id_required_post: "Give the post ID.",
    id_required_draft: "Give the draft ID.",
    unknown_command: "Unknown command.",
  },
  ja: {
    no_key: "APIキーが設定されていません。`setup --key <KEY>` を実行するか、環境変数 PUBLISHONCE_API_KEY を設定してください。",
    no_key_hint: "キーは https://publishonce.app/settings/api で発行できます。",
    connect_failed: "接続できませんでした: {detail}",
    data_file_unreadable: "--data-file を読み込めませんでした: {file}",
    data_required: "--data '<JSON>' または --data-file <path> が必要です。",
    data_invalid: "--data が正しい JSON ではありません: {detail}",
    data_invalid_hint: "長い文章は、JSON ファイルに書いて --data-file で渡してください。",
    key_invalid: "--key には po_live_… または po_test_… のキーを指定してください。",
    file_required: "アップロードするファイルのパスを指定してください。",
    file_type: "対応している形式は、MP4・MOV・WEBM です。",
    file_too_big: "ファイルが大きすぎます（上限 1GB。プランによって、もっと小さい場合があります）。",
    upload_failed: "アップロードに失敗しました: {detail}",
    upload_failed_http: "アップロードに失敗しました（HTTP {status}）。",
    upload_note: "この video_path を posts create の video_path に指定してください。",
    id_required_post: "投稿の ID を指定してください。",
    id_required_draft: "下書きの ID を指定してください。",
    unknown_command: "不明なコマンドです。",
  },
};

function detectLang() {
  const forced = (process.env.PUBLISHONCE_LANG || "").toLowerCase();
  if (forced) return forced.startsWith("ja") ? "ja" : "en";
  try {
    return Intl.DateTimeFormat().resolvedOptions().locale.toLowerCase().startsWith("ja") ? "ja" : "en";
  } catch {
    return "en";
  }
}
const LANG = detectLang();
function t(key, params = {}) {
  const raw = (MESSAGES[LANG] && MESSAGES[LANG][key]) || MESSAGES.en[key] || key;
  return raw.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? ""));
}

function out(obj, code = 0) {
  process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
  process.exit(code);
}
function fail(message, extra = {}) {
  out({ ok: false, error: { message, ...extra } }, 1);
}

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function loadConfig() {
  const local = readJson(LOCAL_CONFIG) || {};
  const global = readJson(GLOBAL_CONFIG) || {};
  const env = process.env.PUBLISHONCE_API_KEY;
  const key = env || local.apiKey || global.apiKey || null;
  const source = env ? "env" : local.apiKey ? "local" : global.apiKey ? "global" : null;
  const origin = (process.env.PUBLISHONCE_API_URL || local.apiUrl || global.apiUrl || DEFAULT_ORIGIN).replace(/\/+$/, "");
  return { key, source, origin };
}

function maskKey(key) {
  if (!key) return null;
  return key.length <= 12 ? "****" : `${key.slice(0, 8)}…${key.slice(-4)}`;
}

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const name = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) flags[name] = true;
      else {
        flags[name] = next;
        i++;
      }
    } else positional.push(a);
  }
  return { positional, flags };
}

async function api(method, route, { body, query } = {}) {
  const cfg = loadConfig();
  if (!cfg.key) fail(t("no_key"), { hint: t("no_key_hint") });
  const url = new URL(`${cfg.origin}/api/v1${route}`);
  for (const [k, v] of Object.entries(query || {})) if (v !== undefined && v !== true) url.searchParams.set(k, String(v));
  let res;
  try {
    res = await fetch(url, {
      method,
      headers: { authorization: `Bearer ${cfg.key}`, ...(body ? { "content-type": "application/json" } : {}) },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (e) {
    fail(t("connect_failed", { detail: e instanceof Error ? e.message : String(e) }), { url: `${cfg.origin}/api/v1${route}` });
  }
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text.slice(0, 500) };
  }
  if (!res.ok) out({ ok: false, status: res.status, error: (data && data.error) || { message: `HTTP ${res.status}` } }, 1);
  return { status: res.status, data };
}

function writeConfig(file, patch) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const cur = readJson(file) || {};
  fs.writeFileSync(file, JSON.stringify({ ...cur, ...patch }, null, 2) + "\n", { mode: 0o600 });
}

function readData(flags) {
  if (flags["data-file"]) {
    const parsed = readJson(String(flags["data-file"]));
    if (!parsed) fail(t("data_file_unreadable", { file: String(flags["data-file"]) }));
    return parsed;
  }
  if (typeof flags.data !== "string") fail(t("data_required"));
  try {
    return JSON.parse(flags.data);
  } catch (e) {
    fail(t("data_invalid", { detail: e instanceof Error ? e.message : String(e) }), { hint: t("data_invalid_hint") });
  }
}

async function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const [cmd, sub, arg] = positional;

  if (cmd === "setup") {
    const key = typeof flags.key === "string" ? flags.key : null;
    if (!key || !/^po_(live|test)_/.test(key)) fail(t("key_invalid"));
    const file = flags.global ? GLOBAL_CONFIG : LOCAL_CONFIG;
    writeConfig(file, { apiKey: key });
    out({ ok: true, data: { saved_to: file, key: maskKey(key), mode: key.startsWith("po_test_") ? "test" : "live" } });
  }

  if (cmd === "config" && sub === "show") {
    const cfg = loadConfig();
    out({ ok: true, data: { api_origin: cfg.origin, key: maskKey(cfg.key), key_source: cfg.source, mode: cfg.key ? (cfg.key.startsWith("po_test_") ? "test" : "live") : null, language: LANG, local_config: LOCAL_CONFIG, global_config: GLOBAL_CONFIG } });
  }

  if (cmd === "connections") {
    const { data } = await api("GET", "/connections");
    // The real response is { connections: [...], count }. The older shape (data) is accepted too.
    const list = (data && (data.connections || data.data)) || [];
    const filtered = typeof flags.platform === "string" ? list.filter((c) => c.platform === flags.platform) : list;
    out({ ok: true, data: filtered });
  }

  if (cmd === "media" && sub === "upload") {
    const file = arg;
    if (!file || !fs.existsSync(file)) fail(t("file_required"));
    const size = fs.statSync(file).size;
    const contentType = MIME[path.extname(file).toLowerCase()];
    if (!contentType) fail(t("file_type"));
    if (size > MAX_UPLOAD_BYTES) fail(t("file_too_big"));
    const { data: presign } = await api("POST", "/uploads", { body: { filename: path.basename(file), content_type: contentType, size_bytes: size } });
    const put = await fetch(presign.upload_url, { method: "PUT", headers: { "content-type": contentType }, body: fs.readFileSync(file) }).catch((e) => fail(t("upload_failed", { detail: e instanceof Error ? e.message : String(e) })));
    if (!put.ok) fail(t("upload_failed_http", { status: put.status }));
    out({ ok: true, data: { video_path: presign.video_path, size_bytes: size, content_type: contentType, note: t("upload_note") } });
  }

  if (cmd === "posts" && sub === "create") {
    const { status, data } = await api("POST", "/posts", { body: readData(flags) });
    out({ ok: true, status, data });
  }
  if (cmd === "posts" && sub === "list") {
    const { data } = await api("GET", "/posts", { query: { status: flags.status, limit: flags.limit, cursor: flags.cursor } });
    out({ ok: true, data });
  }
  if (cmd === "posts" && sub === "get") {
    if (!arg) fail(t("id_required_post"));
    const { data } = await api("GET", `/posts/${encodeURIComponent(arg)}`);
    out({ ok: true, data });
  }
  if (cmd === "posts" && sub === "publish") {
    if (!arg) fail(t("id_required_draft"));
    const { data } = await api("POST", `/posts/${encodeURIComponent(arg)}/publish`, { body: flags.data || flags["data-file"] ? readData(flags) : {} });
    out({ ok: true, data });
  }
  if (cmd === "posts" && sub === "delete") {
    if (!arg) fail(t("id_required_draft"));
    const { data } = await api("DELETE", `/posts/${encodeURIComponent(arg)}`);
    out({ ok: true, data });
  }

  out(
    {
      ok: false,
      error: {
        message: t("unknown_command"),
        commands: ["setup --key <KEY> [--global]", "config show", "connections [--platform <p>]", "media upload <file>", "posts create --data '<JSON>'", "posts list [--status s] [--limit n] [--cursor c]", "posts get <id>", "posts publish <id> [--data '<JSON>']", "posts delete <id>"],
      },
    },
    1,
  );
}

main().catch((e) => fail(e instanceof Error ? e.message : String(e)));
