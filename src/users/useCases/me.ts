import { handleErrors } from "../../core/config/error";
import { ApiResponse } from "../../core/config/utils";
import { FindByIdRepository } from "../../core/data/repositories";
import { FullUser, User } from "../models/User";
import { sanitizeUser } from "./utils";

type Params = {
  userId: string;
  findUserById: FindByIdRepository<FullUser>;
};

export const meUseCase = async <U extends User>({
  userId,
  findUserById,
}: Params): Promise<ApiResponse<U | null>> => {
  try {
    const user = await findUserById(userId);

    if (!user || user.isDeleted) {
      return handleErrors({
        error: new Error("user error"),
        messages: ["usuário não existe"],
      });
    }

    return { data: sanitizeUser(user) as U, errors: null };
  } catch (error) {
    return handleErrors({
      error,
      messages: ["ocorreu um erro retornando os dados do usuário"],
    });
  }
};
