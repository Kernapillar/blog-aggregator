import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string;
}

export function setUser(username: string): void {
    // sets the user (current_user_name)in the baconfig.json
    const config = fs.readFileSync(path.join(os.homedir(),"baconfig.json"), {encoding: 'utf-8'});
    const currentDbUrl = JSON.parse(config).db_url
    const newConfig: Config = {
        dbUrl: currentDbUrl, 
        currentUserName: username
    };
    writeConfig(newConfig);

};

// export function readConfig(): Config {
    
// };


function writeConfig(config: Config): void {
    const newObj = {
        db_url: config.dbUrl, 
        current_user_name: config.currentUserName
    };

    const newConfig = JSON.stringify(newObj);
    fs.writeFileSync(path.join(os.homedir(), "baconfig.json"), newConfig);
}