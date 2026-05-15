import { useEffect } from "react";
import { Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Progress from "./pages/Progress";
import Plans from "./pages/Plans";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import { useTelegram } from "./hooks/useTelegram";
import { useProfileStore } from "./store/profileStore";
import { useTranslation } from "./i18n";

export default function App() {
  useTelegram();
  const location = useLocation();
  const { t } = useTranslation();
  const profile = useProfileStore((s) => s.profile);
  const loading = useProfileStore((s) => s.loading);
  const error = useProfileStore((s) => s.error);
  const fetched = useProfileStore((s) => s.fetched);
  const load = useProfileStore((s) => s.load);

  useEffect(() => {
    if (!fetched) {
      void load();
    }
  }, [fetched, load]);

  const navItems = [
    { to: "/", label: t("nav.home") },
    { to: "/workout", label: t("nav.workout") },
    { to: "/progress", label: t("nav.progress") },
    { to: "/plans", label: t("nav.plans") },
    { to: "/profile", label: t("nav.profile") }
  ];

  const isOnboardingRoute = location.pathname === "/onboarding";
  const needsOnboarding = profile !== null && !profile.onboardingCompleted;

  if (loading && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-300">
        {t("app.loading")}
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-center text-rose-300">
        {t("app.loadingProfile", { error })}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 p-4 backdrop-blur">
        <h1 className="text-lg font-semibold">{t("app.title")}</h1>
      </header>
      <main className="mx-auto max-w-lg p-4 pb-24">
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={needsOnboarding ? <Navigate to="/onboarding" replace /> : <Home />} />
          <Route path="/workout" element={needsOnboarding ? <Navigate to="/onboarding" replace /> : <Workout />} />
          <Route path="/progress" element={needsOnboarding ? <Navigate to="/onboarding" replace /> : <Progress />} />
          <Route path="/plans" element={needsOnboarding ? <Navigate to="/onboarding" replace /> : <Plans />} />
          <Route path="/profile" element={needsOnboarding ? <Navigate to="/onboarding" replace /> : <Profile />} />
        </Routes>
      </main>
      {!isOnboardingRoute && (
        <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-slate-800 bg-slate-900/95 p-3 text-xs">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 ${isActive ? "bg-emerald-500 text-slate-950" : "text-slate-300"}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
