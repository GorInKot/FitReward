import type { ReactNode } from "react";

export type NavIconName = "home" | "workout" | "progress" | "plans" | "profile";

const PATHS: Record<NavIconName, ReactNode> = {
  home: <path d="M3 11l9-7 9 7M6 9.5V20a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9.5" />,
  workout: <path d="M4 8v8M8 6v12M16 6v12M20 8v8M8 12h8" />,
  progress: <path d="M3 21h18M7 21v-7M12 21V8M17 21v-11" />,
  plans: (
    <>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 9h6M9 13h6M9 17h3" />
    </>
  ),
  profile: (
    <>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
    </>
  )
};

export default function NavIcon({ name, className }: { name: NavIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}
