type CatalogText = {
  slug?: string;
  name?: string;
  description?: string | null;
  shortDescription?: string | null;
};

const productArabic: Record<string, { name: string; description?: string; shortDescription?: string }> = {
  "leather-bucket-bag": {
    name: "حقيبة جلدية بتصميم الدلو",
    description: "حقيبة يومية مصنوعة من جلد ناعم بتصميم عملي وشكل أنيق يدوم مع الوقت.",
    shortDescription: "جلد طبيعي، بطانة قطنية، وحزام قابل للتعديل.",
  },
  "organic-cotton-shirt": {
    name: "قميص من القطن العضوي",
    description: "قميص يومي من قطن عضوي ناعم بقصة مريحة وتفاصيل مصممة للاستخدام الطويل.",
    shortDescription: "قطن عضوي، قصة مريحة، وتشطيب ناعم.",
  },
  "oversized-merino-coat": {
    name: "معطف ميرينو واسع",
    description: "معطف شتوي فاخر من صوف ميرينو ناعم بقصة واسعة ودفء متوازن.",
    shortDescription: "صوف ميرينو فاخر، قصة واسعة، ودفء خفيف.",
  },
  "ribbed-cashmere-turtleneck": {
    name: "كنزة كشمير مضلعة برقبة عالية",
    description: "قطعة أساسية من كشمير منغولي فاخر، مضلعة بقصة مريحة ورقبة عالية ناعمة.",
    shortDescription: "كشمير منغولي فاخر، نسيج مضلع، وقصة مريحة.",
  },
  "silk-slip-dress": {
    name: "فستان حرير بانسيابية ناعمة",
    description: "فستان حرير بقصة مائلة تنساب بخفة مع كل حركة، مناسب للمناسبات الهادئة.",
    shortDescription: "حرير طبيعي، قصة مائلة، ولمعان راقٍ.",
  },
  "structured-canvas-blazer": {
    name: "بليزر كانفاس بقصة هندسية",
    description: "بليزر من كانفاس متين بقصة منظمة وتفاصيل داخلية تمنحه بنية أنيقة.",
    shortDescription: "كانفاس متين، بنية منظمة، وتشطيب يدوي.",
  },
  "wide-leg-linen-trousers": {
    name: "بنطال كتان واسع الساقين",
    description: "بنطال من كتان بلجيكي مغسول بقصة واسعة وانسيابية تناسب الأيام الدافئة.",
    shortDescription: "كتان بلجيكي مغسول، قصة واسعة، وملمس طبيعي.",
  },
  "wool-knit-scarf": {
    name: "وشاح صوف محبوك",
    description: "وشاح محبوك بخامة صوفية دافئة وملمس غني يكمّل الإطلالات اليومية.",
    shortDescription: "صوف دافئ، نسيج محبوك، وراحة يومية.",
  },
};

const collectionArabic: Record<string, { name: string; description?: string }> = {
  "new-arrivals": { name: "وصل حديثاً", description: "أحدث القطع المنضمة إلى مجموعتنا." },
  essentials: { name: "الأساسيات", description: "قطع خالدة تشكل أساس كل خزانة." },
  outerwear: { name: "الملابس الخارجية", description: "معاطف وسترات راقية لكل موسم." },
  knitwear: { name: "التريكو", description: "قطع محبوكة يدويًا بملمس استثنائي." },
  accessories: { name: "الإكسسوارات", description: "تفاصيل صغيرة تكمل الإطلالة بعناية." },
};

const variantArabic: Record<string, string> = {
  "One Size": "مقاس موحد",
  Tan: "تان",
  Espresso: "إسبريسو",
  Black: "أسود",
  Ivory: "عاجي",
  White: "أبيض",
  Beige: "بيج",
  Navy: "كحلي",
  Brown: "بني",
  Grey: "رمادي",
  Gray: "رمادي",
};

export function localizeVariantValue(value: string | null | undefined, language: string): string {
  if (!value || language !== "ar") return value ?? "";
  return variantArabic[value] ?? value;
}

export function localizeVariantLabel(label: string | null | undefined, language: string): string {
  if (!label) return "";
  return label.split(" / ").map(part => localizeVariantValue(part.trim(), language)).join(" / ");
}

export function localizeCatalogText<T extends CatalogText>(item: T, language: string): T {
  if (language !== "ar" || !item.slug) return item;
  const translated = productArabic[item.slug] ?? collectionArabic[item.slug];
  if (!translated) return item;
  return {
    ...item,
    name: translated.name,
    description: translated.description ?? item.description,
    shortDescription: "shortDescription" in translated ? translated.shortDescription : item.shortDescription,
  } as T;
}
