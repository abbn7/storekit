import { Link } from "wouter";
import { useGetStoreConfig } from "@workspace/api-client-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { data: config } = useGetStoreConfig();
  const [email, setEmail] = useState("");
  const [location] = useLocation();
  const { t, i18n } = useTranslation();
  const localizedTagline = i18n.language === "ar" ? t("home.heroTagline") : (config?.storeTagline ?? "Crafted for the conscious few.");

  if (location.startsWith("/admin")) return null;

  return (
    <footer className="relative overflow-hidden bg-foreground text-background mt-20">
      {/* Marquee strip */}
      <div className="border-b border-background/10 overflow-hidden py-4">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="text-xs tracking-[0.3em] uppercase text-background/40 mr-16 font-accent" style={{ fontFamily: "var(--font-accent)" }}>
              {t("footer.marquee")} ·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-[1] max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="font-accent text-2xl tracking-[0.2em] mb-4 text-accent" style={{ fontFamily: "var(--font-accent)" }}>
              {config?.storeName ?? "STOREKIT"}
            </div>
            <p className="text-sm text-background/50 leading-relaxed max-w-xs">
              {localizedTagline}
            </p>
            <div className="flex gap-4 mt-6">
              {config?.socialLinks && Object.entries(config.socialLinks as Record<string, string>).map(([platform, url]) => (
                <a key={platform} href={url} target="_blank" rel="noopener noreferrer"
                  aria-label={platform}
                  className="text-xs tracking-[0.15em] uppercase text-background/40 hover:text-accent transition-colors">
                  {platform}
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/40 mb-6 font-medium">{t("footer.shop")}</h4>
            <ul className="space-y-3">
              {[
                { label: t("nav.newArrivals"), href: "/collections/new-arrivals" },
                { label: t("nav.collections"), href: "/collections" },
                { label: t("footer.outerwear"), href: "/collections/outerwear" },
                { label: t("footer.essentials"), href: "/collections/essentials" },
                { label: t("footer.knitwear"), href: "/collections/knitwear" },
                { label: t("footer.accessories"), href: "/collections/accessories" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/40 mb-6 font-medium">{t("footer.company")}</h4>
            <ul className="space-y-3">
              {[
                { label: t("footer.aboutUs"), href: "/about" },
                { label: t("footer.account"), href: "/account" },
                { label: t("footer.orders"), href: "/account/orders" },
                { label: t("footer.wishlist"), href: "/account/wishlist" },
              ].map(l => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-background/60 hover:text-background transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="border-t border-background/20 pt-5 lg:border-t-0 lg:pt-0">
            <h4 className="text-xs tracking-[0.2em] uppercase text-background/55 mb-5 font-medium">{t("footer.stayInTouch")}</h4>
            <p className="text-sm text-background/50 mb-4 leading-relaxed">{t("footer.newsletterDescription")}</p>
            <form onSubmit={(e) => { e.preventDefault(); setEmail(""); }} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t("checkout.email")}
                aria-label={t("checkout.email")}
                className="w-full bg-transparent border-0 border-b border-background/20 rounded-none px-0 py-3 text-sm text-background placeholder:text-background/30 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                type="submit"
                className="self-start bg-accent text-accent-foreground rounded-none px-5 py-3 text-xs tracking-[0.15em] uppercase font-medium hover:bg-accent/90 transition-colors"
              >
                {t("footer.subscribe")}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-background/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/30">
            &copy; {new Date().getFullYear()} {config?.storeName ?? "StoreKit"}. {t("footer.copyright")}
          </p>
          <div className="flex gap-6 items-center">
            {["privacy", "terms", "returns", "contact"].map(item => (
              <a key={item} href="#" className="text-xs text-background/30 hover:text-background/60 transition-colors tracking-wide">
                {t(`footer.${item}`)}
              </a>
            ))}
            <Link href="/admin" className="text-xs text-background/20 hover:text-background/50 transition-colors tracking-[0.15em] uppercase border-l border-background/10 pl-6">
              {t("footer.admin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
