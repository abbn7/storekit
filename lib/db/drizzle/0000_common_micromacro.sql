CREATE TABLE "store_config" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"store_name" text DEFAULT 'My Store' NOT NULL,
	"store_tagline" text DEFAULT '',
	"logo_url" text,
	"primary_color" varchar(7) DEFAULT '#1a1a1a',
	"secondary_color" varchar(7) DEFAULT '#ffffff',
	"accent_color" varchar(7) DEFAULT '#c9a96e',
	"currency" varchar(3) DEFAULT 'USD',
	"currency_symbol" varchar(5) DEFAULT '$',
	"locale" varchar(10) DEFAULT 'en-US',
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"contact_email" text DEFAULT '',
	"shipping_threshold" integer DEFAULT 10000,
	"return_policy" text DEFAULT '',
	"about_text" text DEFAULT '',
	"hero_heading" text DEFAULT 'New Collection',
	"hero_subheading" text DEFAULT 'Discover our latest arrivals',
	"hero_image_url" text,
	"announcement_text" text DEFAULT 'Free shipping on orders over $100 · New arrivals every week',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '',
	"image_url" text,
	"is_featured" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0,
	"meta_title" text DEFAULT '',
	"meta_description" text DEFAULT '',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collections_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "product_collections" (
	"product_id" uuid NOT NULL,
	"collection_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"url" text NOT NULL,
	"alt" text DEFAULT '',
	"is_primary" boolean DEFAULT false,
	"sort_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "product_tags" (
	"product_id" uuid NOT NULL,
	"tag" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"size" text NOT NULL,
	"color" text NOT NULL,
	"color_hex" varchar(7) DEFAULT '#000000',
	"sku" text NOT NULL,
	"stock" integer DEFAULT 0,
	"price" integer NOT NULL,
	"compare_at_price" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_variants_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '',
	"short_description" text DEFAULT '',
	"base_price" integer DEFAULT 0 NOT NULL,
	"compare_at_price" integer,
	"status" text DEFAULT 'draft',
	"is_featured" boolean DEFAULT false,
	"is_new_arrival" boolean DEFAULT false,
	"material" text DEFAULT '',
	"care_instructions" text DEFAULT '',
	"weight" integer DEFAULT 0,
	"meta_title" text DEFAULT '',
	"meta_description" text DEFAULT '',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" uuid,
	"product_id" uuid,
	"variant_id" uuid,
	"product_name" text NOT NULL,
	"variant_label" text NOT NULL,
	"image_url" text DEFAULT '',
	"price" integer NOT NULL,
	"quantity" integer NOT NULL,
	"total" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_number" text NOT NULL,
	"user_id" text NOT NULL,
	"status" text DEFAULT 'pending',
	"shipping_address" jsonb NOT NULL,
	"subtotal" integer NOT NULL,
	"shipping_cost" integer DEFAULT 0,
	"tax" integer DEFAULT 0,
	"total" integer NOT NULL,
	"stripe_payment_intent_id" text,
	"tracking_number" text DEFAULT '',
	"notes" text DEFAULT '',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "orders_order_number_unique" UNIQUE("order_number")
);
--> statement-breakpoint
CREATE TABLE "wishlists" (
	"user_id" text NOT NULL,
	"product_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "homepage_banners" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image_url" text NOT NULL,
	"heading" text DEFAULT '',
	"subheading" text DEFAULT '',
	"cta_text" text DEFAULT '',
	"cta_url" text DEFAULT '',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lookbook" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"subtitle" text DEFAULT '',
	"image_url" text NOT NULL,
	"season" text DEFAULT '',
	"sort_order" integer DEFAULT 0,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lookbook_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lookbook_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lookbook_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"x_pct" double precision NOT NULL,
	"y_pct" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"author_name" text NOT NULL,
	"author_location" text DEFAULT '',
	"text" text NOT NULL,
	"rating" integer DEFAULT 5,
	"is_visible" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"author_name" text NOT NULL,
	"rating" integer NOT NULL,
	"title" text DEFAULT '',
	"body" text DEFAULT '',
	"is_verified_purchase" boolean DEFAULT false,
	"is_approved" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promo_codes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"discount_type" text DEFAULT 'percent' NOT NULL,
	"discount_value" integer NOT NULL,
	"min_order_cents" integer DEFAULT 0,
	"max_uses" integer,
	"used_count" integer DEFAULT 0,
	"expires_at" timestamp with time zone,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "promo_codes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "stock_alerts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"variant_id" uuid NOT NULL,
	"product_id" uuid NOT NULL,
	"email" text NOT NULL,
	"user_id" text,
	"is_notified" boolean DEFAULT false,
	"notified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_tags" ADD CONSTRAINT "product_tags_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wishlists" ADD CONSTRAINT "wishlists_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lookbook_tags" ADD CONSTRAINT "lookbook_tags_lookbook_id_lookbook_id_fk" FOREIGN KEY ("lookbook_id") REFERENCES "public"."lookbook"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "product_reviews" ADD CONSTRAINT "product_reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_alerts" ADD CONSTRAINT "stock_alerts_variant_id_product_variants_id_fk" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "stock_alerts" ADD CONSTRAINT "stock_alerts_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;