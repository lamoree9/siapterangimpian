
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import DailyPlanner from "./pages/DailyPlanner";
import ExpenseTracker from "./pages/ExpenseTracker";
import AssetManager from "./pages/AssetManager";
import GratitudeJournal from "./pages/GratitudeJournal";
import HabitTracker from "./pages/HabitTracker";
import DreamMapper from "./pages/DreamMapper";
import ProblemMapper from "./pages/ProblemMapper";
import PositiveAffirmations from "./pages/PositiveAffirmations";
import SelfDevelopment from "./pages/SelfDevelopment";
import Quotes from "./pages/Quotes";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import GoalSetting from "./pages/GoalSetting";
import TimeBlocking from "./pages/TimeBlocking";
import ProgressTracking from "./pages/ProgressTracking";
import WeeklyReview from "./pages/WeeklyReview";
import DzikirDoa from "./pages/DzikirDoa";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/daily-planner" element={<DailyPlanner />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
            <Route path="/assets" element={<AssetManager />} />
            <Route path="/journal" element={<GratitudeJournal />} />
            <Route path="/habits" element={<HabitTracker />} />
            <Route path="/dreams" element={<DreamMapper />} />
            <Route path="/problems" element={<ProblemMapper />} />
            <Route path="/affirmations" element={<PositiveAffirmations />} />
            <Route path="/quotes" element={<Quotes />} />
            <Route path="/self-development" element={<SelfDevelopment />} />
            <Route path="/goal-setting" element={<GoalSetting />} />
            <Route path="/time-blocking" element={<TimeBlocking />} />
            <Route path="/progress-tracking" element={<ProgressTracking />} />
            <Route path="/weekly-review" element={<WeeklyReview />} />
            <Route path="/dzikir-doa" element={<DzikirDoa />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
