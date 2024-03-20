# EngWeb2024 TPC5

## Website compositores com express.js

O objetivo deste TPC é o mesmo do TPC4 porém deve-se utilizar o express.js para criar o site

Deve-se utilizar o express-generator para criar as diretorias e os ficheiros

``` bash
npx express-generator --view=pug app
```

Foi utilizado o dataset já estruturado do TPC anterior, por isso não possui um script

Na pasta **routes** existe o ficheiro *index.js* que possui a lógica de roteamento do website, para a criação das páginas HTML foi utilizado os ficheiro *.pug* para descrever a sua aparência

Na pasta **controllers** estão os ficheiros que cuidam das operações de **CRUD** para os compositores e para os períodos

Para iniciar a execução do website:

``` bash
json-server -p 3000 dataset.json
```

Em outro terminal na pasta app:

``` bash
npm start
```

Finalmente deve-se acessar o localhost na porta 4202
