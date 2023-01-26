import { APP } from "../../core/index";
import { User } from "../../users/models/User";
import { baseEmailTemplate } from "./baseEmail";

export const confirmSignupEmailTemplate = ({
  token,
  user,
  app,
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
        Parabéns ${user.name}, você acaba de se cadastrar no ${app.NAME}.
        <br />
        <br />
        Clique no link abaixo para confirmar seu cadastro.
    </p>

    <a href="${app.HOST}/signup/${token}">
        Confirmar cadastro
    </a>

    <p> Se você não se cadastrou no ${app.NAME}, ignore este e-mail.</p>
`,
  });
