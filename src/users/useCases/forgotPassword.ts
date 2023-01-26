import ms from "ms";
import { ERROR_CODE, handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/types";
import { DeleteManyByIdRepository } from "../../core/data/repositories";
import {
  EmailTemplate,
  MailerRepository,
  SendEmailRepository,
} from "../../email/repositories";
import { User } from "../models/User";
import {
  CreateTokenRepository,
  FindUserByEmailRepository,
} from "../repositories";
import {
  ForgotPasswordParams,
  forgotPasswordValidation,
} from "../validator/forgotPassword";

type Params = {
  data: ForgotPasswordParams;
  createForgotToken: CreateTokenRepository<"FORGET_TOKEN">;
  findUserByEmail: FindUserByEmailRepository;
  deleteManyForgetToken: DeleteManyByIdRepository;
  sendEmail: SendEmailRepository;
  forgotPasswordEmailTemplate: EmailTemplate<{ user: User; token: string }>;
  mailer: MailerRepository;
};

export const forgotPasswordUseCase = async ({
  data,
  mailer,
  findUserByEmail,
  createForgotToken,
  deleteManyForgetToken,
  sendEmail,
  forgotPasswordEmailTemplate,
}: Params): Promise<ApiResponse<string | null>> => {
  try {
    const { email } = forgotPasswordValidation(data);

    const user = await findUserByEmail(email);

    if (!user) {
      return handleErrors({
        error: new Error("user error"),
        messages: [ERROR_CODE.USER_NOT_EXIST],
      });
    }

    // if (user.providerId) {
    //   return handleErrors({
    //     error: new Error("provider error"),
    //     messages: ["usuário iniciou sessão com um provedor"],
    //   });
    // }

    await deleteManyForgetToken(user.id);

    const expiresAt = new Date(Date.now() + ms("1h"));

    const token = await createForgotToken({
      expiresAt,
      userId: user.id,
      type: "FORGET_TOKEN",
    });

    await sendEmail({
      mailer,
      toEmails: [user.email],
      subject: "Recuperação de Password",
      htmlTemplate: forgotPasswordEmailTemplate({
        token: token.token,
        user: user,
      }),
    });

    return { data: token.token, errors: null };
  } catch (error) {
    return handleErrors({
      error: error,
      messages: ["ocorreu um erro ao redefinir a password"],
    });
  }
};
