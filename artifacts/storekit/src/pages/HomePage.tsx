import { useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import {
  useGetStoreConfig,
  useListProducts,
  useListCollections,
  useListTestimonials,
} from "@workspace/api-client-react";
import { getCollectionImage, getProductImage } from "@/lib/utils";
import { Star, ArrowRight } from "lucide-react";
import { luxury, staggerContainer, staggerItem } from "@/lib/animations";
import { useTranslation } from "react-i18next";
import { localizeCatalogText } from "@/lib/catalogI18n";

/* ─── Section label ─────────────────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: luxury }}
      className="text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-4"
    >
      {children}
    </motion.p>
  );
}

/* ─── Reveal heading ─────────────────────────────────────────── */
function RevealHeading({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className="overflow-hidden">
      <motion.h2
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: luxury }}
        className={className}
        style={style}
      >
        {children}
      </motion.h2>
    </div>
  );
}

/* ─── Hero ───────────────────────────────────────────────────── */
function HeroSection({ config }: { config: any }) {
  const { t, i18n } = useTranslation();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const isArabic = i18n.language === "ar";
  const heading = isArabic ? t("home.heroTitle") : (config?.heroHeading ?? "The New Season Awaits");
  const tagline = isArabic ? t("home.heroTagline") : (config?.storeTagline ?? "Crafted for the conscious few");
  const subheading = isArabic ? t("home.heroSubheading") : (config?.heroSubheading ?? "Thoughtfully designed for those who move through the world with intention.");
  const headingLines = isArabic ? [heading] : ["The New", "Season Awaits"];

  return (
    <section ref={ref} className="hero-frame relative min-h-[calc(100svh-var(--announcement-height)-var(--nav-height))] overflow-hidden bg-[#11131a] text-white">
      <motion.div style={{ y }} className="absolute inset-0">
        <img
          src={getProductImage(config?.heroImageUrl, "hero")}
          alt="Hero"
          className="w-full h-full object-cover object-[center_28%] sm:object-center scale-[1.02] saturate-[.86]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/28 to-black/12" />
        <div className="absolute inset-0 sm:bg-gradient-to-r sm:from-black/48 sm:via-black/12 sm:to-transparent" />
      </motion.div>

      <motion.div style={{ opacity }} className="relative z-10 flex min-h-[calc(100svh-var(--announcement-height)-var(--nav-height))] items-end pb-12 sm:items-center sm:pb-0">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3, ease: luxury }}
              className="block w-fit max-w-full text-[9px] sm:text-[10px] tracking-[0.28em] sm:tracking-[0.32em] uppercase text-white/62 mb-5 sm:mb-7"
            >
              {tagline}
            </motion.p>

            <h1
              className="font-display text-[3rem] sm:text-7xl lg:text-8xl font-light leading-[0.94] tracking-[-0.045em] max-w-[10ch] mb-5 sm:mb-8 text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {headingLines.map((line: string, i: number) => (
                <span key={i} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: 36, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.28 + i * 0.12, ease: luxury }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.85, ease: luxury }}
              className="text-[0.95rem] sm:text-base lg:text-lg text-white/72 max-w-[27ch] leading-[1.65] mb-7 sm:mb-9"
            >
              {subheading}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.05, ease: luxury }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <Link
                href="/collections/new-arrivals"
                className="group inline-flex min-h-11 items-center gap-3 border-b border-white/75 pb-2 text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white hover:border-accent hover:text-accent transition-colors"
              >
                {t("home.shopNewArrivals")}
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className={`w-4 h-4 ${isArabic ? "rotate-180" : ""}`} />
                </motion.span>
              </Link>
              <Link
                href="/collections"
                className="inline-flex min-h-11 items-center border-b border-white/30 pb-2 text-[10px] sm:text-[11px] tracking-[0.18em] sm:tracking-[0.22em] uppercase text-white/72 hover:border-white hover:text-white transition-colors duration-300"
              >
                {t("home.viewCollections")}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{ opacity }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 sm:flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.25em] uppercase text-foreground/40">{t("home.scroll")}</span>
        <motion.div
          animate={{ scaleY: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-foreground/30 origin-top"
        />
      </motion.div>
    </section>
  );
}

/* ─── Announcement marquee ───────────────────────────────────── */
function AnnouncementMarquee({ text }: { text: string }) {
  const fullText = `${text} · `;
  return (
    <div className="bg-foreground text-background overflow-hidden py-3 border-y border-foreground/10">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="text-[11px] tracking-[0.22em] uppercase mr-14 text-background/65">
            {fullText}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Featured Collections ───────────────────────────────────── */
function FeaturedCollections({ collections }: { collections: any[] }) {
  const { t, i18n } = useTranslation();
  const featured = collections.filter(c => c.isFeatured).slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-32">
      <div className="flex items-end justify-between mb-12">
        <div>
          <SectionLabel>{t("home.curatedSelections")}</SectionLabel>
          <RevealHeading className="font-display text-4xl lg:text-5xl font-light" style={{ fontFamily: "var(--font-display)" } as any}>
            {t("home.collectionsTitle")}
          </RevealHeading>
        </div>
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: luxury }}
        >
          <Link href="/collections" className="group flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            {t("home.viewAll")}
            <motion.span animate={{ x: [0, 3, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.span>
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {featured.map((col, i) => {
          const localized = localizeCatalogText(col, i18n.language);
          return (
          <motion.div
            key={col.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: luxury }}
            className="relative overflow-hidden rounded-sm group"
          >
            <Link href={`/collections/${col.slug}`}>
              <div className="aspect-[4/5] overflow-hidden rounded-sm bg-muted">
                <motion.img
                  src={getCollectionImage(col.imageUrl, col.slug)}
                  alt={localized.name}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.7, ease: luxury }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/12 to-transparent"
                  whileHover={{ opacity: 0.86 }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                <motion.div
                  initial={{ y: 8, opacity: 0.82 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: luxury }}
                  className="border-t border-white/55 pt-3"
                >
                  <p className="text-[10px] tracking-[0.25em] uppercase text-white/72 mb-1.5">
                    {col.productCount} {t("home.pieces")}
                  </p>
                  <h3 className="font-display text-2xl text-white tracking-[0.02em]" style={{ fontFamily: "var(--font-display)" }}>
                    {localized.name}
                  </h3>
                </motion.div>
              </div>
            </Link>
          </motion.div>
          );
        })}
      </div>
    </section>
  );
}

/* ─── Moving text strip ──────────────────────────────────────── */
function MovingStrip() {
  const { t } = useTranslation();
  const words = t("footer.marquee").split(" · ");
  return (
    <div className="moving-strip bg-foreground py-5 overflow-hidden my-4">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...Array(3)].map((_, i) => (
          <span key={i} className="font-accent text-xl lg:text-2xl tracking-[0.3em] text-background/25 mr-10" style={{ fontFamily: "var(--font-accent)" }}>
            {words.join(" · ")} ·&nbsp;
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Products section ───────────────────────────────────────── */
function ProductsSection({ title, subtitle, products, href }: { title: string; subtitle?: string; products: any[]; href: string }) {
  const { t } = useTranslation();
  return (
    <section className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
      <div className="flex items-end justify-between mb-12">
        <div>
          {subtitle && <SectionLabel>{subtitle}</SectionLabel>}
          <RevealHeading className="font-display text-4xl lg:text-5xl font-light" style={{ fontFamily: "var(--font-display)" } as any}>
            {title}
          </RevealHeading>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: luxury }}
        >
          <Link href={href} className="flex items-center gap-2 text-[11px] tracking-[0.18em] uppercase text-muted-foreground hover:text-foreground transition-colors">
            {t("home.viewAll")}
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-4 lg:gap-6"
      >
        {products.slice(0, 4).map((p, i) => (
          <ProductCard
            key={p.id}
            id={p.id}
            slug={p.slug}
            name={p.name}
            basePrice={p.basePrice}
            compareAtPrice={p.compareAtPrice}
            images={p.images}
            variants={p.variants}
            isFeatured={p.isFeatured}
            isNewArrival={p.isNewArrival}
            index={i}
          />
        ))}
      </motion.div>
    </section>
  );
}

/* ─── Editorial split ────────────────────────────────────────── */
function EditorialSection() {
  const { t, i18n } = useTranslation();
  return (
    <section className="max-w-7xl mx-auto px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: luxury }}
          className="aspect-[4/5] overflow-hidden rounded-sm bg-muted"
        >
          <motion.img
            src="/images/fashion/fashion-editorial.jpg"
            alt="Lookbook"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.8, ease: luxury }}
          />
        </motion.div>

        <div>
          <SectionLabel>{t("home.ourStory")}</SectionLabel>
          <RevealHeading
            className="font-display text-5xl lg:text-6xl font-light leading-[1.08] mb-7"
            style={{ fontFamily: "var(--font-display)" } as any}
          >
            {t("home.newSeasonNewStory")}
          </RevealHeading>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: luxury }}
            className="text-base text-muted-foreground leading-relaxed mb-8 max-w-sm"
          >
            {t("home.storyBody")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35, ease: luxury }}
          >
            <Link
              href="/collections"
              className="group inline-flex min-h-11 items-center gap-3 border-b border-foreground pb-2 text-[11px] tracking-[0.2em] uppercase text-foreground hover:border-accent hover:text-accent transition-colors"
            >
              {t("home.exploreCollection")}
              <ArrowRight className={`w-4 h-4 ${i18n.language === "ar" ? "rotate-180" : ""}`} />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── Numbers row ────────────────────────────────────────────── */
function StatsRow() {
  const { t } = useTranslation();
  const stats = [
    { number: "12+", label: t("home.seasons") },
    { number: "100%", label: t("home.naturalMaterials") },
    { number: "30", label: t("home.dayReturns") },
    { number: "4.9★", label: t("home.averageRating") },
  ];
  return (
    <section className="border-y border-border/55 py-14 my-4 bg-gradient-to-r from-transparent via-accent/5 to-transparent">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
                  className="max-w-5xl mx-6 lg:mx-auto border-y border-border/70 px-4 py-8 grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 text-center"

      >
        {stats.map((s, i) => (
          <motion.div key={i} variants={staggerItem}>
            <p className="font-display text-3xl lg:text-4xl font-light mb-1.5" style={{ fontFamily: "var(--font-display)" }}>{s.number}</p>
            <p className="text-[11px] tracking-[0.2em] uppercase text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

/* ─── Testimonials ───────────────────────────────────────────── */
function TestimonialsSection({ testimonials }: { testimonials: any[] }) {
  const { t } = useTranslation();
  if (testimonials.length === 0) return null;
  return (
    <section className="relative overflow-hidden bg-muted py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16">
          <SectionLabel>{t("home.testimonials")}</SectionLabel>
          <RevealHeading className="font-display text-4xl lg:text-5xl font-light" style={{ fontFamily: "var(--font-display)" } as any}>
            {t("home.fromOurCommunity")}
          </RevealHeading>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.slice(0, 3).map((t) => (
            <motion.div
              key={t.id}
              variants={staggerItem}
              className="bg-background p-8 flex flex-col border-t border-border/75"
            >
              <div className="flex gap-0.5 mb-5">
                {[...Array(t.rating)].map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-accent text-accent" />
                ))}
              </div>
              <p className="font-display text-lg font-light leading-relaxed mb-6 italic flex-1" style={{ fontFamily: "var(--font-display)" }}>
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="pt-5 border-t border-border/60">
                <p className="text-sm font-medium">{t.authorName}</p>
                {t.authorLocation && (
                  <p className="text-xs text-muted-foreground mt-0.5 tracking-wide">{t.authorLocation}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Footer ─────────────────────────────────────────────────── */
function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="relative overflow-hidden bg-foreground text-background mt-0">
      <div className="relative z-[1] max-w-7xl mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          <div className="lg:col-span-1">
                          <div className="font-accent text-2xl tracking-[0.22em] mb-4 text-accent" style={{ fontFamily: "var(--font-accent)" }}>

              STOREKIT
            </div>
            <p className="text-sm text-background/45 leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-background/35 mb-6">{t("footer.shop")}</h4>
            <ul className="space-y-3">
              {[[t("footer.newArrivals"), "/collections/new-arrivals"], [t("footer.collections"), "/collections"], [t("footer.outerwear"), "/collections/outerwear"], [t("footer.essentials"), "/collections/essentials"]].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="text-sm text-background/55 hover:text-background transition-colors tracking-wide">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-background/35 mb-6">{t("footer.company")}</h4>
            <ul className="space-y-3">
              {[[t("footer.aboutUs"), "/about"], [t("footer.account"), "/account"], [t("footer.orders"), "/account/orders"]].map(([l, h]) => (
                <li key={h}>
                  <Link href={h} className="text-sm text-background/55 hover:text-background transition-colors tracking-wide">
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="border-t border-background/20 pt-5 lg:border-t-0 lg:pt-0">
            <h4 className="text-[10px] tracking-[0.25em] uppercase text-background/55 mb-5">{t("footer.stayInTouch")}</h4>
            <p className="text-sm text-background/45 mb-4 leading-relaxed">{t("footer.newsletterDescription")}</p>
            <div className="flex flex-col gap-2">
              <input type="email" aria-label={t("checkout.email")} placeholder={t("home.newsletterEmail")} className="w-full bg-transparent border-0 border-b border-background/20 rounded-none px-0 py-3 text-sm text-background placeholder:text-background/30 focus:outline-none focus:border-accent transition-colors" />
              <button type="submit" className="self-start bg-accent text-accent-foreground rounded-none px-5 py-3 text-[11px] tracking-[0.18em] uppercase hover:bg-accent/85 transition-colors">
                {t("footer.subscribe")}
              </button>
            </div>
          </div>
        </div>
        <div className="border-t border-background/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/25">&copy; {new Date().getFullYear()} StoreKit. {t("footer.copyright")}</p>
          <div className="flex gap-6 items-center">
            {[t("footer.privacy"), t("footer.terms"), t("footer.returns")].map(i => (
              <a key={i} href="#" className="text-xs text-background/25 hover:text-background/55 transition-colors">{i}</a>
            ))}
            <Link href="/admin" className="text-xs text-background/15 hover:text-background/40 transition-colors tracking-[0.15em] uppercase border-l border-background/10 pl-6">
              {t("footer.admin")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
export default function HomePage() {
  const { t, i18n } = useTranslation();
  const { data: config } = useGetStoreConfig();
  const { data: productsData } = useListProducts({ status: "active", featured: "true", pageSize: "8" } as any);
  const { data: newArrivalsData } = useListProducts({ status: "active", newArrival: "true", pageSize: "8" } as any);
  const { data: collections } = useListCollections();
  const { data: testimonials } = useListTestimonials();

  const featuredProducts = productsData?.products ?? [];
  const newArrivals = newArrivalsData?.products ?? [];

  return (
    <Layout noFooter>
      <HeroSection config={config} />
      <FeaturedCollections collections={collections ?? []} />
      <ProductsSection title={t("home.newArrivalsTitle")} subtitle={t("home.justLanded")} products={newArrivals} href="/collections/new-arrivals" />
      <StatsRow />
      <EditorialSection />
      <ProductsSection title={t("home.bestSellers")} subtitle={t("home.fanFavourites")} products={featuredProducts} href="/collections" />
      <TestimonialsSection testimonials={testimonials ?? []} />
      <Footer />
    </Layout>
  );
}
