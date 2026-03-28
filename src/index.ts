import { CommandRegistry, registerCommand, runCommand, } from "./commands/commands";
import { handlerLogin, handlerRegister, handlerGetUsers, handlerClearUsers } from "./commands/users";
import { handlerAgg, handlerAddFeed, handlerGetFeeds } from "./commands/feeds";
import { handlerFollow, handlerFollowing } from "./commands/feed-follows";
import { middlewareLoggedIn } from "./commands/commands";
async function main() {
  const cmdRegistry: CommandRegistry = {};
  registerCommand(cmdRegistry, "login", handlerLogin); 
  registerCommand(cmdRegistry, "register", handlerRegister); 
  registerCommand(cmdRegistry, "reset", handlerClearUsers); 
  registerCommand(cmdRegistry, "users", handlerGetUsers); 
  registerCommand(cmdRegistry, "agg", handlerAgg); 
  registerCommand(cmdRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed)); 
  registerCommand(cmdRegistry, "feeds", handlerGetFeeds); 
  registerCommand(cmdRegistry, "follow", middlewareLoggedIn(handlerFollow)); 
  registerCommand(cmdRegistry, "following", middlewareLoggedIn(handlerFollowing)); 
  const inputArgs = process.argv.slice(2); 
  if (inputArgs.length === 0) {
    console.log("One or more arguments required"); 
    process.exit(1);
  }
  const cmdName = inputArgs[0]; 
  const cmdArgs = inputArgs.slice(1);
  try {
    await runCommand(cmdRegistry, cmdName, ...cmdArgs);
  } catch (error) {
    console.log(error instanceof Error ? console.log(error) : String(error))
    process.exit(1);
  }
  process.exit(0);
}

main();
