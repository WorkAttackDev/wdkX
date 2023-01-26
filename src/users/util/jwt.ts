import { sign, verify } from "jsonwebtoken";
import { APP } from "../../core/config/app";
import { CreateTokenRepository, DeleteByIdRepository } from "../repositories";
import ms from "ms";
import { CookiesInstance } from "./cookies";

type IssueJWTokenParams = {
  app: APP;
  generateRefreshToken?: boolean;
  userId: string;
  userRole?: string;
  cookies?: CookiesInstance;
  deleteUserRefreshTokens: DeleteByIdRepository;
  createRefreshToken: CreateTokenRepository<"REFRESH_TOKEN">;
};

export const issueJWToken = async ({
  app,
  generateRefreshToken = false,
  userId,
  userRole,
  createRefreshToken,
  deleteUserRefreshTokens,
  cookies,
}: IssueJWTokenParams) => {
  const token = sign({ userRole }, app.API_SECRET, {
    expiresIn: "15Min",
    subject: userId,
  });

  cookies?.writeCookie({
    maxAge: ms("15Min"),
    value: token,
    name: app.ACCESS_TOKEN_COOKIE_NAME,
  });

  if (!generateRefreshToken) return { token, refreshToken: null };

  await deleteUserRefreshTokens(userId);

  const expiresAt = Date.now() + ms("60Days");

  const refetchToken = await createRefreshToken({
    expiresAt: new Date(expiresAt),
    type: "REFRESH_TOKEN",
    userId: userId,
  });

  cookies &&
    cookies.writeCookie({
      maxAge: ms("60Days"),
      value: refetchToken.token,
      name: app.REFRESH_TOKEN_COOKIE_NAME,
    });

  return {
    token,
    refreshToken: refetchToken,
  };
};

export const verifyJWToken = (app: APP, token: string) =>
  verify(token, app.API_SECRET);
