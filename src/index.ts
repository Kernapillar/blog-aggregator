import { CommandRegistry, registerCommand, handlerLogin, runCommand, handlerRegister, handlerGetUsers, handlerClearUsers, handlerAgg} from "./commands";

async function main() {
  const cmdRegistry: CommandRegistry = {};
  registerCommand(cmdRegistry, "login", handlerLogin); 
  registerCommand(cmdRegistry, "register", handlerRegister); 
  registerCommand(cmdRegistry, "reset", handlerClearUsers); 
  registerCommand(cmdRegistry, "users", handlerGetUsers); 
  registerCommand(cmdRegistry, "agg", handlerAgg); 
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
