import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
    dbUrl: string;
    currentUserName: string;
}

export function setUser(username: string): void {
    // sets the user (current_user_name)in the .baconfig.json
    const config = fs.readFileSync(path.join(os.homedir(),".baconfig.json"), {encoding: 'utf-8'});
    const currentDbUrl = JSON.parse(config).db_url
    const newConfig: Config = {
        dbUrl: currentDbUrl, 
        currentUserName: username
    };
    writeConfig(newConfig);

};

export function readConfig(): Config {
    const config = fs.readFileSync(path.join(os.homedir(),".baconfig.json"), {encoding: 'utf-8'});
    const sanitizedConfig = validateConfig(JSON.parse(config));
    return sanitizedConfig
};


function writeConfig(config: Config): void {
    const newObj = {
        db_url: config.dbUrl, 
        current_user_name: config.currentUserName
    };

    const newConfig = JSON.stringify(newObj);
    fs.writeFileSync(path.join(os.homedir(), ".baconfig.json"), newConfig);
}

function validateConfig(rawConfig: any): Config {
    if ("db_url" in rawConfig === false ){
        throw new Error("db_url must be present")
    }
    if (typeof rawConfig.db_url !== "string") {
        throw new Error("db_url must be a string")
    }
    if ("current_user_name" in rawConfig && typeof rawConfig.current_user_name !== "string") {
        throw new Error("current_user_name must be a string")
    }
    const validConfig = {
        dbUrl: rawConfig.db_url, 
        currentUserName: ("current_user_name" in rawConfig? rawConfig.current_user_name : "")
    }
    return validConfig
}