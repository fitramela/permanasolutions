-- CreateTable
CREATE TABLE `users` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `active_status` BOOLEAN NOT NULL DEFAULT false,
    `two_fa_secret` VARCHAR(255) NULL,
    `two_fa_enabled` BOOLEAN NOT NULL DEFAULT false,
    `last_login_at` DATETIME(0) NULL,
    `created_at` TIMESTAMP(0) NULL,
    `updated_at` TIMESTAMP(0) NULL,

    UNIQUE INDEX `users_email_unique`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `otps` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `code` VARCHAR(6) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `used` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL,

    INDEX `otps_email_idx`(`email`),
    INDEX `otps_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `password_resets` (
    `id` CHAR(36) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `token` VARCHAR(255) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `password_resets_email_key`(`email`),
    UNIQUE INDEX `password_resets_token_key`(`token`),
    INDEX `password_resets_email_idx`(`email`),
    INDEX `password_resets_token_idx`(`token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `leads` (
    `id` CHAR(36) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `company` VARCHAR(100) NULL,
    `phone` VARCHAR(20) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `message` TEXT NOT NULL,
    `status` VARCHAR(20) NOT NULL DEFAULT 'new',
    `source` VARCHAR(191) NULL DEFAULT 'website',
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cms_pages` (
    `id` CHAR(36) NOT NULL,
    `slug` VARCHAR(100) NOT NULL,
    `locale` VARCHAR(10) NOT NULL DEFAULT 'en',
    `title` VARCHAR(150) NOT NULL,
    `page_type` VARCHAR(30) NOT NULL DEFAULT 'page',
    `status` VARCHAR(20) NOT NULL DEFAULT 'published',
    `meta_title` VARCHAR(255) NULL,
    `meta_description` TEXT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `cms_pages_locale_idx`(`locale`),
    INDEX `cms_pages_page_type_idx`(`page_type`),
    INDEX `cms_pages_status_idx`(`status`),
    UNIQUE INDEX `cms_pages_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cms_sections` (
    `id` CHAR(36) NOT NULL,
    `page_id` CHAR(36) NULL,
    `section_key` VARCHAR(100) NOT NULL,
    `locale` VARCHAR(10) NOT NULL DEFAULT 'en',
    `title` VARCHAR(150) NULL,
    `content` JSON NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `cms_sections_page_id_sort_order_idx`(`page_id`, `sort_order`),
    INDEX `cms_sections_section_key_locale_idx`(`section_key`, `locale`),
    UNIQUE INDEX `cms_sections_page_id_section_key_locale_key`(`page_id`, `section_key`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` CHAR(36) NOT NULL,
    `setting_key` VARCHAR(100) NOT NULL,
    `value` JSON NOT NULL,
    `updated_at` TIMESTAMP(0) NOT NULL,

    UNIQUE INDEX `site_settings_setting_key_key`(`setting_key`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(150) NOT NULL,
    `service` VARCHAR(50) NOT NULL,
    `category` VARCHAR(100) NULL,
    `locale` VARCHAR(10) NOT NULL DEFAULT 'en',
    `description` TEXT NULL,
    `image_url` VARCHAR(500) NULL,
    `meta` JSON NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `products_service_is_active_idx`(`service`, `is_active`),
    INDEX `products_locale_idx`(`locale`),
    UNIQUE INDEX `products_slug_locale_key`(`slug`, `locale`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `product_features` (
    `id` CHAR(36) NOT NULL,
    `product_id` CHAR(36) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `description` TEXT NULL,
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `product_features_product_id_sort_order_idx`(`product_id`, `sort_order`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `clients` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `industry` VARCHAR(100) NULL,
    `logo_url` VARCHAR(500) NULL,
    `placement` VARCHAR(100) NULL,
    `locale` VARCHAR(10) NOT NULL DEFAULT 'en',
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `clients_locale_is_active_idx`(`locale`, `is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `technologies` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `category` VARCHAR(100) NULL,
    `logo_url` VARCHAR(500) NULL,
    `locale` VARCHAR(10) NOT NULL DEFAULT 'en',
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `technologies_locale_is_active_idx`(`locale`, `is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `team_members` (
    `id` CHAR(36) NOT NULL,
    `name` VARCHAR(150) NOT NULL,
    `position` VARCHAR(150) NULL,
    `bio` TEXT NULL,
    `photo_url` VARCHAR(500) NULL,
    `linkedin_url` VARCHAR(500) NULL,
    `locale` VARCHAR(10) NOT NULL DEFAULT 'en',
    `sort_order` INTEGER NOT NULL DEFAULT 0,
    `is_active` BOOLEAN NOT NULL DEFAULT true,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `team_members_locale_is_active_idx`(`locale`, `is_active`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visitors` (
    `id` CHAR(36) NOT NULL,
    `visitor_id` VARCHAR(64) NOT NULL,
    `first_seen_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `last_seen_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `visitors_visitor_id_key`(`visitor_id`),
    INDEX `visitors_first_seen_at_idx`(`first_seen_at`),
    INDEX `visitors_last_seen_at_idx`(`last_seen_at`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `visitor_sessions` (
    `id` CHAR(36) NOT NULL,
    `visitor_id` VARCHAR(64) NOT NULL,
    `session_id` VARCHAR(64) NOT NULL,
    `ip_hash` VARCHAR(64) NULL,
    `user_agent` VARCHAR(500) NULL,
    `network_agent_hash` VARCHAR(64) NULL,
    `referrer` VARCHAR(1000) NULL,
    `started_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `last_seen_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `visitor_sessions_session_id_key`(`session_id`),
    INDEX `visitor_sessions_visitor_id_idx`(`visitor_id`),
    INDEX `visitor_sessions_started_at_idx`(`started_at`),
    INDEX `visitor_sessions_last_seen_at_idx`(`last_seen_at`),
    INDEX `visitor_sessions_network_agent_hash_idx`(`network_agent_hash`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `page_views` (
    `id` CHAR(36) NOT NULL,
    `visitor_id` VARCHAR(64) NOT NULL,
    `session_id` VARCHAR(64) NOT NULL,
    `path` VARCHAR(500) NOT NULL,
    `locale` VARCHAR(10) NULL,
    `referrer` VARCHAR(1000) NULL,
    `viewed_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `page_views_viewed_at_idx`(`viewed_at`),
    INDEX `page_views_visitor_id_viewed_at_idx`(`visitor_id`, `viewed_at`),
    INDEX `page_views_session_id_viewed_at_idx`(`session_id`, `viewed_at`),
    INDEX `page_views_path_idx`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `cms_sections` ADD CONSTRAINT `cms_sections_page_id_fkey` FOREIGN KEY (`page_id`) REFERENCES `cms_pages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_features` ADD CONSTRAINT `product_features_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `visitor_sessions` ADD CONSTRAINT `visitor_sessions_visitor_id_fkey` FOREIGN KEY (`visitor_id`) REFERENCES `visitors`(`visitor_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `page_views` ADD CONSTRAINT `page_views_session_id_fkey` FOREIGN KEY (`session_id`) REFERENCES `visitor_sessions`(`session_id`) ON DELETE CASCADE ON UPDATE CASCADE;
