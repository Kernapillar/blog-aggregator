import { User } from "src/lib/db/queries/users";
import { getUser } from "src/lib/db/queries/users";
import { readConfig } from "src/config";
export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>; 
export type UserCommandHandler = (cmdName: string, user: User, ...args: string[]) => Promise<void>; 

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

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
    return async (cmdName, ...args) => {
        const user = (await getUser(readConfig().currentUserName)); 
        if (!user) {
            throw new Error("invalid user");
        }
        await handler(cmdName, user, ...args) 
    }
}

export function handleError(err: unknown) {
    console.error(`Error scraping feeds: ${err instanceof Error ? err.message : err}`); 
}