import { db } from "..";
import { feeds, users, feed_follows } from "../schema";
import { eq, and } from "drizzle-orm"
import { getFeedByUrl } from "./feeds";

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
        .innerJoin(users, eq(feed_follows.userId, users.id))
        .where(eq(feed_follows.id, newFeedFollow.id)); 
    return result; 
};

export async function getFeedFollowsForUser(userId: string) {
    const result = await db.select({
        feedFollows: feed_follows.id, 
        feedName: feeds.name, 
        userName: users.name
    }).from(feed_follows).innerJoin(users, eq(feed_follows.userId, users.id))
        .innerJoin(feeds, eq(feed_follows.feedId, feeds.id))
        .where(eq(feed_follows.userId, userId));
    return result
};

export async function unfollow(userId: string, feedId: string) {
    await db.delete(feed_follows)
            .where(and(eq(feed_follows.userId, userId), 
                        eq(feed_follows.feedId, feedId)))
}