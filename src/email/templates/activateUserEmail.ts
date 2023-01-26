import { APP } from "../../core/index";
import { User } from "../../users/models/User";
import { baseEmailTemplate } from "./baseEmail";

export const activateUserEmailTemplate = ({
  app,
  token,
  user,
}: {
  user: User;
  token: string;
  app: APP;
}) =>
  baseEmailTemplate({
    app,
    htmlSlot: `
  <h1>Bem vindo ao ${app.NAME}</h1>
  <p> 
      Sr(a) ${user.name}, você solicitou a ativação de sua conta no ${app.NAME}.
      <br />
      <br />
      Clique no link abaixo para confirmar a ativa da sua conta.
  </p>

  <a href="${app.HOST}/activate-user/${token}">
      Ativar conta
  </a>
  <p> Se você não solicitou a ativação da conta no ${app.NAME}, ignore este e-mail.</p>
`,
  });
