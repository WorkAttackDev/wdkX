import { APP } from "../../core/index";
import { User } from "../../users/models/User";
import { baseEmailTemplate } from "./baseEmail";

export const forgotPasswordEmailTemplate = ({
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
  <p> Bem vindo ao ${app.NAME}</p>
  <p>
      Sr(a) ${user.name}, você solicitou a recuperação de sua password no ${app.NAME}.
      <br />
      <br />
      Clique no link abaixo para confirmar a recuperação da sua password.
  </p>

  <a href="${app.HOST}/forgot-password/${token}">
      Recuperar password
  </a>
  <br />
  <p> Se você não solicitou a recuperação da password no ${app.NAME}, ignore este e-mail.</p>
`,
  });
