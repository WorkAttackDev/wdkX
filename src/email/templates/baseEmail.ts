import { APP } from "../../core/index";

export const baseEmailTemplate = ({
  htmlSlot,
  app,
}: {
  htmlSlot: string;
  app: APP;
}): string => {
  return `
  <!DOCTYPE html>
  <html lang="pt">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      
      <style>
        * {
          box-sizing: border-box;
        }
  
        body {
          margin: 0;
          padding: 40px 20px;
          color: #1e252b;
          font-family: 'Lucida Sans Regular', 'Lucida Grande',
            'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
        }
      </style>
    </head>
    <body>
        ${htmlSlot}

      <br /> 
      <p>
        Atenciosamente, 
        <br /> 
        Equipe ${app.NAME} 
        <br /> 
        <a href="${app.HOST}">${app.HOST}</a>
      </p>
    </body>
  </html>
  `;
};
