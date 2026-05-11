import { Link, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Workout from "./pages/Workout";
import Progress from "./pages/Progress";
import Plans from "./pages/Plans";
import Profile from "./pages/Profile";
import { useTelegram } from "./hooks/useTelegram";

export default function App() {
  useTelegram();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="sticky top-0 border-b border-slate-800 bg-slate-950/90 p-4 backdrop-blur">
        <h1 className="text-lg font-semibold">FitReward</h1>
      </header>
      <main className="p-4 pb-20">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/workout" element={<Workout />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t border-slate-800 bg-slate-900 p-3 text-sm">
        <Link to="/">Home</Link>
        <Link to="/workout">Workout</Link>
        <Link to="/progress">Progress</Link>
        <Link to="/plans">Plans</Link>
        <Link to="/profile">Profile</Link>
      </nav>
    </div>
  );
}
