import { foreignKey } from "drizzle-orm/gel-core";
import { pgTable, timestamp, uuid, text, unique} from "drizzle-orm/pg-core";
import { table } from "node:console";

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    name: text("name").notNull().unique(),
});

export const feeds = pgTable("feeds", {
    id: uuid("id").primaryKey().defaultRandom().notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    lastFetchedAt: timestamp("last_fetched_at"),
    name: text("name").notNull(),
    url: text("url").notNull().unique(), 
    userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"})
});

export const feed_follows = pgTable("feed_follows", {
    id: uuid("id").primaryKey().defaultRandom().notNull(), 
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at")
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    userId: uuid("user_id").notNull().references(() => users.id, {onDelete: "cascade"}), 
    feedId: uuid("feed_id").notNull().references(() => feeds.id, {onDelete: "cascade"}),
}, (table) => ({
        unq: unique().on(table.userId, table.feedId)
    })
)