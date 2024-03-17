# EngWeb2024 TPC4

## Website compositores

Assim como no último TPC o objetivo deste é criar um website que retire as informações de um ficheiro **JSON** que será acessado com o axios e o *json-server*

A primeira etapa é adicionar as informações para a página de períodos, para isso utiliza-se o ficheiro *script.py*, é executado uma vez antes do programa principal

O *server.js* é onde a lógica de conexão está definida, analisando os caminhos que são acessados, para criar páginas em **HTML** foi utilizado o *templates.js* que retorna a estrutura que as páginas terão

Para este TPC era necessário que o servidor pudesse realizar as operações de **CRUD** para os compositores e para os períodos, elas estão todas funcionais e a alteração de um registo implica a alteração de todos os outros que estão relacionados com esse

Como era necessário criar pelo menos 5 novas entradas para o dataset utilizando o serviço, foi criado um script auxiliar chamado *idGen.py* este apenas gera novos IDs que não estão presentes no ficheiro dataset.json
