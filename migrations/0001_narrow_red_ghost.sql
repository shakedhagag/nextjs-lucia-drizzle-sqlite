CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`account_type` text NOT NULL,
	`github_id` text,
	`google_id` text,
	`password` text,
	`salt` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_user_id_unique` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_github_id_unique` ON `accounts` (`github_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_google_id_unique` ON `accounts` (`google_id`);