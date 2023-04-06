import { ZodError } from "zod";
import { ApiResponse } from "./utils";

export const handleErrors = ({
  error,
  messages,
}: {
  error: any;
  messages?: string[];
}): ApiResponse<null> => {
  !!process.env.WDK_LOG && console.log(JSON.stringify(error));

  if (error instanceof ZodError) {
    return {
      data: null,
      errors: error.errors?.map((err: any) => err.message),
    };
  }

  return {
    data: null,
    errors: messages || [error?.message || "Ocorreu um erro"],
  };
};

export const ERROR_CODE = {
  EXPIRED_TOKEN: "token expirado",
  USER_NOT_EXIST: "usuário não existe",
  USER_NOT_DELETED: "Usuário não foi apagado",
  INVALID_ID: "Identificador inválido",
};
