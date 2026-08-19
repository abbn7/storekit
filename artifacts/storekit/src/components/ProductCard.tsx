import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingBag, Eye, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { formatPrice, getProductImage } from "@/lib/utils";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCartStore } from "@/store/cartStore";
import { useQuickViewStore } from "@/store/quickViewStore";
import { useCompareStore } from "@/store/compareStore";
import { luxury, staggerItem } from "@/lib/animations";
import { useTranslation } from "react-i18next";
import { localizeCatalogText } from "@/lib/catalogI18n";

interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  compareAtPrice?: number | null;
  images: { url: string; alt?: string }[];
  variants?: { id: string; size: string; color: string; colorHex: string; stock: number; price: number }[];
  isFeatured?: boolean;
  isNewArrival?: boolean;
  index?: number;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  id, slug, name, basePrice, compareAtPrice, images, variants = [],
  isFeatured, isNewArrival, index = 0, viewMode = "grid"
}: ProductCardProps) {
  const { t, i18n } = useTranslation();
  const displayName = localizeCatalogText({ slug, name }, i18n.language).name ?? name;
  const [isHovered, setIsHovered] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isTouchDevice] = useState(() => typeof window !== "undefined" && window.matchMedia?.("(hover: none)").matches);
  const revealActions = isHovered || isActionsOpen;
  const [showSizes, setShowSizes] = useState(false);
  const [addedVariantId, setAddedVariantId] = useState<string | null>(null);
  const { isInWishlist, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlistStore();
  const { addItem, openCart } = useCartStore();
  const { open: openQuickView } = useQuickViewStore();
  const { add: addToCompare, remove: removeFromCompare, isInCompare, items: compareItems } = useCompareStore();
  const inWishlist = isInWishlist(id);
  const inCompare = isInCompare(id);
  const compareIsFull = compareItems.length >= 3 && !inCompare;

  const primaryImage = images[0]?.url ? getProductImage(images[0].url) : getProductImage(null, id);
  const secondaryImage = images[1]?.url ? getProductImage(images[1].url) : primaryImage;
  const hasSecondImage = secondaryImage !== primaryImage;

  const hasDiscount = compareAtPrice && compareAtPrice > basePrice;
  const inStockVariants = variants.filter(v => v.stock > 0);
  const uniqueColors = [...new Map(variants.filter(v => v.stock > 0).map(v => [v.color, v])).values()];

  function handleQuickAdd(e: React.MouseEvent, variant: typeof variants[0]) {
    e.preventDefault();
    e.stopPropagation();
    setAddedVariantId(variant.id);
    addItem({
      productId: id,
      variantId: variant.id,
      productName: displayName,
      variantLabel: `${variant.size} / ${variant.color}`,
      imageUrl: primaryImage,
      price: variant.price,
      quantity: 1,
      maxQuantity: variant.stock,
    });
    setTimeout(() => {
      openCart();
      setShowSizes(false);
      setAddedVariantId(null);
    }, 500);
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) removeFromWishlist(id);
    else addToWishlist(id);
  }

  return (
    <motion.div
      variants={staggerItem}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-60px" }}
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsActionsOpen(false); setShowSizes(false); }}
    >
      <div>
        {/* Image container */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
          <Link
            href={`/products/${slug}`}
            aria-label={displayName}
            className="absolute inset-0 z-0"
            onClick={(event) => {
              if (isTouchDevice && !isActionsOpen) {
                event.preventDefault();
                setIsActionsOpen(true);
              }
            }}
          />
          {/* Primary image */}
          <motion.img
            src={primaryImage}
            alt={images[0]?.alt ?? displayName}
            className="absolute inset-0 w-full h-full object-cover"
            animate={{
              opacity: isHovered && hasSecondImage ? 0 : 1,
              scale: isHovered ? 1.05 : 1,
            }}
            transition={{ duration: 0.6, ease: luxury }}
          />

          {/* Secondary image crossfade */}
          {hasSecondImage && (
            <motion.img
              src={secondaryImage}
              alt={displayName}
              className="absolute inset-0 w-full h-full object-cover"
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1.03 : 1.08,
              }}
              transition={{ duration: 0.6, ease: luxury }}
            />
          )}

          {/* Gradient overlay on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent pointer-events-none"
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {hasDiscount && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-foreground text-background text-[10px] tracking-[0.12em] px-2.5 py-1 rounded-sm uppercase"
              >
                {t("product.sale")}
              </motion.span>
            )}
            {isNewArrival && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-accent text-accent-foreground text-[10px] tracking-[0.14em] px-2.5 py-1 rounded-sm uppercase"
              >
                {t("product.new")}
              </motion.span>
            )}
          </div>

          {/* Wishlist button */}
          <motion.button
            onClick={handleWishlist}
            className="bg-background absolute top-3 right-3 z-10 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border/70"
            animate={{ opacity: revealActions ? 1 : 0, scale: revealActions ? 1 : 0.85 }}
            transition={{ duration: 0.25, ease: luxury }}
            whileTap={{ scale: 0.9 }}
            aria-label={inWishlist ? t("product.removeFromWishlist") : t("product.addToWishlist")}
          >
            <motion.div
              animate={inWishlist ? { scale: [1, 1.35, 1] } : {}}
              transition={{ duration: 0.35 }}
            >
              <Heart className={`w-4 h-4 transition-colors duration-200 ${inWishlist ? "fill-foreground text-foreground" : "text-foreground"}`} />
            </motion.div>
          </motion.button>

          {/* Quick View button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              openQuickView({ id, slug, name: displayName, basePrice, compareAtPrice, images, variants, isFeatured, isNewArrival });
            }}
            className="bg-background absolute top-3 right-[3.6rem] z-10 inline-flex h-10 w-10 items-center justify-center rounded-sm border border-border/70"
            animate={{ opacity: revealActions ? 1 : 0, scale: revealActions ? 1 : 0.85 }}
            transition={{ duration: 0.25, ease: luxury, delay: 0.04 }}
            whileTap={{ scale: 0.9 }}
            aria-label={t("product.quickView")}
            title={t("product.quickView")}
          >
            <Eye className="w-4 h-4 text-foreground" />
          </motion.button>

          {/* Quick add panel */}
          <AnimatePresence>
            {revealActions && inStockVariants.length > 0 && (
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ duration: 0.3, ease: luxury }}
                className="bg-background absolute bottom-0 left-0 right-0 border-t border-border p-3 z-10"
              >
                <AnimatePresence mode="wait">
                  {!showSizes ? (
                    <motion.button
                      key="quick-add-btn"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowSizes(true); }}
                      className="w-full min-h-11 flex items-center justify-center gap-2 text-[10px] tracking-[0.16em] uppercase py-2.5 border border-foreground hover:bg-foreground hover:text-background transition-colors duration-200"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      {t("product.quickAdd")}
                    </motion.button>
                  ) : (
                    <motion.div
                      key="sizes"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex flex-wrap gap-1.5"
                    >
                      {inStockVariants.slice(0, 7).map((v, i) => (
                        <motion.button
                          key={v.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.04, ease: luxury }}
                          onClick={(e) => handleQuickAdd(e, v)}
                          className={`min-h-10 min-w-10 text-[10px] border px-2.5 py-1.5 tracking-wide transition-all duration-200 ${
                            addedVariantId === v.id
                              ? "bg-accent border-accent text-accent-foreground"
                              : "border-foreground/40 hover:bg-foreground hover:text-background hover:border-foreground"
                          }`}
                        >
                          {v.size}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Color dots */}
        {uniqueColors.length > 1 && (
          <motion.div
            className="flex gap-2 mt-2.5"
            animate={{ opacity: isHovered ? 1 : 0.4 }}
            transition={{ duration: 0.3 }}
          >
            {uniqueColors.slice(0, 5).map((v) => (
              <div
                key={v.color}
                title={v.color}
                className="w-3 h-3 rounded-full border border-border/50"
                style={{ backgroundColor: v.colorHex }}
              />
            ))}
            {uniqueColors.length > 5 && (
              <span className="text-[10px] text-muted-foreground">+{uniqueColors.length - 5}</span>
            )}
          </motion.div>
        )}

        {/* Product info */}
        <div className="mt-4 space-y-1 px-1">
          <Link href={`/products/${slug}`} className="block" aria-label={displayName}>
            <h3 className="text-sm font-medium tracking-wide text-foreground leading-snug">
            <span className="relative inline-block">
              {displayName}
              <motion.span
                className="absolute -bottom-0.5 left-0 h-px bg-foreground"
                animate={{ width: isHovered ? "100%" : "0%" }}
                transition={{ duration: 0.35, ease: luxury }}
              />
            </span>
            </h3>
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[13px] tracking-[0.04em] font-medium">{formatPrice(basePrice)}</span>
              {hasDiscount && (
                <span className="text-[13px] tracking-[0.04em] text-muted-foreground line-through">{formatPrice(compareAtPrice!)}</span>
              )}
            </div>

            {/* Compare toggle */}
            <AnimatePresence>
              {revealActions && (
                <motion.button
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2, ease: luxury }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (inCompare) removeFromCompare(id);
                    else if (!compareIsFull) addToCompare({ id, slug, name, basePrice, compareAtPrice, images, variants, isFeatured, isNewArrival });
                  }}
                  disabled={compareIsFull}
                  title={compareIsFull ? t("product.compareMax") : inCompare ? t("product.removeCompare") : t("product.compare")}
                  aria-label={compareIsFull ? t("product.compareMax") : inCompare ? t("product.removeCompare") : t("product.compare")}
                  className={`flex items-center gap-1 text-[10px] tracking-wide transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    inCompare
                      ? "text-accent"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <ArrowLeftRight className="w-3 h-3" />
                  {inCompare ? t("product.compareAdded") : t("product.compare")}
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
