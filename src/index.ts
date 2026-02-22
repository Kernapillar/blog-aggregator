import { CommandRegistry, registerCommand, handlerLogin, runCommand } from "./commands";

function main() {
  const cmdRegistry: CommandRegistry = {};
  registerCommand(cmdRegistry, "login", handlerLogin); 
  const inputArgs = process.argv.slice(2); 
  if (inputArgs.length === 0) {
    console.log("One or more arguments required"); 
    process.exit(1);
  }
  const cmdName = inputArgs[0]; 
  const cmdArgs = inputArgs.slice(1);
  try {
    runCommand(cmdRegistry, cmdName, ...cmdArgs);
  } catch (error) {
    console.log(error instanceof Error ? console.log(error) : String(error))
    process.exit(1);
  }
}

main();
