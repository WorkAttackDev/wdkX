import { sign, verify } from "jsonwebtoken";
import { APP } from "../../core/config/app";
import { CreateTokenRepository } from "../repositories";
import ms from "ms";
import { CookiesInstance } from "./cookies";
import { MsValue } from "../../core/utils/ms-utils";

export type DeleteExpiredTokens = (userId?: string) => Promise<void>;

type IssueJWTokenParams = {
  app: APP;
  generateRefreshToken?: boolean;
  userId: string;
  userRole?: string;
  cookies?: CookiesInstance;
  accessTokenExpiresIn?: MsValue;
  refreshTokenExpiresIn?: MsValue;
  deleteExpiredTokens: DeleteExpiredTokens;
  createRefreshToken: CreateTokenRepository<"REFRESH_TOKEN">;
};

const msToSec = (ms: number) => Math.round(ms / 1000);

export const issueJWToken = async ({
  app,
  userId,
  cookies,
  userRole,
  accessTokenExpiresIn = "60Minutes",
  refreshTokenExpiresIn = "60Days",
  generateRefreshToken = false,
  createRefreshToken,
  deleteExpiredTokens,
}: IssueJWTokenParams) => {
  const token = sign({ userRole }, app.API_SECRET, {
    expiresIn: accessTokenExpiresIn,
    subject: userId,
  });

  cookies?.writeCookie({
    maxAge: msToSec(Date.now() + ms(accessTokenExpiresIn)),
    value: token,
    name: app.ACCESS_TOKEN_COOKIE_NAME,
  });

  if (!generateRefreshToken) return { token, refreshToken: null };

  await deleteExpiredTokens(userId);

  const expiresAt = Date.now() + ms(refreshTokenExpiresIn);

  const refreshToken = await createRefreshToken({
    expiresAt: new Date(expiresAt),
    type: "REFRESH_TOKEN",
    userId: userId,
  });

  cookies &&
    cookies.writeCookie({
      maxAge: msToSec(expiresAt),
      value: refreshToken.token,
      name: app.REFRESH_TOKEN_COOKIE_NAME,
    });

  return {
    token,
    refreshToken: refreshToken,
  };
};

export const verifyJWToken = (app: APP, token: string) =>
  verify(token, app.API_SECRET);
