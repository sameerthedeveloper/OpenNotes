/**
 * Puter.js (https://docs.puter.com) — client-side AI with no API key.
 * Users sign in to Puter once (popup) and pay for their own usage.
 * The SDK is loaded on demand so it costs nothing until AI is used.
 */

const PUTER_SRC = "https://js.puter.com/v2/";

type PuterChatPart = { text?: string };
type PuterChatResult = {
  message?: { content?: string | { text?: string }[] };
  text?: string;
  toString?: () => string;
};

type Puter = {
  ai: {
    chat: (
      prompt: string | { role: string; content: string }[],
      options?: { model?: string; stream?: boolean; temperature?: number },
    ) => Promise<PuterChatResult & AsyncIterable<PuterChatPart>>;
  };
};

declare global {
  interface Window {
    puter?: Puter;
  }
}

let loading: Promise<Puter> | null = null;

export function loadPuter(): Promise<Puter> {
  if (typeof window === "undefined") return Promise.reject(new Error("Puter needs a browser"));
  if (window.puter) return Promise.resolve(window.puter);
  loading ??= new Promise<Puter>((resolve, reject) => {
    const s = document.createElement("script");
    s.src = PUTER_SRC;
    s.async = true;
    s.onload = () =>
      window.puter ? resolve(window.puter) : reject(new Error("Puter failed to initialise"));
    s.onerror = () => {
      loading = null;
      reject(new Error("Could not load Puter.js. Check your connection or ad blocker."));
    };
    document.head.appendChild(s);
  });
  return loading;
}

export const PUTER_MODELS = [
  { value: "auto", label: "Auto (Puter default)" },
  { value: "gpt-5-nano", label: "GPT-5 nano · fast" },
  { value: "claude-sonnet-4-5", label: "Claude Sonnet 4.5" },
  { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash" },
];

const SYSTEM_HTML =
  "You write study notes. Return ONLY an HTML fragment using semantic tags (h1-h4, p, ul, ol, li, table, blockquote, pre, code, strong, mark). No markdown, no code fences, no <html>, <head>, <body>, <style> or <script> tags, and no commentary before or after.";
const SYSTEM_TEXT = "You write clear, well-structured study notes. Return only the note content, no preamble.";

/** Removes ```html fences some models add despite instructions. */
export function stripFences(text: string) {
  return text
    .trim()
    .replace(/^```[a-z]*\s*\n?/i, "")
    .replace(/\n?```\s*$/i, "")
    .trim();
}

function resultText(res: PuterChatResult): string {
  const c = res?.message?.content;
  if (typeof c === "string") return c;
  if (Array.isArray(c)) return c.map((p) => p?.text ?? "").join("");
  return res?.text ?? String(res ?? "");
}

export async function generateNoteContent({
  prompt,
  model = "auto",
  html = true,
  onChunk,
  isCancelled,
}: {
  prompt: string;
  model?: string;
  html?: boolean;
  onChunk?: (textSoFar: string) => void;
  isCancelled?: () => boolean;
}): Promise<string> {
  const puter = await loadPuter();
  const options: { model?: string; stream: boolean } = { stream: true };
  if (model !== "auto") options.model = model;

  const res = await puter.ai.chat(
    [
      { role: "system", content: html ? SYSTEM_HTML : SYSTEM_TEXT },
      { role: "user", content: prompt },
    ],
    options,
  );

  let out = "";
  if (res && typeof (res as AsyncIterable<PuterChatPart>)[Symbol.asyncIterator] === "function") {
    for await (const part of res) {
      if (isCancelled?.()) break;
      out += part?.text ?? "";
      onChunk?.(out);
    }
  } else {
    out = resultText(res);
    onChunk?.(out);
  }
  return stripFences(out);
}
