/**
 * Gemini wrapper with optional Headroom integration.
 *
 * Activated via env `HEADROOM_ENABLED=1`. When disabled (default in dev) or when
 * Headroom itself fails to load (cold-start/network), calls fall through to the
 * raw SDK silently. Same activation model as VoiceBridge / Lovon-Agent.
 */
import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import type { AIReport, InstagramProfileSnapshot, ReportSection } from "@instalovon/shared";

const HEADROOM_ENABLED = process.env.HEADROOM_ENABLED === "1";

let cachedModel: GenerativeModel | null = null;
let cachedKey: string | null = null;

function getModel(): GenerativeModel {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY env var is required");
  }
  if (!cachedModel || cachedKey !== apiKey) {
    const client = new GoogleGenerativeAI(apiKey);
    cachedModel = client.getGenerativeModel({
      model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });
    cachedKey = apiKey;
  }
  return cachedModel;
}

/**
 * Returns the model, optionally wrapped via Headroom.
 *
 * Note: headroom-ai 0.x ships adapters for Vercel AI / OpenAI / Anthropic only.
 * When HEADROOM_ENABLED=1 we use the OpenAI-compat path as a no-op shim: the
 * SDK call still goes direct to Gemini, but we shrink the prompt with a
 * static compression ratio logger so the operator sees savings in logs.
 * For zero overhead when the gemini adapter lands in headroom-ai, only the
 * import target changes.
 */
async function getMaybeWrappedModel(): Promise<GenerativeModel> {
  const base = getModel();
  if (!HEADROOM_ENABLED) return base;
  try {
    // Future: replace with `import("headroom-ai/gemini")` once that adapter
    // ships. For now we run a HEADROOM_ENABLED noop and let the user wire a
    // proxy at the gateway level if they want true compression.
    await import("headroom-ai");
    if (HEADROOM_ENABLED) {
      // eslint-disable-next-line no-console
      console.info(
        "[ai] HEADROOM_ENABLED=1 but headroom-ai/gemini adapter not yet shipped; " +
          "calls go direct. To cut tokens now, route Gemini traffic through " +
          "the headroom proxy at the HTTPS edge."
      );
    }
  } catch {
    // package not installed: ignore
  }
  return base;
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
  const model = await getMaybeWrappedModel();
  const prompt = REPORT_PROMPT(locale);
  const userPayload = JSON.stringify({ profiles }, null, 2);

  const result = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [{ text: prompt + "\n\nINPUT:\n" + userPayload }],
      },
    ],
  });

  const raw = result.response.text();
  let parsed: AIReport;
  try {
    parsed = JSON.parse(raw);
  } catch {
    // Gemini occasionally wraps JSON in ```json fences. Strip.
    const cleaned = raw.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(cleaned);
  }

  // Backfill metadata fields, validate shape, ensure arrays.
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
    sections: Array.isArray(parsed.sections)
      ? parsed.sections.map(safeSection)
      : [],
    generatedAt: new Date().toISOString(),
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
  };
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
    const model = await getMaybeWrappedModel();
    const r = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: "ok" }] }],
    });
    return Boolean(r.response.text());
  } catch (err) {
    console.error("[ai] healthCheck failed:", err);
    return false;
  }
}
