import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  LayoutDashboard, Package, FolderOpen, ShoppingCart,
  Settings, FileText, BarChart2,   LogOut, ExternalLink, Menu, X,
  Sparkles, BookImage, Tag, Star, Bell,

} from "lucide-react";
import { useAdminLogout } from "@workspace/api-client-react";
import { useTranslation } from "react-i18next";

const navItems = [
  { label: "admin.dashboard", href: "/admin",              icon: LayoutDashboard },
  { label: "admin.products", href: "/admin/products",     icon: Package },
  { label: "admin.collections", href: "/admin/collections",  icon: FolderOpen },
  { label: "admin.orders", href: "/admin/orders",       icon: ShoppingCart },
  { label: "admin.analytics", href: "/admin/analytics",    icon: BarChart2 },
  { label: "admin.lookbook", href: "/admin/lookbook",     icon: BookImage },
  { label: "admin.promoCodes", href: "/admin/promo-codes",  icon: Tag },
  { label: "admin.reviews", href: "/admin/reviews",      icon: Star },
  { label: "admin.stockAlerts", href: "/admin/stock-alerts", icon: Bell },
  { label: "admin.content", href: "/admin/content",      icon: FileText },
  { label: "admin.settings", href: "/admin/settings",     icon: Settings },
];

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export default function AdminLayout({ children, title, subtitle }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const localizedTitle = title.startsWith("admin.") ? t(title) : ({
    Dashboard: t("admin.dashboard"), Products: t("admin.products"), Collections: t("admin.collections"), Orders: t("admin.orders"), Analytics: t("admin.analytics"), Lookbook: t("admin.lookbook"), "Promo Codes": t("admin.promoCodes"), Reviews: t("admin.reviews"), "Stock Alerts": t("admin.stockAlerts"), Content: t("admin.content"), Settings: t("admin.settings"), "Store Settings": t("admin.settings"),
  } as Record<string, string>)[title] ?? title;
  const adminLogout = useAdminLogout();

  async function handleLogout() {
    await adminLogout.mutateAsync();
    localStorage.removeItem("sk-admin-session");
    setLocation("/admin/login");
  }

  return (
    <div className="min-h-screen flex bg-sidebar text-sidebar-foreground">
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          type="button"
          aria-label={t("admin.closeNavigation")}
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={`admin-sidebar glass-dark ${mobileOpen ? "fixed inset-y-0 left-0 z-50 flex" : "hidden"} md:relative md:flex w-64 md:w-60 flex-col flex-shrink-0 relative`}>

        {/* Glass border right */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        {/* Logo */}
        <div className="px-5 py-7">
          <Link href="/admin">
            <div className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent to-[hsl(346_42%_34%)] flex items-center justify-center shadow-lg luxury-glow">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div>
                <span className="font-accent text-[15px] tracking-[0.18em] text-white/90" style={{ fontFamily: "var(--font-accent)" }}>
                  STOREKIT
                </span>
                <p className="text-[9px] tracking-[0.12em] uppercase text-white/30 -mt-0.5">{t("admin.panel")}</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-4 space-y-0.5">
          {navItems.map(({ label, href, icon: Icon }) => {
            const isActive = location === href || (href !== "/admin" && location.startsWith(href));
            return (
              <Link key={href} href={href} onClick={() => setMobileOpen(false)}>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.15 }}
                  className={`flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-[8px] transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-white/10 text-white font-medium shadow-[inset_0_1px_0_rgba(255,235,190,.16),0_12px_28px_rgba(0,0,0,.18)]"
                      : "text-white/45 hover:text-white/80 hover:bg-white/6"
                  }`}
                >
                  <Icon className={`w-[15px] h-[15px] flex-shrink-0 ${isActive ? "text-accent" : ""}`} />
                  {t(label)}
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-indicator"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_12px_hsl(var(--accent)/.8)]"
                    />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/6 space-y-0.5">
          <Link href="/">
            <div className="flex items-center gap-2.5 px-3 py-2 text-[12px] text-white/35 hover:text-white/65 transition-colors cursor-pointer rounded-[8px] hover:bg-white/5">
              <ExternalLink className="w-[13px] h-[13px]" />
              {t("admin.viewStorefront")}
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-[12px] text-white/35 hover:text-white/65 transition-colors rounded-xl hover:bg-white/5"
          >
            <LogOut className="w-[13px] h-[13px]" />
            {t("admin.signOut")}
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 bg-background rounded-none md:rounded-l-2xl overflow-hidden shadow-2xl">
        {/* Mobile topbar */}
        <div className="md:hidden h-14 border-b border-border/60 flex items-center justify-between px-4 glass-surface">
          <button
            type="button"
            aria-label={mobileOpen ? t("admin.closeNavigation") : t("admin.openNavigation")}
            onClick={() => setMobileOpen((open) => !open)}
            className="icon-glass !w-9 !h-9"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
          <span className="font-accent text-sm tracking-[0.18em] text-foreground" style={{ fontFamily: "var(--font-accent)" }}>STOREKIT</span>
          <span className="w-9" aria-hidden="true" />
        </div>

        {/* Topbar */}
        <header className="hidden md:flex h-[60px] border-b border-border/60 items-center justify-between px-8 glass-surface">
          <div>
            <h1 className="text-[15px] font-medium tracking-wide text-foreground">{localizedTitle}</h1>
            {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-4 sm:p-6 md:p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
