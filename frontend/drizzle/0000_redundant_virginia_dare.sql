CREATE TABLE `LibAncestralDomain` (
	`id` integer PRIMARY KEY NOT NULL,
	`ancestral_domain_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `LibAncestralDomainCoverage` (
	`id` integer PRIMARY KEY NOT NULL,
	`ancestral_domain_coverage_description` text NOT NULL,
	`ancestral_domain_id` text NOT NULL,
	`region_code` text,
	`province_code` text,
	`city_code` text,
	`brgy_code` text,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`ancestral_domain_id`) REFERENCES `LibAncestralDomain`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`region_code`) REFERENCES `LibRegion`(`region_code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`province_code`) REFERENCES `LibProvince`(`province_code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`city_code`) REFERENCES `LibCity`(`city_code`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brgy_code`) REFERENCES `LibBarangay`(`brgy_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `LibBarangay` (
	`brgy_code` text PRIMARY KEY NOT NULL,
	`brgy_name` text NOT NULL,
	`brgy_nick` text,
	`city_code` text,
	`sort_order` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`city_code`) REFERENCES `LibCity`(`city_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `LibCity` (
	`city_code` text PRIMARY KEY NOT NULL,
	`city_name` text NOT NULL,
	`city_nick` text,
	`province_code` text,
	`sort_order` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`province_code`) REFERENCES `LibProvince`(`province_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `LibCivilStatus` (
	`id` integer PRIMARY KEY NOT NULL,
	`civil_status_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `LibCycle` (
	`id` integer NOT NULL,
	`fund_source_id` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`fund_source_id`) REFERENCES `LibFundSource`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `LibEducationalAttainment` (
	`id` integer PRIMARY KEY NOT NULL,
	`educational_attainment_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `LibFundSource` (
	`id` integer PRIMARY KEY NOT NULL,
	`fund_source_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `LibLguLevel` (
	`id` integer PRIMARY KEY NOT NULL,
	`lgu_level_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `LibLguPosition` (
	`id` integer PRIMARY KEY NOT NULL,
	`lgu_position_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `LibMode` (
	`id` integer PRIMARY KEY NOT NULL,
	`mode_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `LibOccupation` (
	`id` integer PRIMARY KEY NOT NULL,
	`occupation_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `LibProvince` (
	`province_code` text PRIMARY KEY NOT NULL,
	`province_name` text NOT NULL,
	`province_nick` text NOT NULL,
	`region_code` text,
	`sort_order` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`region_code`) REFERENCES `LibRegion`(`region_code`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `LibRegion` (
	`region_code` text PRIMARY KEY NOT NULL,
	`region_name` text NOT NULL,
	`region_nick` text,
	`sort_order` integer,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `LibSex` (
	`id` integer PRIMARY KEY NOT NULL,
	`sex_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` text PRIMARY KEY NOT NULL,
	`module_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `permissions` (
	`id` text PRIMARY KEY NOT NULL,
	`permission_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `roles` (
	`id` text PRIMARY KEY NOT NULL,
	`role_description` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`created_by` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE TABLE `useraccess` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`module_id` text NOT NULL,
	`role_id` text NOT NULL,
	`permission_id` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`text` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`module_id`) REFERENCES `modules`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`role_id`) REFERENCES `roles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`permission_id`) REFERENCES `permissions`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`created_date` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`text` text NOT NULL,
	`last_modified_date` text DEFAULT CURRENT_TIMESTAMP,
	`last_modified_by` text,
	`push_status_id` integer DEFAULT 0,
	`push_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_date` text DEFAULT CURRENT_TIMESTAMP,
	`deleted_by` text,
	`is_deleted` integer DEFAULT false,
	`remarks` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);