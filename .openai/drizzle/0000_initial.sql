CREATE TABLE `site_settings` (
  `key` text PRIMARY KEY NOT NULL,
  `value_json` text NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE `leads` (
  `id` text PRIMARY KEY NOT NULL,
  `intent` text NOT NULL,
  `name` text NOT NULL,
  `phone` text NOT NULL,
  `comment` text DEFAULT '' NOT NULL,
  `status` text DEFAULT 'new' NOT NULL,
  `source` text DEFAULT 'website' NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE INDEX `leads_status_created_idx` ON `leads` (`status`, `created_at`);

CREATE TABLE `portfolio_items` (
  `id` text PRIMARY KEY NOT NULL,
  `category` text NOT NULL,
  `title` text NOT NULL,
  `description` text DEFAULT '' NOT NULL,
  `image_key` text NOT NULL,
  `image_alt` text NOT NULL,
  `sort_order` integer DEFAULT 0 NOT NULL,
  `is_published` integer DEFAULT true NOT NULL,
  `created_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE INDEX `portfolio_published_sort_idx`
  ON `portfolio_items` (`is_published`, `sort_order`);

CREATE TABLE `login_attempts` (
  `fingerprint` text PRIMARY KEY NOT NULL,
  `attempts` integer DEFAULT 0 NOT NULL,
  `blocked_until` integer DEFAULT 0 NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE `request_limits` (
  `fingerprint` text PRIMARY KEY NOT NULL,
  `count` integer DEFAULT 0 NOT NULL,
  `window_started_at` integer NOT NULL,
  `updated_at` integer NOT NULL
);

CREATE TABLE `audit_log` (
  `id` text PRIMARY KEY NOT NULL,
  `actor` text NOT NULL,
  `action` text NOT NULL,
  `entity_type` text NOT NULL,
  `entity_id` text NOT NULL,
  `details_json` text DEFAULT '{}' NOT NULL,
  `created_at` integer NOT NULL
);

CREATE INDEX `audit_log_created_idx` ON `audit_log` (`created_at`);
