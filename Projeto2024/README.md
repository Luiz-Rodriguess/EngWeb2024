# EngWeb2024 - Trabalho Prático

## Gerador de websites para UCs (Whiteboard)

### Equipa 11 - Code Craft

| **Número** | **Nome** |
|:----------:|:--------:|
| A100700 | Luiz Felipe Passanezi Matteussi Rodrigues |
| A98566 | Marco António Pereira Vieira |

## 1 Introdução

Neste relatório será descrito o projeto realizado no âmbito da unidade curricular Engenharia Web.

A plataforma desenvolvida conta com várias funcionalidades que um utilizador pode precisar durante a realização da UC.

Para a criação do projeto foi necessário primeiro definir quais seriam os objetivos principais, e aqueles que se fossem possíveis, devido ao limite de tempo, poderiam ser implementados.

## 2 Requisitos

+ Analisar e tratar os datasets disponíveis.
+ Criar uma interface web para navegar pelas informações.
+ Implementar todas operações de CRUD sobre uma UC.
+ Ter várias possibilidades de pesquisa sobre as UC criadas e ter uma interface centralizada para aceder ao site de cada uma.
+ Permitir que o utilizador que criou a UC edite a informação desta.

## 3 Funcionalidades Implementadas

Além dos requisitos definidos anteriormente também foram adicionadas algumas funcionalidades extras à plataforma, entre elas:

+ Um sistema que permite a troca de mensagens entre utilizadores.
+ Operações de CRUD de um utilizador.
+ Um calendário que mostra as datas e horários de cada UC de um utilizador.

## 3.1 Base de Dados

Para o armazenamento dos dados foi utilizado o mongoDB, com 3 coleções, sendo elas a coleção **uc**, a coleção **utilizadores** e por fim a coleção **mensagens**

*Nota:* Em uma primeira solução do projeto havia um ficheiro extra chamado *user-control.json* que continha as informações das contas dos utilizadores, e o seu acesso era feito com o axios o json-server, por fim decidimos juntar as informações todas na coleção dos utilizadores.

## 3.2 Models

### UC

Para as UCs decidimos utilizar alguns schemas auxiliares devido à estruturação, também foram separadas os horários das aulas teóricas e das práticas

#### ucSchema

|   Atributo    |  Tipo   |
|---------------|---------|
| _id           | String  |
| titulo        | String  |
| docentes      | [String]|
| hTeoricas     | [String]|
| hPraticas     | [String]|
| avaliacao     | [String]|
| datas         | datasSchema  |
| aulas         | [aulasSchema]|

#### aulasSchema

|   Atributo    |   Tipo   |
|---------------|----------|
| tipo          |  String  |
| data          |  String  |
| sumario       | [String] |
| aulaId        |  String  |

#### datasSchema

|   Atributo    |   Tipo   |
|---------------|----------|
| teste          |  String  |
| exame         |  String  |
| projeto        |  String  |

### Utilizadores

#### utilizadorSchema

| Atributo | Tipo |
|----------|------|
|_id| String|
|nome| String|
|foto| String|
|categoria| String|
|filiacao| String|
|email| String|
|webpage| String|
|ucs| [String]|
|type| String|
|pass| String|
|token| String|
|time| String|

### Mensagens

#### mensagemSchema

| Atributo | Tipo |
|----------|------|
|tipo | String |
|remetente | String |
|destinatario | [String] |
|data | String |
|conteudo | String |
|assunto | String |

Após termos os modelos definidos era necessário criar as funções que conectam a base de dados com a plataforma

## 3.3 Controllers

Existem ficheiros de controller para cada uma das coleções, em geral realizam operações de CRUD, com algumas outras funções criadas para algumas funcionalidades entre elas:

### UC

+ extraInfoUC(uc) - esta função é utilizada na página de cursos para adicionar o ano e a sigla da UC.

### Utilizadores

+ addUCToUtilizadores(ucID,userList) - utilizada para adicionar uma uc à lista de UCs de um utilizador.
+ removeUCFromUtilizadores(ucID,userList) - utilizada para remover uma uc à lista de UCs de um utilizador.
+ getIdsENomes() - utilizada para obter apenas os campos "_id" e "nome" de todos os utilizadores para serem colocados em uma lista.
+ templateUtilizador(body) - utilizada na criação de um novo utilizador, para obedecer o modelo de um utilizador.

### Mensagens

+ mensagensRecebidasUtilizador(id) - operação de *Retrieve* sobre mensagens enviadas para o utilizador com o id.
+ mensagensRecebidasGrupo(ids) - operação de *Retrieve* sobre mensagens enviadas para as UCs de um utilizador.
+ mesagensEnviadas(id) - operação de *Retrieve* sobre mensagens enviadas pelo utilizador com o id.

## 3.4 Rotas

No ficheiro *""/routes/index.js* temos todas as rotas da plataforma, algumas das rotas, e os pedidos HTTPs possíveis, são as seguintes:

+ /login - autenticação, GET e POST.
+ /registar - criação de uma nova conta para um utilizador, GET e POST.
+ /user - página que contém a informação de um utilizador, GET.
+ /user/edit - edição de um utilizador, GET e POST.
+ /user/delete/:id - página para deletar um utilizador, apenas acessível pelo admin, GET e POST.
+ /cursos - contém a lista de UCs de um utilizador - GET e POST(admin e produtor)
+ /curso/:cid - uma UC, GET.
+ /curso/(edit|delete)/:cid - página para (alterar | deletar) informação de uma UC, acessível por admins e por todos utilizadores contidos na lista de docentes de uma UC, GET(edit e delete) e POST(edit).
+ /calendario - contém o calendário com os horários das UCs de um utilizador, GET.
+ /mensagens - contém as mensagens recebidas e enviadas de um utilizador, GET.
+ /mensagens/new - página que permite o utilizador enviar uma nova mensagem, GET e POST.
+ /ferramentas - contém as ferramentas disponíveis para aquele utilizador, depende do seu tipo (admin,produtor,consumidor), GET e POST.

## 3.5 Autenticação

Para um utilizador se autenticar na plataforma, este deve indicar seu id e sua palavra-passe na página de login, ou deve criar uma nova conta. Caso alguma informação esteja incorreta o utilizador é informado deste erro. Uma vez autenticado, é atribuido um token ao utilizador, este token é verificado toda vez que o utilizador troca de página na plataforma, a validação do utilizador tem um limite de tempo de 1 hora, após este tempo o utilizador deve autenticar-se novamente.

## 3.6 Estilo

Para a aparência da plataforma. além de serem utilizadas os templates PUG para a criação do html, foi criado um ficheiro com regras CSS, sendo este o ficheiro *public/stylesheets/styles.css* foi feito desta forma para termos uma maior liberdade na aparência da plataforma.

## 3.7 fileStore

Na diretoria public também está presente a subdiretoria fileStore, é neste ficheiro que serão guardadas as imagens de perfil de cada utilizador e ficheiros temporários criados quando é desejado fazer download de uma informação da plataforma (UCs,mensagens ou utilizadores).

## 4 Execução do Projeto

Para que a plataforma funcione da forma desejada é necessário realizar alguns passos para prepará-la.

1. Na diretoria do projeto deve-se correr o seguinte comando para criar um container docker que vai conter a base de dados do projeto:

```bash
docker compose up -d
```

2. Após o comando ter finalizado de executar deve-se iniciar a plataforma:

```bash
cd app
npm i
npm start
```

Com essas duas etapas realizadas podemos aceder à plataforma, em um navegador deve-se aceder ao localhost na porta 5719.

Caso seja desejado remover o container pode-se executar o comando:

```bash
docker compose down
```

## 5 Conclusão e Trabalhos Futuros

Durante a criação do projeto houveram várias dificuldades, mas apesar disso acreditamos que conseguimos cumprir os requisitos pedidos e adicionamos algumas funcionalidades interessantes para o projeto.

Durante a execução não só do projeto mas da UC em si foi possível conhecer vários novos conceitos sobre a área do frontend (HTML, CSS, PUG, javascript, jQuery), e do backend (Docker, mongoDB). Acreditamos que em conjunto com a unidade curricular Interface Pessoa-Máquina, foi possível aprender várias formas de resolver problemas e de criar plataformas funcionais e visualmente agradáveis.

Visto que a área de desenvolvimento web é muito interressante e popular, acreditamos que um projeto deste tipo é necessário para um maior conhecimento sobre as ferramentas disponíveis.