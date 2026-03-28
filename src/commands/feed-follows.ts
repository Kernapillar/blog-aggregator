import { getFeedByUrl} from "../lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser, unfollow} from "src/lib/db/queries/feed-follows";
import { getUser, User} from "src/lib/db/queries/users";
import { readConfig } from "src/config";

export async function handlerFollow(cmdName: string, user: User, url: string) {
    const feed = await getFeedByUrl(url); 
    if (!feed) {
        throw new Error(`invalid feed url: ${url}`); 
    }; 
    const newFeedFollow = await createFeedFollow(user.id, feed.id); 
    console.log(newFeedFollow.feedName)
    console.log(newFeedFollow.userName); 
}

export async function handlerFollowing(cmdName: string, user: User) {
    let feeds = await getFeedFollowsForUser(user.id);
    if (!feeds) {
        throw new Error("no feeds currently followed")
    }
    console.log(`${user.name} is following: `)
    for (let feed of feeds) {
        console.log(feed.feedName)
    }
}

export async function handlerUnfollow(cmdName: string, user: User, url: string) {
    const feed = await getFeedByUrl(url); 
    if (!feed) {
        throw new Error(`invalid feed url: ${url}`); 
    }; 
    
}