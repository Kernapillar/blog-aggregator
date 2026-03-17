import { db } from "..";
import { feeds } from "../schema";
import { eq } from "drizzle-orm"

export type Feed = typeof feeds.$inferSelect; 

export async function createFeed(name: string, url: string, userId: string) {

    const [result] = await db.insert(feeds).values({ name, url, userId }).returning();
    return result;
};
