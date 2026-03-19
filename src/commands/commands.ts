export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>; 

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


