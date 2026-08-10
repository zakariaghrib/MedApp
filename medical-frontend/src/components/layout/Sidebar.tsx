import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  CreditCard,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  MoreVertical
} from "lucide-react";

import { Logo } from "@/components/ui/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authService } from "@/features/auth/services/auth.service";
import { useNavigate } from "react-router-dom";

interface NavItem {
  title: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const mainNav: NavItem[] = [
  {
    title: "Tableau de bord",
    href: "/",
    icon: LayoutDashboard,
  }
];

const coreModules: NavItem[] = [
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
    badge: 12,
  },
  {
    title: "Agenda",
    href: "/agenda",
    icon: Calendar,
    badge: 3,
  },
  {
    title: "Consultations",
    href: "/consultations",
    icon: FileText,
  },
  {
    title: "Facturation",
    href: "/facturation",
    icon: CreditCard,
  },
];

const preferencesNav: NavItem[] = [
  {
    title: "Paramètres",
    href: "/settings",
    icon: Settings,
  },
];

function NavLink({ item, isActive, isCollapsed }: { item: NavItem; isActive: boolean; isCollapsed: boolean }) {
  return (
    <Link
      to={item.href}
      className={cn(
        "flex items-center justify-between rounded-lg py-2 text-sm font-medium transition-all",
        isCollapsed ? "px-0 justify-center h-10 w-10 mx-auto" : "px-3",
        isActive
          ? "bg-white text-slate-900 shadow-sm"
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
      title={isCollapsed ? item.title : undefined}
    >
      <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3")}>
        <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : "text-slate-500")} />
        {!isCollapsed && <span>{item.title}</span>}
      </div>
      {!isCollapsed && item.badge && (
        <span className="flex h-5 items-center justify-center rounded-full bg-slate-200 px-2 text-xs font-medium text-slate-600">
          {item.badge}
        </span>
      )}
    </Link>
  );
}

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isCurrent = (href: string) => {
    if (href === "/" && location.pathname !== "/") return false;
    return location.pathname.startsWith(href);
  };

  return (
    <div 
      className={cn(
        "flex h-screen flex-col border-r border-slate-200 bg-slate-50 py-6 transition-all duration-300 relative",
        isCollapsed ? "w-20 px-2" : "w-64 px-4"
      )}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 hover:text-slate-900 shadow-sm z-10"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </button>

      {/* Logo */}
      <div className={cn("flex mb-8 overflow-hidden", isCollapsed ? "px-1 justify-center" : "px-3")}>
        <Logo textClassName={isCollapsed ? "hidden" : "block"} />
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar overflow-x-hidden">
        {/* Main Dashboard Link */}
        <div className="space-y-1">
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} isActive={isCurrent(item.href)} isCollapsed={isCollapsed} />
          ))}
        </div>

        {/* Core Modules */}
        <div>
          {!isCollapsed ? (
            <h4 className="mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Modules Principaux
            </h4>
          ) : (
            <div className="mb-2 h-4 border-t border-slate-200 mx-4 mt-4" />
          )}
          <div className="space-y-1">
            {coreModules.map((item) => (
              <NavLink key={item.href} item={item} isActive={isCurrent(item.href)} isCollapsed={isCollapsed} />
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div>
          {!isCollapsed ? (
            <h4 className="mb-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Préférences
            </h4>
          ) : (
            <div className="mb-2 h-4 border-t border-slate-200 mx-4 mt-4" />
          )}
          <div className="space-y-1">
            {preferencesNav.map((item) => (
              <NavLink key={item.href} item={item} isActive={isCurrent(item.href)} isCollapsed={isCollapsed} />
            ))}
          </div>
        </div>
      </div>
      
      {/* User profile snippet at bottom */}
      <div className="mt-auto pt-6 border-t border-slate-200">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex items-center rounded-lg hover:bg-slate-100 cursor-pointer transition-colors outline-none",
              isCollapsed ? "justify-center p-2 mx-auto w-10 h-10" : "gap-3 px-3 py-2 w-full"
            )}
          >
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-sky-100 text-sky-700 font-semibold text-sm">DR</AvatarFallback>
            </Avatar>
            
            {!isCollapsed && (
              <>
                <div className="flex flex-col overflow-hidden text-left flex-1">
                  <span className="text-sm font-medium text-slate-900 truncate">Dr. Richard</span>
                  <span className="text-xs text-slate-500 truncate">Médecin</span>
                </div>
                <MoreVertical className="h-4 w-4 text-slate-400" />
              </>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align={isCollapsed ? "center" : "end"} side="right" sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal flex items-center gap-3 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-sky-100 text-sky-700 font-semibold text-xs">DR</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Dr. Richard</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    richard@cabinet.com
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Mon Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => {
                authService.logout();
                navigate("/login");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
