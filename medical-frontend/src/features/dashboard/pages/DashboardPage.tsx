import { Users, Calendar, Clock, Activity } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { DashboardChart } from "../components/DashboardChart";
import { NextPatient } from "../components/NextPatient";
import { FinancialSummary } from "../components/FinancialSummary";
import { TodayAgenda } from "../components/TodayAgenda";
import { RecentActivity } from "../components/RecentActivity";

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tableau de bord</h1>
        <p className="text-slate-500 mt-1">
          Bienvenue sur votre espace MedApp. Voici un aperçu de votre activité.
        </p>
      </div>

      {/* KPIs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="Patients Enregistrés"
          value="1,248"
          icon={Users}
          trend="up"
          trendValue="+12 ce mois"
          iconClassName="bg-sky-50 text-sky-600"
        />
        <StatCard
          title="Rendez-vous Aujourd'hui"
          value="14"
          icon={Calendar}
          description="3 annulés"
          iconClassName="bg-indigo-50 text-indigo-600"
        />
        <StatCard
          title="En Salle d'attente"
          value="2"
          icon={Clock}
          trend="neutral"
          trendValue="Temps moy: 15min"
          iconClassName="bg-amber-50 text-amber-600"
        />
        <StatCard
          title="Consultations (Semaine)"
          value="68"
          icon={Activity}
          trend="up"
          trendValue="+8%"
          iconClassName="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Agenda (takes up 2 columns on large screens) */}
        <div className="xl:col-span-2 flex flex-col gap-6 w-full min-w-0">
          <NextPatient />
          <div className="flex-1 flex flex-col min-h-0">
            <TodayAgenda />
          </div>
        </div>

        {/* Right Column: Chart, Finance & Recent Activity */}
        <div className="flex flex-col gap-6 w-full min-w-0">
          <DashboardChart />
          <FinancialSummary />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
