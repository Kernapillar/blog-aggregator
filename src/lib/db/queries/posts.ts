import { db } from "..";
import { posts, NewPost } from "../schema";
import { eq, sql} from "drizzle-orm"

export type Post = typeof posts.$inferSelect; 

export async function createPost(post: NewPost) {
    const [result] = await db.insert(posts).values(post).returning();
    return result;
};