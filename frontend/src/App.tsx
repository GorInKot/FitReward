import { NavLink, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Progress from "./pages/Progress";
import Plans from "./pages/Plans";
import Profile from "./pages/Profile";
import { useTelegram } from "./hooks/useTelegram";

const navItems = [
  { to: "/", label: "Главная" },
  { to: "/workout", label: "Тренировка" },
  { to: "/progress", label: "Прогресс" },
  { to: "/plans", label: "Планы" },
  { to: "/profile", label: "Профиль" }
];

export default function App() {
  useTelegram();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-slate-950/90 p-4 backdrop-blur">
        <h1 className="text-lg font-semibold">FitReward</h1>
      </header>
      <main className="mx-auto max-w-lg p-4 pb-24">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
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
    </div>
  );
}
