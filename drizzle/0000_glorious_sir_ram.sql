-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "entries" (
	"id" text PRIMARY KEY NOT NULL,
	"space" text NOT NULL,
	"environment" text NOT NULL,
	"content_type" text NOT NULL,
	"version" integer,
	"fields" json
);
--> statement-breakpoint
CREATE TABLE "assets" (
	"id" text PRIMARY KEY NOT NULL,
	"space" text NOT NULL,
	"environment" text NOT NULL,
	"version" integer,
	"fields" json
);
--> statement-breakpoint
CREATE INDEX "content_type" ON "entries" USING btree ("content_type" text_ops);--> statement-breakpoint
CREATE INDEX "space" ON "entries" USING btree ("space" text_ops,"environment" text_ops);--> statement-breakpoint
CREATE INDEX "assets_space" ON "assets" USING btree ("space" text_ops,"environment" text_ops);
*/