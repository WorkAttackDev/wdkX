import nodemailer from "nodemailer";
import { MailerRepository } from "./repositories";
export * as Templates from "./templates/index";
import tls from "tls";

export type MailerProps = {
  EMAIL_HOST: string;
  EMAIL_PORT: number;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
  EMAIL_FROM: string;
  EMAIL_FROM_NAME?: string;
  EMAIL_SECURE?: boolean;
  tls?: tls.ConnectionOptions | undefined;
};

export const initializeMailer = async ({
  EMAIL_FROM,
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_USER,
  EMAIL_FROM_NAME = "noreply",
  EMAIL_SECURE = true,
  tls,
}: MailerProps) => {
  return {
    transporter: nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_SECURE,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
        ...tls,
      },
    }),
    senderEmail: `'"${EMAIL_FROM_NAME}" <${EMAIL_FROM}>'`,
  };
};

export const sendEmail = async ({
  htmlTemplate,
  subject,
  toEmails,
  mailer,
}: {
  toEmails: string[];
  subject: string;
  htmlTemplate: string;
  mailer: MailerRepository;
}) => {
  const info = await mailer.transporter.sendMail({
    from: mailer.senderEmail,
    to: toEmails.join(","),
    subject,
    html: htmlTemplate,
  });

  console.log("Mensagem enviada: %s", info.messageId);
  console.log(
    "Link de Previsualização: %s",
    nodemailer.getTestMessageUrl(info)
  );
};
