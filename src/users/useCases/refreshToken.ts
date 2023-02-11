import { APP } from "../../core/config/app";
import { handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/types";
import {
  DeleteManyByIdRepository,
  FindByIdRepository,
} from "../../core/data/repositories";
import { MsValue } from "../../core/utils/ms-utils";
import { FullUser, User } from "../models/User";
import {
  CreateTokenRepository,
  DeleteTokenRepository,
  FindTokenRepository,
} from "../repositories";
import { CookiesInstance } from "../util/cookies";
import { issueJWToken } from "../util/jwt";
import { sanitizeUser } from "./utils/index";

export const refreshTokenUseCase = async <T>({
  app,
  cookies,
  accessTokenExpiresIn,
  refreshTokenExpiresIn,
  createRefreshToken,
  deleteTokenRepository,
  deleteUserRefreshTokens,
  findTokenByToken,
  findUserById,
}: {
  app: APP;
  findUserById: FindByIdRepository<FullUser>;
  findTokenByToken: FindTokenRepository;
  deleteTokenRepository: DeleteTokenRepository;
  deleteUserRefreshTokens: DeleteManyByIdRepository;
  createRefreshToken: CreateTokenRepository<"REFRESH_TOKEN">;
  cookies: CookiesInstance;
  accessTokenExpiresIn?: MsValue;
  refreshTokenExpiresIn?: MsValue;
}): Promise<ApiResponse<T | User | null>> => {
  const refreshToken = cookies.readCookie(app.REFRESH_TOKEN_COOKIE_NAME);

  if (!refreshToken)
    return {
      data: null,
      errors: ["refresh token inválido"],
      status: 400,
    };

  try {
    const rToken = await findTokenByToken(refreshToken);

    if (!rToken) {
      return {
        data: null,
        errors: ["token inválido"],
        status: 400,
      };
    }

    if (new Date(rToken.expiresAt).getTime() <= Date.now()) {
      return {
        data: null,
        errors: ["token expirado"],
        status: 400,
      };
    }

    await issueJWToken({
      app: app,
      userId: rToken.userId,
      userRole: rToken.owner?.role,
      generateRefreshToken: true,
      createRefreshToken,
      deleteUserRefreshTokens,
      cookies,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    });

    // TODO: refactor this
    await deleteTokenRepository(refreshToken);
    const user = rToken.owner || (await findUserById(rToken.userId));

    if (!user) {
      return handleErrors({
        error: new Error(),
        messages: ["Ocorreu um erro ao encontrar o usuário"],
      });
    }

    return { data: sanitizeUser(user), errors: null };
  } catch (error) {
    return handleErrors({
      error,
      messages: ["ocorreu um erro ao gerar o token"],
    });
  }
};
