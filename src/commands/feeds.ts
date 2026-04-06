import { createFeed, Feed, getFeeds,markFeedFetched, getNextFeedToFetch, getFeedByUrl} from "../lib/db/queries/feeds";
import { createFeedFollow } from "src/lib/db/queries/feed-follows";
import { User } from "src/lib/db/queries/users";
import { fetchFeed } from "../rssfeed";
import { readConfig } from "src/config";
import { handleError } from "./commands";

export async function handlerAgg(cmdName: string, time_between_reqs: string) {

    const timeBetween = parseDuration(time_between_reqs); 
    if (!timeBetween) {
        throw new Error(`Invalid duration, please use a proper format (1s, 2m, 3h, 500ms)`)
    }

    console.log(`fetching feeds every ${timeBetween} ms: `); 
    scrapeFeeds().catch(handleError); 

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError); 
    }, timeBetween); 
    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregation..."); 
            clearInterval(interval); 
            resolve(); 
        })
    })
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

export async function scrapeFeeds() {
    const nextFeed = await getNextFeedToFetch(); 
    if (!nextFeed) {
        console.log("no next feed available")
        return; 
    }
    await markFeedFetched(nextFeed.id); 
    const feed = await fetchFeed(nextFeed.url); 
    for (let feedItem of feed.channel.item) {
        console.log(feedItem.title); 
    }
}

export function parseDuration(durationStr: string) {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);
    if (!match || match.length < 3) {
        return; 
    }
    const timeUnit = match[2]
    let miliseconds; 
    switch (timeUnit) {
        case "s":
            miliseconds = parseInt(match[1]) * 1000 
            break;
        case "m":
            miliseconds = parseInt(match[1]) * 60 * 1000 
            break;
        case "h":
            miliseconds = parseInt(match[1]) * 60 * 60 * 1000             
            break;
        case "ms":
            miliseconds = parseInt(match[1])         
            break;
    }
    return miliseconds; 
}