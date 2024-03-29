import { APP } from "../../core/config/app";
import { handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/utils";
import { DeleteByIdRepository } from "../repositories";
import { CookiesInstance } from "../util/cookies";

export type LogoutUseCaseParams = {
  deleteTokenByToken: DeleteByIdRepository;
  cookiesInstance: CookiesInstance;
  app: APP;
};

export const logoutUseCase = async ({
  app,
  deleteTokenByToken,
  cookiesInstance: cookies,
}: LogoutUseCaseParams): Promise<ApiResponse<boolean | null>> => {
  const refreshToken = cookies.readCookie(app.REFRESH_TOKEN_COOKIE_NAME);

  if (!refreshToken)
    return handleErrors({
      error: new Error("no refresh token"),
      messages: ["refresh token inválido"],
    });

  try {
    await deleteTokenByToken(refreshToken);

    cookies.cleanCookie(app.ACCESS_TOKEN_COOKIE_NAME);
    cookies.cleanCookie(app.REFRESH_TOKEN_COOKIE_NAME);

    return { data: true, errors: null };
  } catch (err) {
    cookies.cleanCookie(app.ACCESS_TOKEN_COOKIE_NAME);
    cookies.cleanCookie(app.REFRESH_TOKEN_COOKIE_NAME);
    return {
      data: null,
      errors: ["ocorreu um erro ao terminar a sessão"],
    };
  }
};
