import { timestamp,serial, text, pgTable, pgSchema, doublePrecision } from "drizzle-orm/pg-core";

export const productsTable = pgTable('product', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  imageId : text('imageId').notNull(),
  price : doublePrecision("price").notNull(),
  description: text('description').notNull(),
  createdAt :  timestamp('createAt').notNull().defaultNow(),
  updatedAt : timestamp('updatedAt').defaultNow(),

 });

 export type product = typeof productsTable.$inferSelect
 