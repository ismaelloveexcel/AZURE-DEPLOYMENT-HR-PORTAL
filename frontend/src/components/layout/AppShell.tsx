import { ReactNode, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { BrandLogo } from "../BrandLogo";

interface NavItem {
  label: string;
  to: string;
  icon: ReactNode;
  roles?: Array<"admin" | "hr" | "viewer">;
}

interface AppShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

const navIcon = {
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

const NAV_ITEMS: NavItem[] = [
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

export function AppShell({
  title,
  subtitle,
  actions,
  children,
}: AppShellProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthContext();

  const filteredNav = useMemo(() => {
    if (!user) return [] as NavItem[];
    const normalizedRole: "admin" | "hr" | "viewer" =
      user.role === "admin" || user.role === "hr" || user.role === "viewer"
        ? user.role
        : "viewer";
    return NAV_ITEMS.filter(
      (item) => !item.roles || item.roles.includes(normalizedRole),
    );
  }, [user]);

  return (
    <div className="app-shell">
      <header className="app-shell__topbar">
        <div className="app-shell__topbar-inner">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <BrandLogo variant="light" />
          </button>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="text-sm text-right text-white/80">
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    {user.role}
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn--ghost-inverted"
                  onClick={() => navigate("/")}
                >
                  <span>Portal Home</span>
                </button>
                <button
                  type="button"
                  className="btn btn--outline-inverted"
                  onClick={logout}
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                type="button"
                className="btn btn--outline-inverted"
                onClick={() => navigate("/")}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="app-shell__inner">
        <aside className="app-shell__sidebar">
          <div className="segment-label">Workspace</div>
          <nav className="nav-list">
            {filteredNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-link ${isActive ? "nav-link--active" : ""}`
                }
                end={item.to === "/admin"}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="segment-label mt-8">Quick Links</div>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              className={`nav-link ${location.pathname === "/" ? "nav-link--active" : ""}`}
              onClick={() => navigate("/")}
            >
              {navIcon.home}
              <span>Employee Portal</span>
            </button>
          </div>
        </aside>

        <main className="app-shell__content">
          <div className="flex flex-wrap items-start justify-between gap-6 mb-10">
            <div>
              <h1 className="text-3xl font-semibold text-primary-900 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-primary-600 mt-2 max-w-2xl">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}
