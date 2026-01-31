import { ReactNode, useMemo } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import { BrandLogo } from "../BrandLogo";
import { NAV_ITEMS, type NavItem } from "./navigationConfig";

interface AppShellProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * AppShell - Main layout component with sidebar navigation
 * 
 * Provides consistent layout structure for authenticated pages.
 * Navigation items are configured in navigationConfig.tsx for easier maintenance.
 * 
 * TODO: Add mobile responsiveness
 * - The sidebar uses fixed 280px width which may not work well on mobile
 * - Consider adding a hamburger menu/drawer pattern for screens < 768px
 * - Mobile navigation should overlay content rather than push it
 */
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
    
    // Validate and normalize role with explicit error logging
    const userRole = user.role;
    const validRoles = ["admin", "hr", "viewer"] as const;
    const normalizedRole: "admin" | "hr" | "viewer" = validRoles.includes(
      userRole as any
    )
      ? (userRole as "admin" | "hr" | "viewer")
      : (() => {
          // Log invalid role for debugging - this indicates a data integrity issue
          console.error(
            `Invalid user role detected: "${userRole}" for user ${user.employee_id}. Defaulting to "viewer".`
          );
          return "viewer";
        })();
    
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
