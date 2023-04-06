import ms from "ms";
import { ERROR_CODE, handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/utils";
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
import { emailValidation } from "../validator/basics";

type Params = {
  data: {
    email: string;
  };
  mailer: MailerRepository;
  findUserByEmail: FindUserByEmailRepository;
  deleteManyActivationTokens: DeleteManyByIdRepository;
  createActivationToken: CreateTokenRepository<"ACTIVATION_TOKEN">;
  sendEmail: SendEmailRepository;
  activateUserEmailTemplate: EmailTemplate<{
    token: string;
    user: User;
  }>;
};

export const activateUserUseCase = async ({
  data,
  mailer,
  sendEmail,
  findUserByEmail,
  createActivationToken,
  deleteManyActivationTokens,
  activateUserEmailTemplate,
}: Params): Promise<ApiResponse<boolean | null>> => {
  try {
    const email = emailValidation(data.email);

    const user = await findUserByEmail(email);

    if (!user) {
      return handleErrors({
        error: new Error(ERROR_CODE.USER_NOT_EXIST),
        messages: ["Erro ao encontrar o usuário"],
      });
    }

    if (!user.isDeleted) {
      return handleErrors({
        error: new Error(ERROR_CODE.USER_NOT_DELETED),
        messages: ["Erro usuário não foi apagado"],
      });
    }

    await deleteManyActivationTokens(user.id);

    const token = await createActivationToken({
      expiresAt: new Date(Date.now() + ms("1h")),
      type: "ACTIVATION_TOKEN",
      userId: user.id,
    });

    await sendEmail({
      mailer,
      toEmails: [user.email],
      subject: "Confirmar de Ativação de Conta",
      htmlTemplate: activateUserEmailTemplate({
        user,
        token: token.token,
      }),
    });

    return { data: true, errors: null };
  } catch (error) {
    return handleErrors({ error, messages: ["Erro ao ativar o utilizador"] });
  }
};
