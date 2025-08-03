# Projeto de Sistema de Agendamento para Academias

Este projeto é uma aplicação web desenvolvida em **React.js**, utilizando **Vite** como ferramenta de build, **TypeScript** para segurança de tipos, e **Material UI (MUI)** para uma interface de usuário consistente e moderna.

### Tecnologias Utilizadas

- **Frontend:**
  - React.js
  - Vite (Build Tool)
  - TypeScript
  - Material UI (MUI) para componentes de UI e tema
  - React Router DOM para navegação entre páginas
  - React Hook Form e Yup para gerenciamento e validação de formulários
  - `@react-input/mask` para máscaras
  - React Toastify para notificações
  - IndexedDB (via `idb` library) para persistência de dados no browser

### Funcionalidades Implementadas

- **Gerenciamento de Alunos:**
  - Listagem de alunos com exibição de detalhes.
  - **Cadastro e Edição de Alunos:**
    - Formulário via modal para adicionar novos alunos ou editar alunos existentes.
    - Campos: Nome, Data de nascimento, CPF, Cidade, Bairro, Endereço, Tipo de plano.
    - Validação segura para todos os campos do formulário de aluno.
- **Gerenciamento de Aulas:**
  - Listagem de aulas em uma data específica.
  - Página de detalhes de cada aula.
  - **Página de Detalhes da Aula:**
    - Exibição completa das informações da aula.
    - Lista de alunos inscritos na aula, com opção de remover participantes.
    - Opção de **finalizar a aula**, alterando seu status e impedindo novas inscrições.
    - Botão para **editar os detalhes da aula**.
    - Botão para **deletar a aula**.
  - **Cadastro e Edição de Aulas:**
    - Formulário via modal para adicionar novas aulas ou editar aulas existentes.
    - Campos: Descrição, Tipo de Aula, Data e Hora, Capacidade Máxima, Status (Aberta/Concluída), Permite Agendamento Pós-Início.
    - Validação segura para todos os campos do formulário de aula.

### Como Executar o Projeto

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/Guiroos/gym-scheduling-app.git
    cd gym-scheduling-app
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Inicie o servidor de desenvolvimento:**

    ```bash
    npm run dev
    ```

4.  Abra seu navegador e acesse `http://localhost:5173` (ou a porta que o Vite indicar).

### Estrutura e Decisões Técnicas

- **IndexedDB:** Foi escolhido para a persistência de dados local, simulando um backend. A API do `idb` foi utilizada para simplificar as operações.
- **Formulários:** `react-hook-form` com `yup` para validação robusta e `react-input-mask` para máscaras.
- **UI:** Material UI foi extensivamente customizado para seguir um design system consistente.
