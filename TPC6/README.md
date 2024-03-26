# EngWeb2024 TPC6

## Website compositores com conexão ao mongoDB

O objetivo deste TPC é o mesmo dos dois TPCs anteriores porém deve-se utilizar conexões com o mongoDB e não com o json-server para extrair as informações.

Para mais simplicidade foi utilizado o express-generator para criar as diretorias novamente, porém com algumas alterações

``` bash
npx express-generator --view=pug app
```

Os datasets utilizados neste TPC foram obtidos à partir do anterior separando-os em compositores e períodos.

A lógica de roteamento e criação das páginas web seguem a mesma lógica do TPC5.

Na pasta **controllers** estão presentes as queries que realizam as operações de CRUD no sistema.

A pasata **models** possui o schema que as informações devem obedecer, tendo um para os compositores e um para os períodos.

O primeiro passo para que seja possível executar o programa é correr uma instância do mongoDB, para este TPC foi utilizado um container *Docker*.

``` bash
docker run -d -p 27017:27017 --name mongoEW mongo
docker start mongoEW
```

Deve-se copiar os ficheiros JSON para o mongoDB para isso copiamos os ficheiro para o container e depois importamos os ficheiros para o mongosh, foi criada a base de dados tpc6 e as coleções *comp* e *per*.

Os ficheiros estavam no formato jsonArray e foi alterado algumas informações, como o campo **id** passando para **_id** e a informação que o compositor possui sobre o período é o seu _id.

``` bash
docker cp "filename" mongoEW:/tmp
docker exec -it mongoEW bash
mongo import -d tpc6 -c comp /tmp/compositores.json --jsonArray
```

Para que fosse possível realizar a conexão com o mongoDB foi necessário alterar alguns ficheiros entre eles:

### app.js

É necessário utilizar o mongoose para realizar a conexão com a base de dados.

``` javascript
var mongoDB = 'mongodb://127.0.0.1:27017/tpc6';
mongoose.connect(mongoDB)
```

### index.js

O mongoDB armazena datas de uma forma que não era possível carregar na página de formulários para isso foi utilizada a biblioteca moment para alterar as datas.

``` bash
npm install moment
```

``` javascript
comp.dataNasc = moment(comp.dataNasc).format('YYYY-MM-DD')
comp.dataObito = moment(comp.dataObito).format('YYYY-MM-DD')
```

Finalmente podemos executar o programa que nos indica em qual porta do localhost está a atender os nosso pedidos.

``` bash
npm start app
```
