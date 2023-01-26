import { ERROR_CODE, handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/types";
import { asyncTryCatch } from "../../core/utils/try-catch";
import { FindTokenRepository, UpdateUserRepository } from "../repositories";

type Params = {
  token: string;
  findActivationToken: FindTokenRepository;
  updateUserDeletedState: UpdateUserRepository;
};

export const confirmActivateUserUseCase = async ({
  token,
  findActivationToken,
  updateUserDeletedState,
}: Params): Promise<ApiResponse<boolean | null>> => {
  if (!token || typeof token !== "string") {
    return handleErrors({
      error: new Error("token error"),
      messages: ["Token invalido"],
    });
  }

  const [dbToken, tokenError] = await asyncTryCatch(findActivationToken(token));

  if (tokenError || !dbToken) {
    return handleErrors({
      error: tokenError,
      messages: ["erro ao validar o token"],
    });
  }

  if (new Date(dbToken.expiresAt).getTime() <= Date.now()) {
    return handleErrors({
      error: new Error("expiration error"),
      messages: [ERROR_CODE.EXPIRED_TOKEN],
    });
  }

  const [user, userError] = await asyncTryCatch(
    updateUserDeletedState({ userId: dbToken.userId })
  );

  if (userError || !user) {
    return handleErrors({
      error: userError,
      messages: ["erro ao validar o token"],
    });
  }

  return { data: true, errors: null };
};
