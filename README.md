##### 🖥️ FrontEnd
# 💡 Lúmen – Gerenciador Financeiro

O **Lúmen** é uma aplicação de gerenciamento financeiro desenvolvida para facilitar o controle de receitas, despesas e planejamento financeiro pessoal.

Com o Lúmen, você pode:
- Criar contas e organizá-las por **categorias personalizadas**;
- Atribuir **ícones e cores** às categorias;
- Adicionar **receitas e despesas** de forma rápida e intuitiva;
- **Agendar lançamentos** futuros para manter suas finanças sempre em dia.

---

## 🚀 Deploy
🔗 Acesse a aplicação: [squad25.fourdevs.com.br](https://squad25.fourdevs.com.br) 

## 📡 Api
🔗 Acesse o repositório: [Acessar](https://github.com/wilkenio/squad25_backend.git) 

---

## 🧠 Equipe Lúmen

| Função         | Nome               | GitHub                                   |
|----------------|--------------------|-------------------------------------------|
| 💻 Front-end   | Yuri           | [@Mistergx123](https://github.com/Mistergx123)    |
| 💻 Front-end   | Wesley           | [@wsleyvarejao87](https://github.com/wsleyvarejao87)    |
| ⚙️ Back-end    | Cleybson           | [@cleybson7](https://github.com/cleybson7)    |
| ⚙️ Back-end    | Denis           | [@dsilvand](https://github.com/dsilvand)    |
| 🧭 Gestão      | Anne         | [@Anne-Beatriz](https://github.com/Anne-Beatriz)|
| 🧭 Gestão e 🎨 Design    |  Álvaro      | [@4lvarofagundes](https://github.com/4lvarofagundes)|
| 👨‍💻 Tech Lead      | Wilkenio          | [@Wilkenio](https://github.com/wilkenio)    |

---

## 🚀 Tecnologias
🔗 Acesse o repositório: [Acessar](https://github.com/wilkenio/squad25_backend.git) 

---

## 📝 Requisitos

Antes de executar o projeto, você precisa ter os seguintes itens instalados na sua máquina:

- **Node.js** (versão 14 ou superior) - [Node.js](https://nodejs.org)
- **npm** (gerenciador de pacotes do Node.js) - geralmente é instalado junto com o Node.js
- **Angular CLI** (Command Line Interface) - [Angular CLI](https://angular.io/cli)  
  Para instalar o Angular CLI globalmente, execute o seguinte comando no terminal:

  ```bash
  npm install -g @angular/cli

## ❓ Como executar o Projeto?

- **Clonar Repositório** 
    ```bash
   git clone https://github.com/wilkenio/squad25_frontend.git

- **Entrar na Paste do Projeto** 
   ```bash
   cd squad25_frontend

- **Instalar Dependências** 
   ```bash
   npm install
   
- **Iniciar** (Provável Link Gerado: localhost:4200/)
   ```bash
   ng serve

---



## 🗂️ Arquitetura do FrontEnd
<details>
<summary>🖥️ Principais Diretórios</summary>

<pre>
<code>
📦public
 ┣ 📜favicon.ico
 ┣ 📜gif - lumen.gif
 ┣ 📜icon - Lumen.ico
 ┣ 📜logo - Lumen.png
 ┗ 📜logo-branca-
📦src
 ┣ 📂app
 ┃ ┣ 📂components
 ┃ ┃ ┣ 📂dashboard
 ┃ ┃ ┃ ┣ 📂despesas
 ┃ ┃ ┃ ┃ ┣ 📜despesas.component.css
 ┃ ┃ ┃ ┃ ┣ 📜despesas.component.html
 ┃ ┃ ┃ ┃ ┗ 📜despesas.component.ts
 ┃ ┃ ┃ ┣ 📂despesaspor-categoria
 ┃ ┃ ┃ ┃ ┣ 📜despesaspor-categoria.component.css
 ┃ ┃ ┃ ┃ ┣ 📜despesaspor-categoria.component.html
 ┃ ┃ ┃ ┃ ┗ 📜despesaspor-categoria.component.ts
 ┃ ┃ ┃ ┣ 📂evolucao-do-balanco
 ┃ ┃ ┃ ┃ ┣ 📜evolucao-do-balanco.component.css
 ┃ ┃ ┃ ┃ ┣ 📜evolucao-do-balanco.component.html
 ┃ ┃ ┃ ┃ ┗ 📜evolucao-do-balanco.component.ts
 ┃ ┃ ┃ ┣ 📂pricipais-despesas
 ┃ ┃ ┃ ┃ ┣ 📜pricipais-despesas.component.css
 ┃ ┃ ┃ ┃ ┣ 📜pricipais-despesas.component.html
 ┃ ┃ ┃ ┃ ┗ 📜pricipais-despesas.component.ts
 ┃ ┃ ┃ ┗ 📂receitas
 ┃ ┃ ┃ ┃ ┣ 📜receitas.component.css
 ┃ ┃ ┃ ┃ ┣ 📜receitas.component.html
 ┃ ┃ ┃ ┃ ┗ 📜receitas.component.ts
 ┃ ┃ ┣ 📂menu
 ┃ ┃ ┃ ┣ 📜menu.component.css
 ┃ ┃ ┃ ┣ 📜menu.component.html
 ┃ ┃ ┃ ┗ 📜menu.component.ts
 ┃ ┃ ┣ 📂opcoes-icones
 ┃ ┃ ┃ ┣ 📜opcoes-icones.component.css
 ┃ ┃ ┃ ┣ 📜opcoes-icones.component.html
 ┃ ┃ ┃ ┗ 📜opcoes-icones.component.ts
 ┃ ┃ ┣ 📂pop-up
 ┃ ┃ ┃ ┣ 📂confirm-popup
 ┃ ┃ ┃ ┃ ┣ 📜confirm-popup.component.css
 ┃ ┃ ┃ ┃ ┣ 📜confirm-popup.component.html
 ┃ ┃ ┃ ┃ ┗ 📜confirm-popup.component.ts
 ┃ ┃ ┃ ┣ 📂nova-categoria
 ┃ ┃ ┃ ┃ ┣ 📜nova-categoria.component.css
 ┃ ┃ ┃ ┃ ┣ 📜nova-categoria.component.html
 ┃ ┃ ┃ ┃ ┗ 📜nova-categoria.component.ts
 ┃ ┃ ┃ ┣ 📂nova-conta
 ┃ ┃ ┃ ┃ ┣ 📜nova-conta.component.css
 ┃ ┃ ┃ ┃ ┣ 📜nova-conta.component.html
 ┃ ┃ ┃ ┃ ┗ 📜nova-conta.component.ts
 ┃ ┃ ┃ ┣ 📂nova-subcategoria
 ┃ ┃ ┃ ┃ ┣ 📜nova-subcategoria.component.css
 ┃ ┃ ┃ ┃ ┣ 📜nova-subcategoria.component.html
 ┃ ┃ ┃ ┃ ┗ 📜nova-subcategoria.component.ts
 ┃ ┃ ┃ ┗ 📂novo-cartao
 ┃ ┃ ┃ ┃ ┣ 📜novo-cartao.component.css
 ┃ ┃ ┃ ┃ ┣ 📜novo-cartao.component.html
 ┃ ┃ ┃ ┃ ┗ 📜novo-cartao.component.ts
 ┃ ┃ ┣ 📂preloader
 ┃ ┃ ┃ ┣ 📜preloader.component.css
 ┃ ┃ ┃ ┣ 📜preloader.component.html
 ┃ ┃ ┃ ┗ 📜preloader.component.ts
 ┃ ┃ ┣ 📂relatorios
 ┃ ┃ ┃ ┗ 📂filtrode-extrato
 ┃ ┃ ┃ ┃ ┣ 📜filtrode-extrato.component.css
 ┃ ┃ ┃ ┃ ┣ 📜filtrode-extrato.component.html
 ┃ ┃ ┃ ┃ ┗ 📜filtrode-extrato.component.ts
 ┃ ┃ ┗ 📂sideBar
 ┃ ┃ ┃ ┣ 📜sideBar.component.css
 ┃ ┃ ┃ ┣ 📜sideBar.component.html
 ┃ ┃ ┃ ┗ 📜sideBar.component.ts
 ┃ ┣ 📂guards
 ┃ ┃ ┗ 📜auth.guard.ts
 ┃ ┣ 📂pages
 ┃ ┃ ┣ 📂cadastro
 ┃ ┃ ┃ ┣ 📜cadastro.component.css
 ┃ ┃ ┃ ┣ 📜cadastro.component.html
 ┃ ┃ ┃ ┗ 📜cadastro.component.ts
 ┃ ┃ ┣ 📂cartoes
 ┃ ┃ ┃ ┣ 📜cartoes.component.css
 ┃ ┃ ┃ ┣ 📜cartoes.component.html
 ┃ ┃ ┃ ┗ 📜cartoes.component.ts
 ┃ ┃ ┣ 📂categorias
 ┃ ┃ ┃ ┣ 📜categorias.component.css
 ┃ ┃ ┃ ┣ 📜categorias.component.html
 ┃ ┃ ┃ ┗ 📜categorias.component.ts
 ┃ ┃ ┣ 📂contas
 ┃ ┃ ┃ ┣ 📜contas.component.css
 ┃ ┃ ┃ ┣ 📜contas.component.html
 ┃ ┃ ┃ ┗ 📜contas.component.ts
 ┃ ┃ ┣ 📂dashboard
 ┃ ┃ ┃ ┣ 📜dashboard.component.css
 ┃ ┃ ┃ ┣ 📜dashboard.component.html
 ┃ ┃ ┃ ┗ 📜dashboard.component.ts
 ┃ ┃ ┣ 📂login
 ┃ ┃ ┃ ┣ 📜login.component.css
 ┃ ┃ ┃ ┣ 📜login.component.html
 ┃ ┃ ┃ ┗ 📜login.component.ts
 ┃ ┃ ┣ 📂objetivos
 ┃ ┃ ┃ ┣ 📜objetivos.component.css
 ┃ ┃ ┃ ┣ 📜objetivos.component.html
 ┃ ┃ ┃ ┗ 📜objetivos.component.ts
 ┃ ┃ ┣ 📂planejamento
 ┃ ┃ ┃ ┣ 📜planejamento.component.css
 ┃ ┃ ┃ ┣ 📜planejamento.component.html
 ┃ ┃ ┃ ┗ 📜planejamento.component.ts
 ┃ ┃ ┣ 📂relatorios
 ┃ ┃ ┃ ┣ 📜relatorios.component.css
 ┃ ┃ ┃ ┣ 📜relatorios.component.html
 ┃ ┃ ┃ ┗ 📜relatorios.component.ts
 ┃ ┃ ┣ 📂termos-de-uso
 ┃ ┃ ┃ ┣ 📜termos-de-uso.component.css
 ┃ ┃ ┃ ┣ 📜termos-de-uso.component.html
 ┃ ┃ ┃ ┗ 📜termos-de-uso.component.ts
 ┃ ┃ ┗ 📂transacoes
 ┃ ┃ ┃ ┣ 📜transacoes.component.css
 ┃ ┃ ┃ ┣ 📜transacoes.component.html
 ┃ ┃ ┃ ┗ 📜transacoes.component.ts
 ┃ ┣ 📂services
 ┃ ┃ ┣ 📂ApiCadastro
 ┃ ┃ ┃ ┗ 📜ApiCadastro.service.ts
 ┃ ┃ ┣ 📂ApiLogin
 ┃ ┃ ┃ ┗ 📜ApiLogin.service.ts
 ┃ ┃ ┣ 📂auth
 ┃ ┃ ┃ ┣ 📜auth.interceptor.ts
 ┃ ┃ ┃ ┗ 📜auth.service.ts
 ┃ ┃ ┣ 📂preloaderService
 ┃ ┃ ┃ ┗ 📜preloader.service.ts
 ┃ ┃ ┗ 📜global.service.ts
 ┃ ┣ 📜app.component.css
 ┃ ┣ 📜app.component.html
 ┃ ┣ 📜app.component.spec.ts
 ┃ ┣ 📜app.component.ts
 ┃ ┣ 📜app.config.ts
 ┃ ┗ 📜app.routes.ts
 ┣ 📂assets
 ┃ ┗ 📂imagens
 ┃ ┃ ┗ 📜logo - Lumen.png
 ┣ 📜index.html
 ┣ 📜main.ts
 ┗ 📜styles.css

</code>
</pre>

</details>
