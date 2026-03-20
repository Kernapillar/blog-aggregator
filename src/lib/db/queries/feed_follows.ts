import { db } from "..";
import { feeds, users, feed_follows } from "../schema";
import { eq } from "drizzle-orm"

export type FeedFollow = typeof feed_follows.$inferSelect; 

export async function createFeedFollow(userId: string, feedId: string) {

    const [newFeedFollow] = await db.insert(feed_follows).values({ userId, feedId }).returning();
    const [result] = await db.select({
        id: feed_follows.id, 
        createdAt: feed_follows.createdAt, 
        updatedAt: feed_follows.updatedAt,
        feedId: feed_follows.feedId, 
        userId: feed_follows.userId, 
        feedName: feeds.name, 
        userName: users.name
    }).from(feed_follows).innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
        .where(eq(feed_follows.id, newFeedFollow.id))
        .innerJoin(users, eq(feed_follows.userId, users.id)); 
    return result; 
};

export async function getFeed(name: string) {
    const [result] = await db.select().from(feeds).where(eq(feeds.name, name))
    return result; 
}

export async function getFeeds() {
    const result = await db.select().from(feeds).leftJoin(users, eq(feeds.userId, users.id));
    return result
}

