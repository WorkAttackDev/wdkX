import path from "path";
import fs from "fs";

const data = `
import { Core } from "@workattackdev/wdk";

export const WdkApp = Core.initializeApp({
  ACCESS_TOKEN_COOKIE_NAME:
    process.env.ACCESS_TOKEN_COOKIE_NAME || "access_token",
  API_SECRET: process.env.API_SECRET || "workattack@workattackangola.com",
  DOMAIN: process.env.DOMAIN || "localhost",
  HOST: process.env.HOST || "http://localhost:3000",
  IS_PRODUCTION: process.env.NODE_ENV === "production",
  NAME: process.env.Name || "WorkAttack",
  REFRESH_TOKEN_COOKIE_NAME:
    process.env.REFRESH_TOKEN_COOKIE_NAME || "refresh_token",
  HASH_SALT: process.env.HASH_SALT,
});
`;

const envData = `
ACCESS_TOKEN_COOKIE_NAME="access_token"
API_SECRET="workattack@workattackangola.com"
DOMAIN="localhost"
HOST="http://localhost:3000"
IS_PRODUCTION=false, // true for production
NAME="WorkAttack"
REFRESH_TOKEN_COOKIE_NAME="refresh_token"
// HASH_SALT is optional
`;

export const initApp = async () => {
  if (!require.main?.filename) return;

  const files = [
    {
      data: data,
      filename: "app.ts",
    },
    {
      data: envData,
      filename: ".wdk.env",
    },
  ];

  const fileDir = path.dirname(require.main.filename);

  console.log("creating file on folder: ", fileDir);

  for (const file of files) {
    const exists = fs.existsSync(path.join(fileDir, file.filename));

    if (exists) {
      console.log(`file ${file.filename} already exists`);
      continue;
    }

    fs.writeFileSync(path.join(fileDir, file.filename), file.data, "utf8");
    console.log(`file ${file.filename} was created successfully`);
  }
};
