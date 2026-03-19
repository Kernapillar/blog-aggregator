import { setUser, readConfig } from "./config";
import { createUser, getUser, clearUsers, getUsers, User } from "./lib/db/queries/users";
import { createFeed, Feed, getFeeds } from "./lib/db/queries/feeds";
import { fetchFeed } from "./rssfeed";
import { feeds } from "./lib/db/schema";
export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>; 

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Login handler expects a Username");
    };
    if (await getUser(args[0]) === undefined ) {
        throw new Error(`No user with username ${args[0]} exists`)
    }
    setUser(args[0]); 
    console.log(`User has been set to ${args[0]}`);
}

export type CommandRegistry = Record<string, CommandHandler>; 

export async function registerCommand(registry: CommandRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
};
export async function runCommand(registry: CommandRegistry, cmdName: string, ...args: string[]) {
    const command = registry[cmdName];
    if (!command) {
        throw new Error(`Command '${cmdName}' not found`); 
    };
    await command(cmdName, ...args);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length === 0) {
        throw new Error("Login handler expects a Username");
    };
    const name = args[0];
    if (await getUser(name) !== undefined ) {
        throw new Error("User with that name already exists");
    }
    const newUser = await createUser(name);
    setUser(name);
    console.log(`New user ${name} created`);
    console.log(newUser);
}

export async function handlerClearUsers(cmdName: string) {
    await clearUsers()
    console.log("Successfully deleted users table")
}

export async function handlerGetUsers(_: string) {
    const users = await getUsers();
    const currentUser = readConfig(); 
    for (let user of users) {
        let newLine = `* ${user.name}`
        let end = user.name === currentUser.currentUserName ? " (current)" : ""
        console.log(newLine + end)
    }
}

export async function handlerAgg(cmdName: string) {
    const feed = await fetchFeed('https://www.wagslane.dev/index.xml'); 
    console.log(JSON.stringify(feed, null, 2));
}

function printFeed(feed: Feed, user: User) {
    console.log(feed); 
    console.log(user); 
}

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length < 2) {
        throw new Error("not enough arguments to add a feed");
    }; 
    const user = (await getUser(readConfig().currentUserName)); 
    if (!user) {
        throw new Error("invalid user");
    }
    const [name, url] = args;
    const feed = await createFeed(name, url, user.id); 
    if (feed) {
        printFeed(feed, user); 
    } else {
        throw new Error("feed is undefined")
    }
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