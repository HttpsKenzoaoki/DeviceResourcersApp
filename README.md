# Device Resourcers App

Aplicativo mobile feito com **Expo SDK 57** e **React Native** que acessa os contatos do celular, permite visualizar detalhes de cada contato e adicionar/remover fotos personalizadas.

## Funcionalidades

### Tela 1 - Lista de Contatos
- Mostra todos os contatos do celular
- Cada contato exibe:
  - **Foto** (se tiver) ou **iniciais** (ex: "JS" para João Silva)
  - **Nome** do contato
  - **Número de telefone**
- Lista ordenada por nome
- Toque em um contato para ver os detalhes

### Tela 2 - Detalhes do Contato
- Mostra as informações do contato (nome, telefone e email)
- Mostra a foto do contato (se tiver)
- Botão **"Adicionar foto da galeria"** — abre a galeria para escolher uma foto
- Botão **"Remover foto"** — apaga a foto adicionada

### Tela 3 - Recursos do Dispositivo
- Acessível pelo botão **"Recursos"** no topo da lista de contatos
- É uma **central** com atalhos para duas ferramentas:
  - **Galeria de Fotos** (`ImagePickerComponent`) — adiciona uma ou várias imagens da galeria do aparelho e as salva de forma **persistente** (AsyncStorage + expo-file-system), exibindo-as em grade; toque em uma imagem para removê-la
  - **Compartilhar Contatos** (`ContactsComponent`) — busca contatos pelo nome e compartilha nome, telefones e emails usando o Share do sistema

### Persistência de fotos
- As fotos adicionadas são salvas em **AsyncStorage** (mapa `contactId → uri`)
- O arquivo da foto é copiado para o diretório de documentos do app com **expo-file-system**, garantindo que permaneça salvo mesmo após fechar e reabrir o app
- O app lembra qual foto pertence a cada contato

## Tecnologias

- [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/)
- React Native
- React Navigation (`@react-navigation/native` + `native-stack`)
- `expo-contacts` (API de classes) — leitura dos contatos
- `expo-image-picker` — seleção de fotos da galeria
- `expo-file-system` — cópia das fotos para armazenamento persistente
- `@react-native-async-storage/async-storage` — armazenamento do vínculo foto/contato
- `react-native-safe-area-context` — áreas seguras da tela

## Estrutura do projeto

```
├── App.js                              # Configuração da navegação
├── index.js                             # Ponto de entrada do Expo
└── src/
    ├── components/
    │   ├── ContactAvatar.js             # Avatar (foto ou iniciais)
    │   ├── ContactsComponent.js         # Utilitário de busca/compartilhamento de contatos
    │   └── ImagePickerComponent.js      # Galeria pessoal persistente
    ├── screens/
    │   ├── ContactListScreen.js         # Tela 1 - Lista de contatos
    │   └── ContactDetailScreen.js       # Tela 2 - Detalhes do contato
    └── storage/
        └── contactPhotos.js             # Persistência das fotos (AsyncStorage + FileSystem)
```

> A **Tela 3 (Recursos do Dispositivo)** é definida diretamente no `App.js` e leva às telas `ImageGallery` (`ImagePickerComponent`) e `ContactTools` (`ContactsComponent`).

## Pré-requisitos

- Node.js (versão LTS)
- Expo Go no celular (Android/iOS) ou emulador configurado

## Como rodar

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento:

```bash
npm start
```

> Se aparecer erro de resolução de módulos (Metro cache), inicie limpando o cache:
>
> ```bash
> npx expo start -c
> ```

3. Escaneie o QR code com o **Expo Go** no seu celular ou pressione `a` para abrir no emulador Android.

## Observações

- Na primeira execução, o app solicita permissão para acessar os contatos e a galeria de fotos.
- As fotos adicionadas aparecem na lista e nos detalhes do contato e permanecem salvas entre sessões.
