import { ERROR_CODE, handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/index";
import { asyncTryCatch } from "../../core/utils/try-catch";
import {
  DeleteTokenRepository,
  FindTokenRepository,
  UpdateEmailVerifiedByUserIdRepository,
} from "../repositories";

type Params = {
  token: string;
  findTokenByTokenRepository: FindTokenRepository;
  updateEmailVerifiedByUserIdRepository: UpdateEmailVerifiedByUserIdRepository;
  deleteTokenUsedTokensRepository: DeleteTokenRepository;
};

export const confirmSignupUseCase = async ({
  token,
  findTokenByTokenRepository,
  updateEmailVerifiedByUserIdRepository,
  deleteTokenUsedTokensRepository,
}: Params): Promise<ApiResponse<boolean | null>> => {
  if (!token || typeof token !== "string")
    return handleErrors({ error: new Error(), messages: ["Token invalido"] });

  const [repToken, tokenError] = await asyncTryCatch(
    findTokenByTokenRepository(token)
  );

  if (tokenError || !repToken)
    return handleErrors({
      error: new Error(),
      messages: ["erro ao validar o token"],
    });

  if (new Date(repToken.expiresAt).getTime() <= Date.now())
    return handleErrors({
      error: new Error(),
      messages: [ERROR_CODE.EXPIRED_TOKEN],
    });

  const [user, userError] = await asyncTryCatch(
    updateEmailVerifiedByUserIdRepository(repToken.userId)
  );

  if (userError || !user)
    return handleErrors({
      error: new Error(),
      messages: ["erro ao validar o token"],
    });

  // TODO: if fail to delete expired token, send email to admin
  await asyncTryCatch(deleteTokenUsedTokensRepository(token));

  return {
    data: true,
    errors: null,
  };
};
