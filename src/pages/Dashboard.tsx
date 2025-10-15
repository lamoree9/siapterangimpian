
import React, { useMemo } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ProgressCircle } from "@/components/dashboard/ProgressCircle";
import { QuoteCard } from "@/components/quotes/QuoteCard";
import { Calendar, Target, Wallet, Book, Heart, Lightbulb } from "lucide-react";
import { useTasks } from "@/hooks/useTasks";
import { useHabits } from "@/hooks/useHabits";
import { useExpenses } from "@/hooks/useExpenses";
import { useGratitude } from "@/hooks/useGratitude";
import { useDreams } from "@/hooks/useDreams";
import { useProblems } from "@/hooks/useProblems";
import { useQuotes } from "@/hooks/useQuotes";
import { format } from "date-fns";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
};

const getFormattedDate = () => {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  
  const now = new Date();
  const dayName = days[now.getDay()];
  const day = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();
  
  return `${dayName}, ${day} ${month} ${year}`;
};

const Dashboard = () => {
  const { tasks } = useTasks();
  const { getHabitsForDate, getStats: getHabitStats } = useHabits();
  const { expenses, getMonthlySummary } = useExpenses();
  const { getEntryByDate } = useGratitude();
  const { dreams } = useDreams();
  const { problems } = useProblems();
  const { getDailyQuote } = useQuotes();

  const today = new Date().toISOString().split('T')[0];
  
  // Tasks data
  const todayTasks = useMemo(() => 
    tasks.filter(task => {
      const taskDate = new Date(task.createdAt).toISOString().split('T')[0];
      return taskDate === today;
    }), [tasks, today]
  );
  
  const completedTasksCount = todayTasks.filter(t => t.completed).length;
  const totalTasksCount = todayTasks.length;
  const taskProgress = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // Habits data
  const todayHabits = getHabitsForDate(today);
  const completedHabitsCount = todayHabits.filter(h => h.completed).length;
  const totalHabitsCount = todayHabits.length;
  const habitProgress = totalHabitsCount > 0 ? Math.round((completedHabitsCount / totalHabitsCount) * 100) : 0;

  // Expenses data
  const todayExpenses = useMemo(() => 
    expenses.filter(expense => expense.date === today), 
    [expenses, today]
  );
  const todayTotal = useMemo(() => 
    todayExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0),
    [todayExpenses]
  );
  const monthlySummary = getMonthlySummary();

  // Gratitude data
  const todayGratitude = getEntryByDate(today);

  // Dreams data
  const activeDreams = dreams.filter(d => d.progress < 100);
  const closestDream = activeDreams.sort((a, b) => b.progress - a.progress)[0];

  // Problems data
  const activeProblems = problems.filter(p => p.status === 'active');
  const priorityProblem = activeProblems.sort((a, b) => b.difficulty - a.difficulty)[0];

  // Quote data
  const dailyQuote = getDailyQuote();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">{getGreeting()}!</h1>
          <p className="text-muted-foreground">
            {getFormattedDate()}
          </p>
          <p className="text-muted-foreground">
            Mari mulai hari yang produktif dan bermakna.
          </p>
        </div>

        <QuoteCard quote={dailyQuote} />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Rencana Hari Ini"
            icon={<Calendar className="h-4 w-4" />}
            to="/daily-planner"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-semibold">
                    {completedTasksCount}/{totalTasksCount}
                  </div>
                  <p className="text-xs text-muted-foreground">tugas selesai</p>
                </div>
                <ProgressCircle percentage={taskProgress} size={60} />
              </div>
              {todayTasks.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {todayTasks.slice(0, 5).map(task => (
                    <li 
                      key={task.id} 
                      className={task.completed ? "line-through opacity-70" : ""}
                    >
                      {task.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada tugas untuk hari ini
                </p>
              )}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Kebiasaan Harian"
            icon={<Heart className="h-4 w-4" />}
            to="/habits"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-2xl font-semibold">
                    {completedHabitsCount}/{totalHabitsCount}
                  </div>
                  <p className="text-xs text-muted-foreground">kebiasaan hari ini</p>
                </div>
                <ProgressCircle percentage={habitProgress} size={60} />
              </div>
              {todayHabits.length > 0 ? (
                <div className="grid grid-cols-2 gap-2">
                  {todayHabits.slice(0, 4).map(habit => (
                    <div 
                      key={habit.id} 
                      className={`text-xs p-2 rounded flex items-center gap-1 ${
                        habit.completed 
                          ? "bg-terang-100 text-terang-800" 
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <span className={`block w-2 h-2 rounded-full ${
                        habit.completed ? "bg-terang-500" : "bg-muted-foreground"
                      }`}></span>
                      <span className="truncate">{habit.name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada kebiasaan untuk hari ini
                </p>
              )}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Pengeluaran Hari Ini"
            icon={<Wallet className="h-4 w-4" />}
            to="/expenses"
          >
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-semibold">
                  Rp{todayTotal.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground">
                  Total bulan ini: Rp{monthlySummary.totalAmount.toLocaleString('id-ID')}
                </p>
              </div>
              {todayExpenses.length > 0 ? (
                <ul className="text-sm space-y-1">
                  {todayExpenses.slice(0, 3).map(expense => (
                    <li key={expense.id} className="flex justify-between">
                      <span className="truncate">{expense.description}</span>
                      <span className="whitespace-nowrap ml-2">
                        Rp{expense.amount.toLocaleString('id-ID')}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada pengeluaran hari ini
                </p>
              )}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Jurnal Syukur"
            icon={<Book className="h-4 w-4" />}
            to="/journal"
          >
            {todayGratitude ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Mood: {todayGratitude.mood}</p>
                <ul className="text-sm space-y-1">
                  {todayGratitude.entries.slice(0, 3).map((entry, idx) => (
                    <li key={idx} className="text-muted-foreground">• {entry}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Belum ada catatan jurnal untuk hari ini.
                </p>
                <div className="mt-3 text-sm text-primary">Catat momen syukur hari ini →</div>
              </>
            )}
          </DashboardCard>

          <DashboardCard
            title="Peta Impian"
            icon={<Target className="h-4 w-4" />}
            to="/dreams"
            className="bg-gradient-to-br from-impian-50 to-background border-impian-100"
          >
            <div className="space-y-2">
              <h4 className="font-medium">Impian Terdekat</h4>
              {closestDream ? (
                <div className="space-y-2">
                  <div className="text-sm p-2 bg-impian-100/50 rounded border border-impian-200">
                    <div className="flex justify-between">
                      <span className="truncate">{closestDream.name}</span>
                      <span className="text-xs text-impian-600 whitespace-nowrap ml-2">
                        {closestDream.progress}%
                      </span>
                    </div>
                    <div className="w-full h-1 mt-1 bg-muted overflow-hidden rounded-full">
                      <div 
                        className="bg-impian-500 h-full rounded-full" 
                        style={{ width: `${closestDream.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada impian yang dicatat
                </p>
              )}
            </div>
          </DashboardCard>

          <DashboardCard
            title="Peta Masalah"
            icon={<Lightbulb className="h-4 w-4" />}
            to="/problems"
            className="bg-gradient-to-br from-terang-50 to-background border-terang-100"
          >
            <div className="space-y-2">
              <h4 className="font-medium">Masalah Prioritas</h4>
              {priorityProblem ? (
                <div className="p-2 bg-terang-100/50 border border-terang-200 rounded text-sm">
                  <div className="truncate">{priorityProblem.name}</div>
                  <div className="text-xs text-terang-600 mt-0.5">
                    {priorityProblem.solutions.filter(s => !s.completed).length} langkah tersisa
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Belum ada masalah yang dicatat
                </p>
              )}
            </div>
          </DashboardCard>
        </div>

        <div className="bg-muted/50 border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-impian-500" />
            <h3 className="font-medium">Insight AI</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Berdasarkan pola 7 hari terakhir, kamu lebih produktif di pagi hari. 
            Cobalah untuk menjadwalkan tugas-tugas penting sebelum jam 11 pagi.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
