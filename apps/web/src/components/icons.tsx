import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function ScanEye(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 5 22 2.5" />
      <path d="m5 5-2.5-2.5" />
      <path d="M5 19 2.5 21.5" />
    </svg>
  );
}

export function GitFork(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M12 15.5V9a2 2 0 0 0-2-2H8.5" />
      <path d="M12 9a2 2 0 0 1 2-2h1.5" />
    </svg>
  );
}

export function WandSparkles(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 4 11 8 15 9.5 11 11 9 15 7 11 3 9.5 7 8 9 4Z" />
      <path d="m18 14 1.3 2.6L22 18l-2.7 1.4L18 22l-1.3-2.6L14 18l2.7-1.4L18 14Z" />
      <path d="m6 17-.8 1.6L3.5 19l1.7.7L6 21l.8-1.3 1.7-.7-1.7-1L6 17Z" />
    </svg>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function Spinner(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3a9 9 0 1 0 9 9" />
    </svg>
  );
}

export function Check(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m5 12 5 5 9-11" />
    </svg>
  );
}
