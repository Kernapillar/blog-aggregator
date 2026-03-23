import { getFeedByUrl} from "../lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feed-follows";
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


