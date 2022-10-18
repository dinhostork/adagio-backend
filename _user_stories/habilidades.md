# Habilidades do Usuário

## História: 

Como um usuário autenticado eu quero adicionar e validar habilidades músicais ao
meu perfil para que outros usuários possam me convidar para cooperações e jam-sessions.

## Critérios de Aceitação:

* O usuário pode ver as habilidades que ele adicionou ao seu perfil;
* O usuário deve acrescentar um video para que a comunidade possa validar a habilidade;
* Outros usuários podem ver e enviar pontos de avaliação positivos e negativos;
* Os usuários podem comentar o video de validação da habilidade caso esteja liberado;
* O usuário que adicionou a habilidade deve permitir os comentários ou não.

## Considerações Técnias:
* Adicionar as novas tabelas no banco "abilities" e "comments" e "votes";
* Desenvolver o CRUD para as habilidades, comentários e votos;
* Adicionar a funcionalidade de permitir/não permitir comentários;
* Considerar habilidades validadas aquelas que possuírem mais votos positivos do que negativos;
* Separar na listagem as habilidades validadas e não validadas
