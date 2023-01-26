import ms from "ms";
import { handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/types";
import { APP } from "../../core/index";
import { asyncTryCatch, tryCatch } from "../../core/utils/try-catch";
import {
  EmailTemplate,
  MailerRepository,
  SendEmailRepository,
} from "../../email/repositories";
import { User } from "../models/User";
import {
  CreateTokenRepository,
  CreateUserRepository,
  FindUserByEmailRepository,
} from "../repositories";
import { hash } from "../util/hash";
import { signupValidation, SignupValidationParams } from "../validator/signup";

type ConfirmSignupEmailTemplate = EmailTemplate<{
  user: User;
  token: string;
}>;

type Params<SignupParams> = {
  data: SignupParams;
  mailer: MailerRepository;
  app: APP;
  findUserByEmail: FindUserByEmailRepository;
  createUser: CreateUserRepository<SignupParams>;
  createVerificationToken: CreateTokenRepository<"VERIFICATION_TOKEN">;
  sendEmail: SendEmailRepository;
  confirmationEmailTemplate: ConfirmSignupEmailTemplate;
};

export const signupUseCase = async <
  SignupParams extends SignupValidationParams
>({
  app,
  data,
  mailer,
  confirmationEmailTemplate,
  createUser,
  createVerificationToken,
  findUserByEmail,
  sendEmail,
}: Params<SignupParams>): Promise<ApiResponse<boolean | null>> => {
  const [validatedData, validationError] = await tryCatch(() =>
    signupValidation(data)
  );

  if (validationError || !validatedData) {
    console.error(validationError);
    return handleErrors({
      error: validationError,
      messages: ["Ocorreu um erro ao criar o usuário"],
    });
  }

  const [user, userError] = await asyncTryCatch(findUserByEmail(data.email));

  if (userError) {
    return handleErrors({
      error: userError,
      messages: ["Ocorreu um erro ao criar o usuário"],
    });
  }

  if (user) {
    if (user.isDeleted) {
      console.log("Usuário precisa ser recuperado");
      return handleErrors({
        error: new Error(),
        messages: ["Usuário precisa ser reativado"],
      });
    }

    if (user.emailVerified) {
      return handleErrors({
        error: new Error(),
        messages: ["Usuário já tem uma conta"],
      });
    }

    const { data, errors } = await sendConfirmationEmail({
      user,
      sendEmail: sendEmail,
      confirmationEmailTemplate,
      createVerificationToken,
      mailer,
    });

    if (!data) {
      return {
        data: null,
        errors,
      };
    }

    return {
      data: true,
      errors: null,
    };
  }

  const signupData = {
    ...data,
    password: await hash(data.password, app.HASH_SALT),
  };
  const [newUser, newUserError] = await asyncTryCatch(createUser(signupData));

  if (newUserError || !newUser) {
    return handleErrors({
      error: newUserError,
      messages: ["Ocorreu um erro ao criar o usuário"],
    });
  }

  const info = await sendConfirmationEmail({
    user: newUser,
    sendEmail: sendEmail,
    confirmationEmailTemplate,
    createVerificationToken,
    mailer,
  });

  if (!info.data) return { data: null, errors: info.errors };

  return {
    data: true,
    errors: null,
  };
};

//* Helper Functions

const sendConfirmationEmail = async ({
  createVerificationToken,
  confirmationEmailTemplate,
  sendEmail,
  user,
  mailer,
}: {
  user: User;
  createVerificationToken: CreateTokenRepository<"VERIFICATION_TOKEN">;
  sendEmail: SendEmailRepository;
  confirmationEmailTemplate: ConfirmSignupEmailTemplate;
  mailer: MailerRepository;
}): Promise<ApiResponse<string | null>> => {
  // TODO: delete verification token before creating a new one
  const [token, tokenError] = await asyncTryCatch(
    createVerificationToken({
      expiresAt: new Date(Date.now() + ms("1h")),
      type: "VERIFICATION_TOKEN",
      userId: user.id,
    })
  );

  if (tokenError || !token) {
    console.error(tokenError);
    return handleErrors({
      error: tokenError,
      messages: ["Ocorreu um erro ao criar o usuário"],
    });
  }

  const [, emailError] = await asyncTryCatch(
    (await sendEmail({
      mailer,
      toEmails: [user.email],
      subject: "Confirme seu cadastro",
      htmlTemplate: confirmationEmailTemplate({ user, token: token.token }),
    })) as unknown as Promise<any>
  );

  if (emailError) {
    return handleErrors({
      error: emailError,
      messages: ["Ocorreu um erro ao enviar o email de confirmação"],
    });
  }

  return {
    data: token.token,
    errors: null,
  };
};
