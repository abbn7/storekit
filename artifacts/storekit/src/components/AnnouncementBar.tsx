import { useGetStoreConfig } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export default function AnnouncementBar() {
  const { data: config } = useGetStoreConfig();
  const [location] = useLocation();
  const { t, i18n } = useTranslation();

  if (location.startsWith("/admin")) return null;

  const text = i18n.language === "ar"
    ? t("home.announcement")
    : (config?.announcementText?.trim() || t("home.announcement"));
  const mobileText = i18n.language === "ar"
    ? "شحن مجاني · طلبات فوق 100$"
    : "Complimentary shipping · orders over $100";

  return (
    <div className="announcement-bar bg-foreground text-background overflow-hidden fixed top-0 left-0 right-0 z-50 border-b border-background/10">
      <div className="hidden sm:flex w-max whitespace-nowrap animate-marquee">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-[9px] sm:text-[11px] tracking-[0.14em] sm:tracking-[0.2em] uppercase mr-10 sm:mr-16" style={{ fontFamily: "var(--font-body)" }}>
            {text}
          </span>
        ))}
      </div>
      <div className="flex sm:hidden w-full items-center justify-center px-4">
        <span className="text-[9px] tracking-[0.15em] uppercase text-center" style={{ fontFamily: "var(--font-body)" }}>
          {mobileText}
        </span>
      </div>
    </div>
  );
}
