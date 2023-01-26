import { APP } from "../../core/index";
import { User } from "../../users/models/User";
import { baseEmailTemplate } from "./baseEmail";

export const resetPasswordEmailTemplate = ({
  app,
  user,
}: {
  app: APP;
  user: User;
}) =>
  baseEmailTemplate({
    app,
    htmlSlot: `
    <p> Bem vindo ao ${app.NAME}</p>
    <p>
        Sr(a) ${user.name}, A sua password foi redefinida com sucesso.
        <br />
        Caso não tenha sido você, por favor, entre em contato com o para que possamos resolver o problema.
    </p>

    <br />
    <p>Em caso de dúvidas, entre em contato com o nosso suporte.</p>
`,
  });
