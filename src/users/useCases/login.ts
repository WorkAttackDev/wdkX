import { APP } from "../../core/config/app";
import { handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/types";
import { DeleteManyByIdRepository } from "../../core/data/repositories";
import { MsValue } from "../../core/utils/ms-utils";
import { User } from "../models/User";
import {
  CreateTokenRepository,
  FindUserByEmailRepository,
} from "../repositories";
import { CookiesInstance } from "../util/cookies";
import { compareHash } from "../util/hash";
import { DeleteExpiredTokens, issueJWToken } from "../util/jwt";
import { loginValidation } from "../validator/login";
import { sanitizeUser } from "./utils/index";

// Todo - add login e-mail notification
export const loginUseCase = async <UserType extends User>({
  app,
  data,
  cookiesInstance: cookies,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  findUserByEmail,
  createRefreshToken,
  deleteExpiredTokens,
}: {
  data: {
    email: string;
    password: string;
  };
  app: APP;
  findUserByEmail: FindUserByEmailRepository;
  createRefreshToken: CreateTokenRepository<"REFRESH_TOKEN">;
  deleteExpiredTokens: DeleteExpiredTokens;
  cookiesInstance?: CookiesInstance;
  accessTokenExpiresIn?: MsValue;
  refreshTokenExpiresIn?: MsValue;
}): Promise<ApiResponse<{ token: string; user: UserType } | null>> => {
  try {
    const { email, password } = loginValidation(data);

    const user = await findUserByEmail(email);

    if (!user || user.isDeleted) {
      return handleErrors({
        error: new Error(),
        messages: ["Usuário não encontrado"],
      });
    }

    if (!user.emailVerified) {
      return handleErrors({
        error: new Error(),
        messages: ["Usuário não verificado"],
      });
    }

    if (user.providerId) {
      return handleErrors({
        error: new Error(),
        messages: ["Usuário não pode fazer login, pois é um usuário externo"],
      });
    }

    const isValidPassword = await compareHash(password, user.password);

    if (!isValidPassword) {
      return handleErrors({
        error: new Error(),
        messages: ["password inválida"],
      });
    }
    const { token } = await issueJWToken({
      app: app,
      generateRefreshToken: true,
      userId: user.id,
      userRole: user.role,
      cookies,
      createRefreshToken,
      deleteExpiredTokens,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    });

    return {
      data: {
        token,
        user: sanitizeUser(user) as UserType,
      },
      errors: null,
    };
  } catch (error) {
    return handleErrors({
      error,
      messages: ["Ocorreu um erro ao fazer login"],
    });
  }
};
