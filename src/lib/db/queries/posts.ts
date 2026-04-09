import { db } from "..";
import { posts, NewPost, feed_follows, feeds} from "../schema";
import { eq, desc} from "drizzle-orm"

export type Post = typeof posts.$inferSelect; 

export async function createPost(post: NewPost) {
    const [result] = await db.insert(posts).values(post).returning();
    return result;
};

export async function getPostsForUser(userId: string, limit: number) {
    const result = await db.select().from(posts).innerJoin(feeds, eq(posts.feedId, feeds.id))
        .innerJoin(feed_follows, eq(feed_follows.feedId, feeds.id))
        .where(eq(feed_follows.userId, userId))
        .orderBy(desc(posts.publishedAt))
        .limit(limit);
    return result; 
}