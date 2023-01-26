import path from "path";
import fs from "fs";
import { createTestAccount } from "nodemailer";

const envData = (email_user: string, email_password: string) => `
# EMAIL CONFIGURATION
EMAIL_FROM=noreply@workattackangola.com
EMAIL_FROM_NAME=noreply WorkAttack
EMAIL_HOST=smtp.ethereal.email
EMAIL_PORT=587 
#or 465 for production
EMAIL_USER=${email_user}
EMAIL_PASSWORD=${email_password}
EMAIL_SECURE=false 
#true for production
`;

export const generateEmailEnvFile = async () => {
  if (!require.main?.filename) return;

  const filename = ".email.env";
  const fileDir = path.dirname(require.main.filename);

  console.log("creating file on folder: ", fileDir);

  // verify if the env file is present
  const exists = fs.existsSync(path.join(fileDir, filename));

  // if not, create it
  if (exists) {
    console.log("file already exists");
    return;
  }

  let testAccount = await createTestAccount();
  fs.writeFileSync(
    path.join(fileDir, filename),
    envData(testAccount.user, testAccount.pass),
    "utf8"
  );
  console.log(`file ${filename} was created successfully`);
};
