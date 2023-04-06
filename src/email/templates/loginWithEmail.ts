import { APP } from "../../core/index";
import { User } from "../../users/models/User";
import { baseEmailTemplate } from "./baseEmail";

export const loginWithEmailTemplate = ({
  app,
  confirmationLink,
  contactLink,
  user,
}: {
  user: User;
  confirmationLink: string;
  contactLink: string;
  app: APP;
}) =>
  baseEmailTemplate({
    app,
    htmlSlot: `
  <h1>Bem vindo ao ${app.NAME}</h1>
  <p> 
      Sr(a) ${user.name}, você solicitou um início de sessão na conta no ${app.NAME}.
      <br />
      <br />
      Clique no link abaixo para continuar o processo de início de sessão.
  </p>

  <a href="${confirmationLink}">
      Iniciar sessão
  </a>
  <br />
  <p> Se você não solicitou o início de sessão na conta no ${app.NAME}, clique no link abaixo para entrar em contato conosco.</p>
  <br />
    <b>Obs: Este link expira em 60 segundos.</b>
  <br />
  <a href="${contactLink}">
      Entrar em contato
  </a>
`,
  });
