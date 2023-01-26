import { initializeMailer, sendEmail } from "./index";

export type EmailTemplate<Params> = (params: Params) => string;

export type SendEmailRepository = typeof sendEmail;
export type MailerRepository = Awaited<ReturnType<typeof initializeMailer>>;
