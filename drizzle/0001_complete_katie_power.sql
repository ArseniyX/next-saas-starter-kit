CREATE TABLE `payments` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`subscription_id` text,
	`stripe_payment_intent_id` text,
	`amount` integer NOT NULL,
	`currency` text DEFAULT 'usd' NOT NULL,
	`status` text NOT NULL,
	`invoice_url` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`subscription_id`) REFERENCES `subscriptions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `payments_stripe_payment_intent_id_unique` ON `payments` (`stripe_payment_intent_id`);--> statement-breakpoint
CREATE INDEX `payment_user_id_idx` ON `payments` (`user_id`);--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`stripe_price_id` text NOT NULL,
	`price` integer NOT NULL,
	`currency` text DEFAULT 'usd' NOT NULL,
	`interval` text NOT NULL,
	`features` text NOT NULL,
	`limits` text,
	`active` integer DEFAULT true,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `plans_stripe_price_id_unique` ON `plans` (`stripe_price_id`);