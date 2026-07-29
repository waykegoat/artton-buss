import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const siteSettings = sqliteTable('site_settings', {
  key: text('key').primaryKey(),
  valueJson: text('value_json').notNull(),
  updatedAt: integer('updated_at').notNull(),
})

export const leads = sqliteTable('leads', {
  id: text('id').primaryKey(),
  intent: text('intent').notNull(),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  comment: text('comment').notNull().default(''),
  status: text('status').notNull().default('new'),
  source: text('source').notNull().default('website'),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
})

export const portfolioItems = sqliteTable('portfolio_items', {
  id: text('id').primaryKey(),
  category: text('category').notNull(),
  title: text('title').notNull(),
  description: text('description').notNull().default(''),
  imageKey: text('image_key').notNull(),
  imageAlt: text('image_alt').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: integer('is_published', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
})

export const loginAttempts = sqliteTable('login_attempts', {
  fingerprint: text('fingerprint').primaryKey(),
  attempts: integer('attempts').notNull().default(0),
  blockedUntil: integer('blocked_until').notNull().default(0),
  updatedAt: integer('updated_at').notNull(),
})

export const requestLimits = sqliteTable('request_limits', {
  fingerprint: text('fingerprint').primaryKey(),
  count: integer('count').notNull().default(0),
  windowStartedAt: integer('window_started_at').notNull(),
  updatedAt: integer('updated_at').notNull(),
})

export const auditLog = sqliteTable('audit_log', {
  id: text('id').primaryKey(),
  actor: text('actor').notNull(),
  action: text('action').notNull(),
  entityType: text('entity_type').notNull(),
  entityId: text('entity_id').notNull(),
  detailsJson: text('details_json').notNull().default('{}'),
  createdAt: integer('created_at').notNull(),
})
