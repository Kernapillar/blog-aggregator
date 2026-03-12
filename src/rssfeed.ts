import { XMLParser } from "fast-xml-parser";
export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

export type RSSItem = {
    title: string;
    link: string;
    description: string;
    pubDate: string;
};

export async function fetchFeed(feedURL: string) {
    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator", 
        },
    });
    const responseStr = await response.text(); 
    const parser = new XMLParser(); 
    const DataObj = parser.parse(responseStr); 
    if (DataObj.rss.channel === undefined) {
        throw new Error("invalid RSS fetch data"); 
    }; 
    if (!DataObj.rss.channel.title || !DataObj.rss.channel.link || !DataObj.rss.channel.description) {
        throw new Error("missing required channel fields")
    }
    
    const title = DataObj.rss.channel.title
    const link = DataObj.rss.channel.link
    const description = DataObj.rss.channel.description

    let items: RSSItem[] = []; 
    if (Array.isArray(DataObj.rss.channel.item)) {
        items = DataObj.rss.channel.item;
    } else if (DataObj.rss.channel.item) {
        items = [DataObj.rss.channel.item];
    }
    const processedItems = []
    for (let item of items) {
        if (item.title && item.link && item.description && item.pubDate) {
            processedItems.push({title: item.title, link: item.link, description: item.description, pubDate: item.pubDate});
        }
    };

    const feed = {
        channel: {
            title: title, 
            link: link, 
            description: description, 
            item: processedItems
        }
    }
    return feed
}