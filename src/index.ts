import {setUser, readConfig} from "./config";
function main() {
  setUser("Alex")
  console.log(readConfig())
}

main();
