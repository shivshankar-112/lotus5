// ── shadcn/ui ──────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip, TooltipContent,
    TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ── Icons ──────────────────────────────────────────────────
import {
    LayoutDashboard, TrendingUp, TrendingDown, Users,
    Settings, Bell, DollarSign, Activity, ShieldCheck, LogOut,
    PanelLeftClose, PanelLeftOpen } from "lucide-react";

// ═══════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════
interface NavItem {
    icon: React.FC<{ className?: string }>;
    label: string;
    href: string;
    badge?: number;
    active?: boolean;
}


// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════
const NAV_ITEMS: NavItem[] = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin", active: false },
    { icon: TrendingUp, label: "Deposits", href: "/admin/deposits", active: true, badge: 3 },
    { icon: TrendingDown, label: "Withdrawals", href: "/admin/withdrawals", active: false, badge: 2 },
    { icon: Users, label: "Users", href: "/admin/users", active: false },
    { icon: Activity, label: "Analytics", href: "/admin/analytics", active: false },
    { icon: ShieldCheck, label: "Compliance", href: "/admin/compliance", active: false, badge: 5 },
    { icon: Settings, label: "Settings", href: "/admin/settings", active: false },
];

// ═══════════════════════════════════════════════════════════
// ── COMPONENT: TopBar ──────────────────────────────────────
// ═══════════════════════════════════════════════════════════
export function TopBar({ onToggle, collapsed, activeRoute }: { onToggle: () => void; collapsed: boolean, activeRoute:string }) {
    const activeNav = NAV_ITEMS.find(n=>n.href == activeRoute)
    return (

        <div className="flex items-center px-2 border border-white/8 bg-[#0b0d14]">

            {/* Side bar toggle button */}
            <Button
                onClick={onToggle}
                variant="ghost"
                size="icon"
                className="w-7 h-7 rounded-full text-slate-500 hover:text-white shadow-lg z-10"
            >
                {collapsed ? <PanelLeftOpen className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
            </Button>

            <header className="w-full h-16 flex items-center justify-between px-8 border-b border-white/6 bg-[#0b0d14]/80 backdrop-blur-sm shrink-0">
                <div>
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-600">Finance Admin / Deposits</p>
                    <h1 className="text-white font-bold text-lg tracking-tight mt-0.5">{activeNav?.label} Management</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="w-9 h-9 text-slate-500 hover:text-white relative">
                        <Bell className="w-4 h-4" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                    </Button>
                    <Avatar className="w-8 h-8 cursor-pointer">
                        <AvatarFallback className="bg-linear-to-br from-emerald-600 to-teal-700 text-white text-xs font-bold">AD</AvatarFallback>
                    </Avatar>
                </div>
            </header>

        </div>
    );
}

// ═══════════════════════════════════════════════════════════
// ── COMPONENT: Sidebar ─────────────────────────────────────
// ═══════════════════════════════════════════════════════════
interface SidebarProps { collapsed: boolean; onToggle: () => void, activeRoute:string }
export function Sidebar({ collapsed, onToggle, activeRoute }: SidebarProps) {

    return (
        <aside
            className={`relative flex flex-col border-r border-white/6 bg-[#0b0d14] transition-all duration-300 ease-in-out shrink-0
        ${collapsed ? "w-17" : "w-60"}`}
        >
            {/* Logo */}
            <div className={`flex items-center h-16 px-4 border-b border-white/6 gap-3 overflow-hidden`}>
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0">
                    <DollarSign className="w-4 h-4 text-white" />
                </div>
                {!collapsed && (
                    <div className="overflow-hidden">
                        <p className="text-white font-bold text-sm tracking-tight whitespace-nowrap">FinanceAdmin</p>
                        <p className="text-slate-600 text-[10px] whitespace-nowrap">Management Console</p>
                    </div>
                )}
            </div>

            {/* Nav */}
            <ScrollArea className="flex-1 py-4">
                <nav className="space-y-1 px-2">
                    <TooltipProvider delayDuration={0}>
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Tooltip key={item.label}>
                                    <TooltipTrigger asChild>
                                        <a
                                            href={item.href}
                                            className={`flex relative items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group
                        ${item.href == activeRoute
                                                    ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
                                                    : "text-slate-500 hover:text-slate-200 hover:bg-white/5"
                                                } ${collapsed ? "justify-center" : ""}`}
                                        >
                                            <Icon className={`w-4 h-4 shrink-0 ${item.href == activeRoute ? "text-emerald-400" : "text-slate-500 group-hover:text-slate-300"}`} />
                                            {!collapsed && (
                                                <span className="flex-1 truncate">{item.label}</span>
                                            )}
                                            {!collapsed && item.badge && (
                                                <span className="ml-auto w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold flex items-center justify-center border border-emerald-500/30">
                                                    {item.badge}
                                                </span>
                                            )}
                                            {collapsed && item.badge && (
                                                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                                            )}
                                        </a>
                                    </TooltipTrigger>
                                    {collapsed && (
                                        <TooltipContent side="right" className="bg-[#1a1d27] border-white/10 text-white text-xs">
                                            {item.label}
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            );
                        })}
                    </TooltipProvider>
                </nav>
            </ScrollArea>

            <Separator className="bg-white/6" />

            {/* User */}
            <div className={`flex items-center gap-3 p-3 overflow-hidden`}>
                <Avatar className="w-8 h-8 shrink-0">
                    <AvatarFallback className="bg-linear-to-br from-emerald-600 to-teal-700 text-white text-xs font-bold">AD</AvatarFallback>
                </Avatar>
                {!collapsed && (
                    <div className="flex-1 overflow-hidden">
                        <p className="text-white text-xs font-semibold truncate">Admin User</p>
                        <p className="text-slate-600 text-[10px] truncate">admin@company.com</p>
                    </div>
                )}
                {!collapsed && (
                    <Button variant="ghost" size="icon" className="w-7 h-7 text-slate-600 hover:text-red-400 shrink-0">
                        <LogOut className="w-3.5 h-3.5" />
                    </Button>
                )}
            </div>

            {/* Collapse toggle */}
            {/* <Button
                onClick={onToggle}
                variant="ghost"
                size="icon"
                className="absolute right-4 top-18 w-7 h-7 rounded-full border border-white/8 bg-[#0b0d14] text-slate-500 hover:text-white shadow-lg z-10"
            >
                {collapsed ? <PanelLeftOpen className="w-3 h-3" /> : <PanelLeftClose className="w-3 h-3" />}
            </Button> */}
        </aside>
    );
}

