/**
 * Shared types and contracts between web app, worker, and services.
 */

export type JobStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "cancelled";

export type JobMode = "single_profile" | "compare_profiles";

/**
 * What the worker has to do for a job.
 */
export interface JobSpec {
  jobId: string;
  mode: JobMode;
  /** Target Instagram usernames (without leading @). For single_profile use [username]. */
  usernames: string[];
  /** Optional max age for content considered "recent" (days). Defaults to 30. */
  recentDays?: number;
  /** Optional locale for AI report (e.g. "pt-BR"). */
  locale?: string;
}

/**
 * Raw metadata extracted from Instagram for a single profile.
 */
export interface InstagramProfileSnapshot {
  username: string;
  fullName: string | null;
  biography: string | null;
  externalUrl: string | null;
  followers: number;
  follows: number;
  postsCount: number;
  isVerified: boolean;
  isPrivate: boolean;
  isBusiness: boolean;
  profilePicUrl: string | null;
  fetchedAt: string; // ISO-8601
  recentPosts: InstagramPostSummary[];
  topHashtags: string[];
}

export interface InstagramPostSummary {
  shortcode: string;
  url: string;
  caption: string | null;
  likes: number;
  comments: number;
  timestamp: string; // ISO-8601
  type: "image" | "video" | "carousel" | "reel";
  hashtags: string[];
  mentions: string[];
}

export interface ReportSection {
  title: string;
  body: string;
}

export interface AIReport {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  riskFlags: string[];
  contentPillars: string[];
  recommendedActions: string[];
  sections: ReportSection[];
  generatedAt: string;
  model: string;
}

export interface JobResult {
  jobId: string;
  status: JobStatus;
  profiles: InstagramProfileSnapshot[];
  report: AIReport | null;
  errorMessage: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  durationMs: number | null;
}
