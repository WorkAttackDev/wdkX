import ms from "ms";
import { z } from "zod";
import { DeleteManyByIdRepository } from "../../core";
import { APP } from "../../core/config/app";
import { handleErrors } from "../../core/config/error";
import { ApiResponse, isApiResponse } from "../../core/config/utils";
import {
  MailerRepository,
  SendEmailRepository,
} from "../../email/repositories";
import { loginWithEmailTemplate } from "../../email/templates/loginWithEmail";
import { User } from "../models/User";
import {
  CreateTokenRepository,
  FindUserByEmailRepository,
} from "../repositories";
import { validationErrorMessages } from "../validator";

const loginWithEmailSchema = z.object({
  email: z
    .string({
      required_error: validationErrorMessages.required("e-mail"),
      invalid_type_error: validationErrorMessages.invalidType(
        "e-mail",
        "string"
      ),
    })
    .email(validationErrorMessages.email)
    .max(200, validationErrorMessages.max("e-mail", 200))
    .min(3, validationErrorMessages.min("e-mail", 3)),
});

export type LoginWithEmailSchemaType = z.infer<typeof loginWithEmailSchema>;

type LoginWithEmailUseCaseParams = {
  app: APP;
  data: LoginWithEmailSchemaType;
  mailer: MailerRepository;
  sendEmail: SendEmailRepository;
  contactLink: (userId: string) => string;
  findUserByEmail: FindUserByEmailRepository;
  confirmationLink: (token: string) => string;
  createActivationToken: CreateTokenRepository<"ACTIVATION_TOKEN">;
  deleteActivationTokens: DeleteManyByIdRepository;
};

export const loginWithEmailUseCase = async ({
  app,
  data,
  mailer,
  sendEmail,
  contactLink,
  findUserByEmail,
  confirmationLink,
  createActivationToken,
  deleteActivationTokens,
}: LoginWithEmailUseCaseParams): Promise<
  ApiResponse<{ token: string } | null>
> => {
  try {
    const schema = loginWithEmailSchema.safeParse(data);

    if (!schema.success) {
      return handleErrors({
        error: schema.error,
        messages: ["Ocorreu um erro ao fazer login"],
      });
    }

    const { email } = schema.data;

    const user = await findUserByEmail(email).catch((error) => {
      return handleErrors({
        error,
        messages: ["Error getting user by email"],
      });
    });

    if (isApiResponse<null>(user)) return user;
    if (!user)
      return handleErrors({
        error: new Error("User not found"),
        messages: ["Usuário não encontrado"],
      });

    if (user.isDeleted)
      return handleErrors({
        error: new Error("User is deleted"),
        messages: ["Usuário não encontrado"],
      });

    await deleteActivationTokens(user.id);

    const token = await createActivationToken({
      expiresAt: new Date(Date.now() + ms("60s")),
      type: "ACTIVATION_TOKEN",
      userId: user.id,
    });

    await sendEmail({
      mailer,
      toEmails: [user.email],
      subject: "Confirmar de Ativação de Conta",
      htmlTemplate: loginWithEmailTemplate({
        user,
        app,
        confirmationLink: confirmationLink(token.type),
        contactLink: contactLink(user.id),
      }),
    }).catch(async (error) => {
      await deleteActivationTokens(user.id);
      throw error;
    });

    return {
      data: {
        token: token.token,
      },
      errors: null,
    };
  } catch (error) {
    return handleErrors({
      error,
      messages: ["Ocorreu um erro ao fazer login com e-mail"],
    });
  }
};
