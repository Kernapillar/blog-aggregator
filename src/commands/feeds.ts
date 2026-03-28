import { createFeed, Feed, getFeeds } from "../lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feed-follows";
import { User } from "src/lib/db/queries/users";
import { fetchFeed } from "../rssfeed";
import { readConfig } from "src/config";

export async function handlerAgg(cmdName: string) {
    const feed = await fetchFeed('https://www.wagslane.dev/index.xml'); 
    console.log(JSON.stringify(feed, null, 2));
}

function printFeed(feed: Feed, user: User) {
    console.log(feed); 
    console.log(user); 
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length < 2) {
        throw new Error("not enough arguments to add a feed");
    }; 
    const [name, url] = args;
    const feed = await createFeed(name, url, user.id); 
    if (feed) {
        printFeed(feed, user); 
    } else {
        throw new Error("feed is undefined")
    }
    const feedFollow = await createFeedFollow(user.id, feed.id); 
    console.log(`${user.name} is now following: ${feed.name}`)
}

export async function handlerGetFeeds(cmdName: string) {
    const feeds = await getFeeds()
    for (let feed of feeds) {
        console.log(feed.feeds.name);
        console.log(feed.feeds.url);
        console.log(feed.users ? feed.users.name : "");
        console.log("-------------------")
    }
}