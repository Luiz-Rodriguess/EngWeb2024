# EngWeb2024 TPC3

## Website filmes

O objetivo deste trabalho prático é criar um website que utilize informações contidas em um ficheiro JSON

O primeiro passo a ser realizado é a formatação do dataset para o json-server. Para isso deve-se executar o script escrito em python que trata da formatação e cria entradas para os atores e géneros, estes possuem ids gerados automaticamente, estes ids tem a estrutura do $oid dos filmes

As páginas são criadas durante a execução, buscam a informação do json-server com o módulo axiose são escritas na página com o módulo http

As páginas possuem ligações que levam às outras páginas que são referidas, um exemplo seria que a página de um filme pode ter uma lista de atores e de géneros, que ao serem clicados levam para a página do respetivo ator ou género, esses que possuem informações sobre os filmes que estão relacionados
