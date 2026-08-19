import { motion } from "framer-motion";
import { Link } from "wouter";
import Layout from "@/components/Layout";
import { useListCollections } from "@workspace/api-client-react";
import { getProductImage } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { localizeCatalogText } from "@/lib/catalogI18n";

export default function CollectionsPage() {
  const { t, i18n } = useTranslation();
  const { data: collections, isLoading } = useListCollections();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs tracking-[0.3em] uppercase text-muted-foreground mb-3">{t("collections.discover")}</p>
          <h1 className="font-display text-5xl lg:text-6xl font-light" style={{ fontFamily: "var(--font-display)" }}>
            {t("collections.allCollections")}
          </h1>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(collections ?? []).map((col, i) => {
              const localized = localizeCatalogText(col, i18n.language);
              return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="group"
              >
                <Link href={`/collections/${col.slug}`}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-4">
                    <img
                      src={getProductImage(col.imageUrl, col.id)}
                      alt={localized.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/10 transition-colors duration-500" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h2 className="font-accent text-2xl text-background tracking-[0.1em]" style={{ fontFamily: "var(--font-accent)" }}>
                        {localized.name?.toUpperCase()}
                      </h2>
                      <p className="text-xs text-background/60 mt-1">{col.productCount} {t("home.pieces")}</p>
                    </div>
                  </div>
                  {localized.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">{localized.description}</p>
                  )}
                </Link>
              </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
