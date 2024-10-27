CREATE TABLE `users` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text(100) NOT NULL,
	`email` text(50) NOT NULL,
	`age` integer NOT NULL,
	`position` text(50),
	`timestamp` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);