# Conversor de Moedas
## Desafio Egenharia Grupo SBF

Neste repositório está uma resposta ao desafio para a vaga para o time de Engenharia do Grupo SBF.

O problema consiste em disponibilizar uma API que recebe um valor de um produto em BRL e responde com
o valor convertido para algumas moedas pré-definidas. [Mais detalhes do desafio aqui](https://communication-assets.gupy.io/production/companies/35479/emails/1692903205654/1440c760-5c42-11ed-8207-e9de66010804/desafio.pdf).

A linguagem escolhida para a implementação da resposta foi o Typescript com a utilização do framework NodeJS.

## Como utilizar a API
#### Pré-requisitos
Você precisará do [Docker](https://www.docker.com/) instalado e configurado na sua máquina.
Certifique-se de que o comando `docker-compose` pode ser executado.

#### Subindo a API
Para levantar a API e os serviços utilizados por ela localmente, utilize o seguinte comando:
```
docker-compose up
```
Caso deseje reinicar os serviços e observar suas alterações de infraestrutura, utilize
```
docker-compose up --build --force-recreate
```
Caso tenha dúvidas se as imagens estão sendo criadas, execute:
```
docker images
```
e espere encontrar uma imagem nomeada `pedromihael/currencies-converter-api`.

Aguarde ver a mensagem `info: Currency Converter API is running on port 3000!` para utilizar a API.

#### Rodando os testes
Você precisará do [Yarn](https://yarnpkg.com/) ou [NodeJS](https://nodejs.org/en) instalados para executar os testes.
Estes podem ser executados com o comando:
```
yarn test
```
ou
```
npm run test
```

Os testes comportam as possibilidades de execução dos casos de uso da API, integrando roteamento, controle, banco, adaptadores e fachadas, organizados por caso de uso.

#### Endpoints
| HTTP Verbs | Endpoints | Descrição |
| --- | --- | --- |
| GET | /health-check | Retorna uma resposta em texto quando a API está funcionando |
| GET | /api/list-currencies | Lista todas as moedas cadastradas em banco |
| POST | /api/converter | Converte um valor em uma moeda como BRL para todos os outros salvos em banco |
| POST | /api/create-currency | Cadastra uma nova moeda no banco |
| PUT | /api/update-currency | Atualiza uma moeda presente no banco |

#### Swagger
Mais detalhes sobre os endpoints, seus inputs e outputs, podem ser encontrados acessando a rota `/api-docs` desta mesma API.

### Tecnologias utilizadas
* [NodeJS](https://nodejs.org/) Este é um ambiente de execução de plataforma cruzada construído no mecanismo JavaScript V8 do Chrome, usado na execução de códigos JavaScript no servidor. Permite instalação e gerenciamento de dependências e comunicação com bancos de dados.

* [ExpressJS](https://www.expresjs.org/) Um framework que auxilia a criação de um servidor TCP/IP em NodeJS.

* [MongoDB](https://www.mongodb.com/) Um banco de dados NoSQL de fácil instalação, manutenção, de alta disponibilidade e escalabilidade.

* [Redis](https://redis.io/) Um banco de dados chave-valor, utilizado como serviço de cache, que utiliza o armazenamento interno de seu host para armazenar valores constantemente utilizados e implementar outras estratégias que demandem uma resposta mais rápida do que uma query no banco de dados. 

### Serviços de conversão utilizados
* [Exchange Rates API](https://exchangeratesapi.io/) API de conversão de câmbios baseado numa moeda pré-definida.

* [Fixer IO](https://fixer.io/) API de conversão de câmbios baseado em EURO.

### Logs
A biblioteca [Winston](https://github.com/winstonjs/winston) está sendo utilizada para gerar os logs da aplicação. Dois transportadores diferentes são utilizados: `consoleLogger` para imprimir logs no console e `fileLogger` para escrever os mesmos num arquivo. Os logs possuem níveis de criticidade, vide biblioteca. O arquivo que contém os logs é este: `src/shared/logs/out/api-logs.log`.

### Deployment - Continuos Integration & Continuos Delivery
A pipeline de CI/CD está sendo executada no Github Actions e é criada e alterada através do arquivo `.github/workflows/build-deploy.yaml`. São duas etapas: o build e publicação da imagem da API no dockerhub e a implantação da mesma no GKE, serviço de Kubernetes da GCP. Os serviços MongoDB e Redis foram implantados manualmente no cluster através do framework (Helm)[https://helm.sh]. Para inserir novos serviços no cluster, considere a utilização do mesmo.

Para realizar um deploy, altere os arquivos `k8s/deploy.yaml` e `IMAGE_VERSION` para que ambos possuam uma mesma versão da imagem nova a ser gerada.

Faça um `commit` na branch `main` e aguarde a action ser finalizada.

## Implementação

A implementação desta API baseia-se no padrão arquitetural [Layered](https://www.oreilly.com/library/view/software-architecture-patterns/9781491971437/ch01.html), com modificações baseadas no estilo arquitetural [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html), um estilo baseado em conceitos de dois padrões catalogados: [Arquitetura Hexagonal (Ports & Adapters)](https://engsoftmoderna.info/artigos/arquitetura-hexagonal.html#:~:text=Uma%20Arquitetura%20Hexagonal%20divide%20as,tais%20como%20bancos%20de%20dados) e [Onion Architecture](https://www.codeguru.com/csharp/understanding-onion-architecture/). A intenção é comportar o design pattern Repository, responsável por inverter a dependência dos casos de uso para com o banco utilizado através da injeção do repositório referente ao banco utilizado no caso de uso em questão. Dessa forma, os testes de integração envolvendo estes casos de uso também são possíveis, através da utilização de um repositório referente a um banco de dados falso, um [mock](https://pt.wikipedia.org/wiki/Objeto_mock#:~:text=Objetos%20mock%2C%20objetos%20simulados%20ou,o%20comportamento%20de%20outros%20objetos.). Falaremos sobre as decisões arquiteturais na seção a seguir.

#### Decisões arquiteturais
Mesmo por se tratar de um teste, um software deve sempre ser desenvolvido prezando pela manutenibilidade do mesmo, quando possível. Devido ao problema que foi dado para ser resolvido, a modelagem de uma solução para este tende a se resumir em algo em que o fluxo de dados seja bidirecional: um cliente envia um valor, o mesmo é processado e então retornado para a origem. Então, baseado nessas duas premissas, manutenibilidade e processamento de dados sem estado, a Clean Architecture foi escolhida como arquitetura de referência. Essa escolha beneficia o isolamento de partes do sistema em camada (Single Responsibility Principle), possibilitando a testabilidade das partes, diminuindo o acoplamento e aumentando a coesão das classes.

Por outro ponto de vista, o problema propunha algo que serviços de conversão de moedas já fazem. No entanto, por se tratar de um serviço a ser utilizado pelas aplicações do Grupo SBF, certos fatores deveriam ser considerados como essenciais para satisfazer tais cliente: disponibilidade e escalabilidade. Depender de apenas um único serviço pronto disponível na internet não é uma opção viável, devido ao número de requisições a serem feitas mensalmente e o controle nulo de sua disponibilidade. Portanto, uma primeira estratégia foi implementada: a adoção do rodízio de serviços consumidos pela a API, sem que os clientes e o core da aplicação necessariamente saibam dessa lógica. O rodízio consistia em selecionar aleatoriamente o serviço a ser utilizado para cada requisição de câmbio, serviços estes adaptados através da implementação de uma interface única (Open-close principle) e consumidos por uma fachada, onde a lógica do rodízio acontecia, disponibilizando o resultado através da chamada de uma única função. Desta forma, o caso de uso se encarrega unicamente de receber o valor a ser convertido e aguardar a resposta vinda da fachada. 

Essa primeira estratégia resolve o problema para cenários onde a API será consumida por poucos clientes, recebendo poucas requisições mensais. Numericamente falando, o limite de conversões mensais que esta solução comporta é a soma dos limites de requisição dos serviços utilizados. Através da interface a ser implementada pelos serviços, a injeção de novos adaptadores de serviço dentro da fachada é facilitada, impactando positivamente na manutenibilidade do software.

No entanto, trata-se do Grupo SBF: em determinadas épocas do ano, o limite mensal de requisições poderia ser atingido em menos de uma hora. Devido a preocupação com este cenário, a estratégia foi incrementada: um serviço de cache foi implementado para que as requisições consumissem dados salvos em memória, expirados a cada uma hora. Dessa forma, é assegurado que apenas 1 requisição seja feita por hora aos serviços de conversão utilizados, satisfazendo o requisito de disponibilidade anteriormente citado, e ganhando também a satisfação de mais uma característica do [Teorema CAP](https://dev.to/oieduardorabelo/arquitetura-de-software-o-teorema-cap-3m18), a consistência de dados. 

#### Fluxo de dados
Sendo assim, a API trata o caso de uso de requisição de conversão de moedas da seguinte forma:

1. Um cliente, seja frontend, mobile ou outro backend, envia uma requisição `POST /api/converter` contendo o valor a ser convertido. 
2. A rota em questão instancia a classe controller responsável por tratar este caso de uso, a qual faz a injeção tanto a fachada quanto os adaptadores de serviço e o repositório do banco a ser utilizado. 
3. A este ponto, o corpo da requisição já chegou no caso de uso, a penúltima camada do estilo arquitetural. O caso de uso em questão faz a verificação da presença e dos tipos de dados recebidos, e então verifica se existem dados válidos armazenados no cache, através de um adaptador para este serviço. Se houver, as taxas de conversão armazenadas em cache são retornadas do serviço ao adaptador e então as conversões são feitas e retornadas ao use case. 
4. Então, o caso de uso retorna a resposta ao controller, que retorna a resposta a rota, expondo-a a origem da requisição. 

#### Comentários adicionais sobre o fluxo de dados
1. Caso o campo `baseCurrency` não seja informado, o valor será considerado em BRL - Reais.

2. Como comentado, a injeção acontece por dois motivos: a inversão de dependências e, principalmente, a hierarquia de informação pregada pelo estilo arquitetural definido. Fachadas, adaptadores e repositórios são gateways que ligam dados externos ao core da aplicação, portanto estão acima dos casos de uso e abaixo das interfaces com o mundo exterior.

3. Caso uma única taxa de conversão esteja desatualizada, o caso de uso aciona o primeiro serviço e, em caso de falha, aciona o segundo. O rodízio foi removido com a implementação do cache, mas as estratégias podem ser combinadas. A decisão de remoção da primeira se dá pela complexidade trazida, e que poderia ser evitada. Ao obter as taxas de conversão atualizadas, o cache também é atualizado. As conversões são feitas para as moedas registradas em banco e com propriedate `active` = `true`. Caso não haja nenhuma registrada, as conversões são feitas para USD, EUR e INR.

4. Todas as respostas dos casos de uso têm a mesma estrutura: `status`, um numeral referente ao HTTP Status Code resultante da requisição; e `response`, o objeto de resposta resultante da execução do caso de uso. Os erros e exceções são tratados nos adaptadores e casos de uso, removendo essa responsabilidade dos controladores.

### Para ajudar com manutenções futuras

#### Como criar um novo endpoint
Para criar um novo endpoint, é indicado que o arquivo de testes para esse caso de uso seja escrito antes mesmo do restante do código, para que a implementação do mesmo não faça mais do que deve, nem menos do que precisa.

Caso prefira deixar os testes para depois, comece a criar o endpoint pelas últimas camadas: entidades e caso de uso.

1. Crie as entidades necessárias na camada `entities`;
2. Crie o caso de uso na camada `usecases`;
3. Crie os adaptadores necessários e/ou os métodos do repositório a serem utilizados na camada `interface-adapters`. Lembre-se de declarar a assinatura dos métodos primeiro nas interfaces a qual os gateways se extendem, e caso haja um mock, implemente também na classe mock relacionada.
4. Crie o arquivo controlador e declare a rota utilizada também na camada `interface-adapters`;
5. Caso algum serviço novo esteja sendo acrescentado ao software, implemente sua utilização na camada `externals`, para que o adaptador relacionado ao mesmo possa o consumir.

#### Como utilizar outro SGBD a.k.a. trocar o banco
Caso algum endpoint necessite de uma outra fonte de dados ou mesmo o banco principal necessite ser migrado, considere a interface `IRepository` como um guia para implementar o repositório do banco novo. Assegure-se de que os tipos de retorno são os mesmos da interface. Por fim, registre um singleton no arquivo `src/external/infra/injection-containers/registry.ts` para que seja utilizado através de todo o software.

#### Como adicionar novos serviços de conversão
Seguindo a ideia do tópico passado, utilize o arquivo `src/interface-adapters/gateways/adapters/conversion-services-adapter.interface.ts` como modelo a ser seguido para implementar um novo adaptador para um serviço de conversão. Implemente as requisiçoes HTTP a ele na camada `externals` e utilize o adaptador como concentrador da lógica de processamento de dados pelo mesmo.

#### Como alterar tempo de validade do cache
Utilize o arquivo `src/external/services/redis/helpers/index.ts` para entender como o cache é invalidado. Nele, observe o cálculo que é feito e altere para o tempo limite de validade que desejar.

#### Como adicionar novos testes de integração
Caso não sejam testes unitários de serviço, considere que os testes são independentes do servidor e não necessitam da API estar de pé para serem executados. Portanto, caso vá simular o uso de uma base de dados ou um serviço de conversão, crie um mock para tal e injete no caso de uso.

### License
Este projeto está disponível para uso sob a licença MIT.
