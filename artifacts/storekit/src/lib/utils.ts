import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

const FASHION_IMAGE_FALLBACKS = [
  "/images/fashion/editorial-black.jpg",
  "/images/fashion/lookbook-grey.jpg",
  "/images/fashion/minimal-outfit.jpg",
  "/images/fashion/fashion-product.jpg",
  "/images/fashion/high-fashion.jpg",
  "/images/fashion/fashion-editorial.jpg",
];

const COLLECTION_IMAGE_MAP: Record<string, string> = {
  "new-arrivals": "/images/fashion/editorial-black.jpg",
  essentials: "/images/fashion/fashion-product.jpg",
  outerwear: "/images/fashion/minimal-outfit.jpg",
  knitwear: "/images/fashion/fashion-editorial.jpg",
  accessories: "/images/fashion/lookbook-grey.jpg",
};

export function getProductImage(url: string | null | undefined, productId?: string): string {
  const candidate = url?.trim();
  if (candidate && !candidate.includes("picsum.photos")) return candidate;
  if (productId === "hero") return "/images/fashion/hero-luxury-mobile.jpg";

  const source = `${productId ?? "default"}:${candidate ?? "fallback"}`;
  const hash = Array.from(source).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return FASHION_IMAGE_FALLBACKS[hash % FASHION_IMAGE_FALLBACKS.length];
}

export function getCollectionImage(url: string | null | undefined, slug?: string): string {
  const candidate = url?.trim();
  if (candidate && !candidate.includes("picsum.photos")) return candidate;
  if (slug && COLLECTION_IMAGE_MAP[slug]) return COLLECTION_IMAGE_MAP[slug];
  return getProductImage(candidate, slug);
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}
