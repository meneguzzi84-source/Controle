# Publicar o relatório privado

O relatório salva as cobranças no servidor. Por isso, ao abrir a mesma URL no computador ou no celular, você verá os mesmos dados.

## Render

1. Envie a pasta `IMAG` para um repositório no GitHub.
2. No Render, crie um **Web Service** usando esse repositório.
3. Configure o diretório raiz como `IMAG`.
4. Use `npm install` como comando de build e `npm start` como comando de início.
5. Em **Environment Variables**, crie:
   - `AUTH_USER`: seu nome de usuário.
   - `AUTH_PASSWORD`: uma senha longa e exclusiva.
   - `DATA_DIRECTORY`: `/var/data`.
6. Em **Disks**, adicione um disco persistente montado em `/var/data`.
7. Faça o deploy e acesse a URL fornecida pelo Render. O navegador pedirá seu usuário e senha antes de abrir o relatório.

Não envie `AUTH_USER` nem `AUTH_PASSWORD` para o GitHub. Eles devem existir somente nas variáveis de ambiente da plataforma de hospedagem.