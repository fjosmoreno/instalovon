/**
 * Gemini wrapper with optional Headroom integration.
 *
 * Two activation paths:
 *
 *   1. Default: native @google/generative-ai SDK, direct → Google.
 *
 *   2. HEADROOM_ENABLED=1: route Gemini calls through Gemini's OpenAI-compatible
 *      endpoint (`https://generativelanguage.googleapis.com/v1beta/openai`) using
 *      headroom-ai/openai adapter. headroom-ai 0.x ships adapters for OpenAI /
 *      Anthropic / Vercel AI but not yet for a first-party Gemini SDK, so we lean
 *      on Gemini's OpenAI compatibility layer — same model, same API key, same
 *      response shape, but the request body is intercepted by Headroom's
 *      compressor before it leaves the box (or goes through the headroom proxy
 *      when HEADROOM_URL is set).
 *
 *      Activated via two env vars:
 *        HEADROOM_ENABLED=1
 *        HEADROOM_URL=http://127.0.0.1:8787/v1   (optional — points at the
 *                                                  Headroom proxy container if
 *                                                  you run one; defaults to
 *                                                  in-process compression).
 */
import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import type { AIReport, InstagramProfileSnapshot, ReportSection } from "@instalovon/shared";

const HEADROOM_ENABLED = process.env.HEADROOM_ENABLED === "1";
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";
const HEADROOM_URL = process.env.HEADROOM_URL;

/**
 * Lazily-built OpenAI-compatible client pointed at Gemini, optionally wrapped
 * through Headroom.
 */
let cachedOpenAI: { client: OpenAI; wrapped: boolean } | null = null;
let cachedKey: string | null = null;

async function getOpenAIClient(): Promise<OpenAI> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY env var is required");
  if (!cachedOpenAI || cachedKey !== apiKey) {
    const client = new OpenAI({
      apiKey,
      baseURL:
        HEADROOM_URL && HEADROOM_URL.length > 0
          ? `${HEADROOM_URL.replace(/\/$/, "")}` // we let headroom proxy redirect
          : "https://generativelanguage.googleapis.com/v1beta/openai",
      defaultHeaders: HEADROOM_URL
        ? { "x-headroom-provider": "gemini" }
        : undefined,
    });
    let wrapped = false;
    if (HEADROOM_ENABLED) {
      try {
        const mod = await import("headroom-ai/openai");
        const withHeadroom = (mod as any).withHeadroom as
          | ((client: OpenAI) => OpenAI)
          | undefined;
        if (typeof withHeadroom === "function") {
          cachedOpenAI = { client: withHeadroom(client), wrapped: true };
          wrapped = true;
        }
      } catch (err) {
        console.warn(
          "[ai] HEADROOM_ENABLED=1 but headroom-ai/openai wrapper missing — falling back to raw SDK:",
          (err as Error).message
        );
      }
    }
    if (!wrapped) cachedOpenAI = { client, wrapped: false };
    cachedKey = apiKey;
  }
  return cachedOpenAI!.client;
}

let cachedGemini: GenerativeModel | null = null;
let cachedGeminiKey: string | null = null;

function getGeminiDirectModel(): GenerativeModel {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY env var is required");
  if (!cachedGemini || cachedGeminiKey !== apiKey) {
    const client = new GoogleGenerativeAI(apiKey);
    cachedGemini = client.getGenerativeModel({
      model: GEMINI_MODEL,
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });
    cachedGeminiKey = apiKey;
  }
  return cachedGemini;
}

const REPORT_PROMPT = (locale: string) => `You are a senior Instagram strategist.
You receive metadata for ${"{N}"} Instagram public profile(s) and must produce a structured report
as JSON. Output language MUST be: ${locale}.

Be specific. Reference usernames, dates, numbers, hashtags and topics from the data.
Do not invent numbers that are not in the input. Flag missing data explicitly.

Schema:
{
  "summary": string,                   // 3-5 sentences
  "strengths": string[],               // 3-6 items
  "weaknesses": string[],              // 3-6 items
  "opportunities": string[],           // 3-6 items
  "riskFlags": string[],               // anything concerning (engagement drop, fake growth, etc)
  "contentPillars": string[],          // 3-6 recurring themes detected
  "recommendedActions": string[],      // 3-8 concrete steps
  "sections": [
    { "title": string, "body": string } // 3-6 markdown-friendly sections
  ]
}`;

export async function generateReport(
  profiles: InstagramProfileSnapshot[],
  opts: { locale?: string } = {}
): Promise<AIReport> {
  const locale = opts.locale ?? "pt-BR";
  const userPayload = JSON.stringify({ profiles }, null, 2);
  const promptHeader = REPORT_PROMPT(locale);
  const input = promptHeader + "\n\nINPUT:\n" + userPayload;

  let raw: string;
  if (HEADROOM_ENABLED) {
    raw = await generateViaOpenAICompat(input);
  } else {
    raw = await generateViaNativeGemini(input);
  }

  let parsed: AIReport;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const cleaned = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  }

  const safeSection = (s: any): ReportSection => ({
    title: typeof s?.title === "string" ? s.title : "Section",
    body: typeof s?.body === "string" ? s.body : "",
  });

  return {
    summary: parsed.summary ?? "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses : [],
    opportunities: Array.isArray(parsed.opportunities) ? parsed.opportunities : [],
    riskFlags: Array.isArray(parsed.riskFlags) ? parsed.riskFlags : [],
    contentPillars: Array.isArray(parsed.contentPillars) ? parsed.contentPillars : [],
    recommendedActions: Array.isArray(parsed.recommendedActions)
      ? parsed.recommendedActions
      : [],
    sections: Array.isArray(parsed.sections) ? parsed.sections.map(safeSection) : [],
    generatedAt: new Date().toISOString(),
    model: GEMINI_MODEL + (HEADROOM_ENABLED ? " +headroom" : ""),
  };
}

async function generateViaNativeGemini(input: string): Promise<string> {
  const model = getGeminiDirectModel();
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: input }] }],
  });
  return result.response.text();
}

async function generateViaOpenAICompat(input: string): Promise<string> {
  const client = await getOpenAIClient();
  const messages: ChatCompletionMessageParam[] = [
    { role: "system", content: "You produce concise JSON-only outputs." },
    { role: "user", content: input },
  ];
  const completion = await client.chat.completions.create({
    model: GEMINI_MODEL,
    messages,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });
  return completion.choices[0]?.message?.content ?? "";
}

export interface ProgressEvent {
  stage: string;
  detail?: string;
}

/**
 * Test helper used by smoke tests. Throws if no API key configured.
 */
export async function healthCheck(): Promise<boolean> {
  try {
    if (HEADROOM_ENABLED) {
      const completion = await (await getOpenAIClient()).chat.completions.create({
        model: GEMINI_MODEL,
        messages: [{ role: "user", content: "ok" }],
        max_tokens: 8,
      });
      return Boolean(completion.choices[0]?.message?.content);
    }
    const model = getGeminiDirectModel();
    const r = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "ok" }] }],
    });
    return Boolean(r.response.text());
  } catch (err) {
    console.error("[ai] healthCheck failed:", err);
    return false;
  }
}

/**
 * Returns the active configuration summary. Useful for /api/health endpoints.
 */
export function configSummary(): {
  headroom: boolean;
  headroomUrl: string | null;
  model: string;
  transport: "openai-compat" | "native-sdk";
} {
  return {
    headroom: HEADROOM_ENABLED,
    headroomUrl: HEADROOM_URL ?? null,
    model: GEMINI_MODEL,
    transport: HEADROOM_ENABLED ? "openai-compat" : "native-sdk",
  };
}
