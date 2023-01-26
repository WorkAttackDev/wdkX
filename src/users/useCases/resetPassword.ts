import { ERROR_CODE, handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/types";
import {
  EmailTemplate,
  MailerRepository,
  SendEmailRepository,
} from "../../email/repositories";
import { Token } from "../models/Token";
import { User } from "../models/User";
import {
  DeleteTokenRepository,
  FindTokenRepository,
  UpdateUserPasswordRepository,
} from "../repositories";
import { hash } from "../util/hash";
import {
  ResetPasswordParams,
  resetPasswordValidate,
} from "../validator/resetPassword";

type Params<T> = {
  data: ResetPasswordParams;
  findResetToken: FindTokenRepository<Token>;
  deleteResetToken: DeleteTokenRepository;
  updateUserPassword: UpdateUserPasswordRepository<T>;
  sendEmail: SendEmailRepository;
  resetPasswordEmailTemplate: EmailTemplate<{ user: User }>;
  mailer: MailerRepository;
};

export const resetPasswordUseCase = async <T>({
  data,
  mailer,
  sendEmail,
  resetPasswordEmailTemplate,
  findResetToken,
  deleteResetToken,
  updateUserPassword,
}: Params<T>): Promise<ApiResponse<boolean | null>> => {
  try {
    const { password, token: reqToken } = resetPasswordValidate(data);

    const token = await findResetToken(reqToken);

    if (!token || !token.owner) {
      return handleErrors({
        error: new Error("token error or token owner not found"),
        messages: ["token do usuário não encontrado"],
      });
    }

    if (new Date(token.expiresAt).getTime() <= Date.now()) {
      await deleteResetToken(reqToken);
      return handleErrors({
        error: new Error(),
        messages: [ERROR_CODE.EXPIRED_TOKEN],
      });
    }

    await updateUserPassword({
      hashedPassword: await hash(password),
      userId: token.userId,
    });

    await deleteResetToken(reqToken);

    await sendEmail({
      mailer,
      toEmails: [token.owner.email],
      subject: "A sua password foi redefinida",
      htmlTemplate: resetPasswordEmailTemplate({ user: token.owner }),
    });

    return { data: true, errors: null };
  } catch (error) {
    return handleErrors({
      error,
      messages: ["ocorreu um erro ao redefinir a password"],
    });
  }
};
