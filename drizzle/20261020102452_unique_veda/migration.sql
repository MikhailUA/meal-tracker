CREATE TABLE "food_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" text NOT NULL,
	"calories" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meal_food_items" (
	"meal_id" uuid,
	"food_item_id" uuid,
	"quantity" numeric(8,2) DEFAULT '1' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meal_food_items_pkey" PRIMARY KEY("meal_id","food_item_id")
);
--> statement-breakpoint
CREATE TABLE "meals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"eaten_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "food_items_name_idx" ON "food_items" ("name");--> statement-breakpoint
CREATE INDEX "meal_food_items_food_item_id_idx" ON "meal_food_items" ("food_item_id");--> statement-breakpoint
CREATE INDEX "meals_user_id_eaten_at_idx" ON "meals" ("user_id","eaten_at");--> statement-breakpoint
ALTER TABLE "meal_food_items" ADD CONSTRAINT "meal_food_items_meal_id_meals_id_fkey" FOREIGN KEY ("meal_id") REFERENCES "meals"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "meal_food_items" ADD CONSTRAINT "meal_food_items_food_item_id_food_items_id_fkey" FOREIGN KEY ("food_item_id") REFERENCES "food_items"("id") ON DELETE RESTRICT;