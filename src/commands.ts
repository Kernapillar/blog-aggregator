import { setUser, readConfig } from "./config";
export type CommandHandler = (cmdName: string, ...args: string[]) => void; 

export function handlerLogin(cmdName: string, ...args: string[]): void {
    if (args.length === 0) {
        throw new Error("Login handler expects a Username");
    };
    setUser(args[0]); 
    console.log(`User has been set to ${args[0]}`);
}

export type CommandRegistry = Record<string, CommandHandler>; 

export function registerCommand(registry: CommandRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler;
};
export function runCommand(registry: CommandRegistry, cmdName: string, ...args: string[]) {
    const command = registry[cmdName];
    if (!command) {
        throw new Error(`Command '${cmdName}' not found`); 
    };
    command(cmdName, ...args);
}