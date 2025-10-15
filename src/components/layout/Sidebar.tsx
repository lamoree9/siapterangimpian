
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar, Target, List, Wallet, Book, Heart, Lightbulb, History, Sparkles, Quote } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
}

const NavItem = ({ icon: Icon, label, to, active }: NavItemProps) => {
  return (
    <Link to={to} className="w-full">
      <Button
        variant={active ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-3 mb-1",
          active && "bg-secondary text-secondary-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
      </Button>
    </Link>
  );
};

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  // Get current path to highlight active link
  const path = window.location.pathname;

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0 md:relative",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full overflow-auto py-6">
          <div className="px-3 mb-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Fitur Utama
            </p>
            <nav className="flex flex-col">
              <NavItem icon={List} label="Dashboard" to="/" active={path === "/"} />
              <NavItem icon={Calendar} label="Rencana Harian" to="/daily-planner" active={path === "/daily-planner"} />
              <NavItem icon={Wallet} label="Catatan Pengeluaran" to="/expenses" active={path === "/expenses"} />
              <NavItem icon={Book} label="Jurnal Syukur" to="/journal" active={path === "/journal"} />
              <NavItem icon={Heart} label="Kebiasaan Harian" to="/habits" active={path === "/habits"} />
              <NavItem icon={Sparkles} label="Afirmasi Positif" to="/affirmations" active={path === "/affirmations"} />
              <NavItem icon={Quote} label="Quote & Motivasi" to="/quotes" active={path === "/quotes"} />
              <NavItem icon={History} label="Riwayat" to="/history" active={path === "/history"} />
            </nav>
          </div>
          
          <div className="px-3 mb-6">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Pertumbuhan
            </p>
            <nav className="flex flex-col">
              <NavItem icon={Target} label="Peta Impian" to="/dreams" active={path === "/dreams"} />
              <NavItem icon={Lightbulb} label="Peta Masalah" to="/problems" active={path === "/problems"} />
              <NavItem icon={Heart} label="Self Development" to="/self-development" active={path === "/self-development"} />
            </nav>
          </div>
          
          <div className="mt-auto px-3">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-1">Insight Mingguan</h4>
              <p className="text-sm text-muted-foreground">
                Analisis AI akan tersedia setiap hari Minggu.
              </p>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                Lihat Insight
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
