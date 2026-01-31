import { ReactNode } from "react";

/**
 * Navigation configuration for AppShell sidebar
 * 
 * Centralized navigation structure to make route changes easier.
 * Each nav item defines the route, label, icon, and role-based access.
 * 
 * To add a new section:
 * 1. Add the route to your router configuration
 * 2. Add a new nav item here with appropriate roles
 * 3. Create the corresponding icon in navIcon if needed
 */

export interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  roles?: Array<"admin" | "hr" | "viewer">;
}

/**
 * Icon library for navigation items
 * Exported for potential reuse in other components (e.g., page headers, breadcrumbs)
 */
export const navIcon = {
  dashboard: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  compliance: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 11l3 3L22 4" />
      <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
    </svg>
  ),
  attendance: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 1.5" />
    </svg>
  ),
  recruitment: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 7a4 4 0 118 0 4 4 0 01-8 0z" />
      <path d="M3 21v-1a6 6 0 016-6h6a6 6 0 016 6v1" />
    </svg>
  ),
  onboarding: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 6v12" />
      <path d="M16 10l-4-4-4 4" />
      <path d="M8 14l4 4 4-4" />
    </svg>
  ),
  home: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9.5l9-7 9 7" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Overview",
    to: "/admin",
    icon: navIcon.dashboard,
    roles: ["admin", "hr"],
  },
  {
    label: "Compliance",
    to: "/compliance",
    icon: navIcon.compliance,
    roles: ["admin", "hr"],
  },
  {
    label: "Attendance",
    to: "/attendance",
    icon: navIcon.attendance,
    roles: ["admin", "hr", "viewer"],
  },
  {
    label: "Recruitment",
    to: "/recruitment",
    icon: navIcon.recruitment,
    roles: ["admin", "hr"],
  },
  {
    label: "Onboarding",
    to: "/onboarding",
    icon: navIcon.onboarding,
    roles: ["admin", "hr"],
  },
];
