import { Bell, Search, Menu, Plus, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-6 shadow-sm">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Toggle (hidden on desktop) */}
        <Button variant="ghost" size="icon" className="md:hidden shrink-0">
          <Menu className="h-5 w-5 text-slate-600" />
        </Button>

        {/* Breadcrumb / Page Title */}
        <div className="hidden md:flex items-center text-sm font-medium text-slate-500">
          <span className="hover:text-slate-900 cursor-pointer transition-colors">Espace Cabinet</span>
          <ChevronRight className="h-4 w-4 mx-1 text-slate-300" />
          <span className="text-slate-900 bg-slate-100 px-2 py-1 rounded-md">Tableau de bord</span>
        </div>
      </div>

      <div className="flex items-center gap-4 flex-1 justify-end max-w-2xl">
        {/* Command Menu Trigger (Fake input for now) */}
        <button className="hidden md:flex items-center justify-between w-64 h-9 px-3 rounded-md border border-slate-200 bg-slate-50 text-sm text-slate-500 shadow-sm hover:border-slate-300 hover:bg-white transition-all ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500">
          <span className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            <span className="font-normal">Rechercher...</span>
          </span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-slate-200 bg-slate-100 px-1.5 font-mono text-[10px] font-medium text-slate-500">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>

        {/* Separator */}
        <div className="hidden md:block h-6 w-px bg-slate-200 mx-1"></div>

        {/* Help & Notifications */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-700 hover:bg-slate-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
          </Button>
        </div>

        {/* Quick Action Button */}
        <Button className="bg-sky-600 hover:bg-sky-700 text-white shadow-sm ml-2 hidden sm:flex">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau
        </Button>
      </div>
    </header>
  );
}
