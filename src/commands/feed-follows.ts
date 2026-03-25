import { getFeedByUrl} from "../lib/db/queries/feeds";
import { createFeedFollow, getFeedFollowsForUser} from "src/lib/db/queries/feed-follows";
import { getUser } from "src/lib/db/queries/users";
import { readConfig } from "src/config";

export async function handlerFollow(cmdName: string, url: string) {
    const feed = await getFeedByUrl(url); 
    if (!feed) {
        throw new Error(`invalid feed url: ${url}`); 
    }; 
    const user = (await getUser(readConfig().currentUserName)); 
    if (!user) {
        throw new Error("invalid user");
    }
    const newFeedFollow = await createFeedFollow(user.id, feed.id); 
    console.log(newFeedFollow.feedName)
    console.log(newFeedFollow.userName); 
}

export async function handlerFollowing(cmdName: string) {
    const user = (await getUser(readConfig().currentUserName)); 
    if (!user) {
        throw new Error("No user currently logged in");
    }; 
    let feeds = await getFeedFollowsForUser(user.id);
    if (!feeds) {
        throw new Error("no feeds currently followed")
    }
    console.log(`${user.name} is following: `)
    for (let feed of feeds) {
        console.log(feed.feedName)
    }
}