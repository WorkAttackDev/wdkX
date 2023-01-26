import { ERROR_CODE, handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/types";
import { DeleteByIdRepository } from "../repositories";
import { logoutUseCase, LogoutUseCaseParams } from "./logout";

type Params = {
  userId: string;
  deleteUserById: DeleteByIdRepository;
} & LogoutUseCaseParams;

export const deleteUserUseCase = async ({
  userId,
  deleteUserById,
  app,
  deleteTokenByToken,
  cookiesInstance: cookies,
}: Params): Promise<ApiResponse<boolean | null>> => {
  if (!userId || typeof userId !== "string") {
    return handleErrors({
      error: new Error(ERROR_CODE.INVALID_ID),
      messages: [ERROR_CODE.INVALID_ID],
    });
  }

  try {
    await deleteUserById(userId);

    return await logoutUseCase({
      app,
      deleteTokenByToken,
      cookiesInstance: cookies,
    });
  } catch (error) {
    return handleErrors({
      error,
      messages: ["Ocorreu um erro ao deletar o usuário"],
    });
  }
};
