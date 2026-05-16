import { useEffect, useRef } from "react";
import { Navigate, NavLink, Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Progress from "./pages/Progress";
import Plans from "./pages/Plans";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import { useTelegram } from "./hooks/useTelegram";
import { useProfileStore } from "./store/profileStore";
import { useAchievementStore } from "./store/achievementStore";
import { hasSeenGuide, useGuideStore } from "./store/guideStore";
import { useTranslation } from "./i18n";
import { updateProfile } from "./utils/api";
import AchievementToast from "./components/AchievementToast";
import AppGuide from "./components/AppGuide";

export default function App() {
  useTelegram();
  const location = useLocation();
  const { t, locale } = useTranslation();
  const profile = useProfileStore((s) => s.profile);
  const loading = useProfileStore((s) => s.loading);
  const error = useProfileStore((s) => s.error);
  const fetched = useProfileStore((s) => s.fetched);
  const load = useProfileStore((s) => s.load);
  const setProfile = useProfileStore((s) => s.setProfile);
  const loadAchievements = useAchievementStore((s) => s.load);
  const refreshAchievements = useAchievementStore((s) => s.refresh);
  const openGuide = useGuideStore((s) => s.openGuide);
  const contextSyncInFlight = useRef(false);
  const guideAutoChecked = useRef(false);

  useEffect(() => {
    if (!fetched) {
      void load();
    }
  }, [fetched, load]);

  // Push the device timezone and active locale to the backend so the bot can
  // send training-day reminders at the right local hour, in the right language.
  useEffect(() => {
    if (!profile || contextSyncInFlight.current) return;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    const patch: { timezone?: string; locale?: "ru" | "en" } = {};
    if (profile.timezone !== timezone) patch.timezone = timezone;
    if (profile.locale !== locale) patch.locale = locale;
    if (!patch.timezone && !patch.locale) return;
    contextSyncInFlight.current = true;
    updateProfile(patch)
      .then((updated) => setProfile(updated))
      .catch(() => {
        // non-critical — reminders just fall back to stored values
      })
      .finally(() => {
        contextSyncInFlight.current = false;
      });
  }, [profile, locale, setProfile]);

  // Initial load + re-check on every route change so unlocks triggered by
  // POST actions (session complete, log set, save metric) surface as toasts.
  useEffect(() => {
    if (!profile || !profile.onboardingCompleted) return;
    void loadAchievements();
  }, [profile, loadAchievements]);

  useEffect(() => {
    if (!profile || !profile.onboardingCompleted) return;
    void refreshAchievements();
  }, [location.pathname, profile, refreshAchievements]);

  // Show the section guide once, on the first launch after onboarding —
  // but only on a real screen, not over the onboarding result page.
  useEffect(() => {
    if (guideAutoChecked.current) return;
    if (!profile || !profile.onboardingCompleted) return;
    if (location.pathname === "/onboarding") return;
    guideAutoChecked.current = true;
    if (!hasSeenGuide()) openGuide();
  }, [profile, location.pathname, openGuide]);

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
      <AchievementToast />
      <AppGuide />
    </div>
  );
}
