import { APP } from "../../core/config/app";
import { CookiesInstance } from "../../core/config/cookies";
import { handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/types";
import { User } from "../models/User";
import {
  CreateTokenRepository,
  CreateUserRepository,
  DeleteByIdRepository,
  FindUserByEmailRepository,
} from "../repositories";
import { issueJWToken } from "../util/jwt";
import {
  loginWithGoogleValidation,
  LoginWithGoogleValidationParams,
} from "../validator/loginWithGoogle";
import { sanitizeUser } from "./utils/index";

type Params = {
  app: APP;
  data: LoginWithGoogleValidationParams;
  findUserByEmail: FindUserByEmailRepository;
  cookies?: CookiesInstance;
  deleteUserRefreshTokens: DeleteByIdRepository;
  createRefreshToken: CreateTokenRepository<"REFRESH_TOKEN">;
  createUserWithProvider: CreateUserRepository<LoginWithGoogleValidationParams>;
};

export const loginWithGoogleUseCase = async ({
  app,
  data,
  cookies,
  findUserByEmail,
  createRefreshToken,
  createUserWithProvider,
  deleteUserRefreshTokens,
}: Params): Promise<ApiResponse<{ user: User; token: string } | null>> => {
  try {
    const valData = loginWithGoogleValidation(data);

    const user = await findUserByEmail(valData.email);

    if (user?.isDeleted) {
      return handleErrors({
        error: new Error("user error"),
        messages: ["Usuário precisa ser reativado"],
      });
    }

    if (user && user.providerId === ["google", valData.sub].join("|")) {
      const { token } = await issueJWToken({
        app,
        createRefreshToken,
        deleteUserRefreshTokens,
        userId: user.id,
        userRole: user.role,
        cookies,
        generateRefreshToken: true,
      });

      return { data: { token, user: sanitizeUser(user) }, errors: null };
    }

    const newUser = await createUserWithProvider(valData);

    const { token } = await issueJWToken({
      app,
      createRefreshToken,
      deleteUserRefreshTokens,
      userId: newUser.id,
      cookies,
      generateRefreshToken: true,
    });

    return { data: { token, user: sanitizeUser(newUser) }, errors: null };
  } catch (error) {
    return handleErrors({
      error,
      messages: ["ocorreu um erro ao fazer o login com o google"],
    });
  }
};
