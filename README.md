# Craftland Community 🎮

**Uma plataforma completa para compartilhar, explorar e gerenciar mapas do Craftland!**

## 🌟 Características

### Para Usuários
- ✅ **Registro e Login** - Crie sua conta com email e senha
- ✅ **Perfil de Usuário** - Avatar customizável, bio e informações pessoais
- ✅ **Publicar Mapas** - Compartilhe mapas com imagens, descrição, Room ID e senha VIP
- ✅ **Explorar Mapas** - Navegue por todos os mapas publicados
- ✅ **Busca Avançada** - Filtre por nome, criador, Room ID e categoria
- ✅ **Curtir Mapas** - Mostre apoio aos mapas favoritos
- ✅ **Comentários** - Interaja com outros jogadores
- ✅ **Rankings** - Veja os mapas mais curtidos e bem avaliados
- ✅ **Copiar Room ID** - Copie facilmente para a área de transferência
- ✅ **Login Persistente** - Permaneça conectado mesmo após reabrir o site

### Para Administradores
- 🔐 **Painel Admin** - Acesso apenas com email: `Janddersonjanddersonde@gmail.com`
- ✅ **Aprovar/Rejeitar Mapas** - Controle a qualidade do conteúdo
- ✅ **Avaliar Mapas** - Dê notas de 0.0 a 10.0
- ✅ **Escrever Reviews** - Adicione comentários detalhados
- ✅ **Gerenciar Usuários** - Visualize informações de todos os usuários
- ✅ **Dashboard** - Veja estatísticas completas da plataforma

## 🎨 Design

- **Tema:** Dark Gaming com cores modernas
- **Cores Principais:** Preto, Roxo, Verde e Ouro
- **Responsivo:** Funciona perfeitamente em desktop, tablet e mobile
- **Animações:** Transições suaves e efeitos visuais atraentes

## 🚀 Como Usar

### Acesso Rápido
1. Acesse o site via GitHub Pages
2. Clique em "Entrar" ou "Registrar"
3. Crie sua conta ou faça login
4. Explore mapas, publique os seus e divirta-se!

### Fluxo de Publicação
1. Clique em "Publicar Mapa" (após estar logado)
2. Preencha as informações:
   - Nome do Mapa
   - Room ID
   - Descrição
   - Categoria
   - Imagem do Mapa
   - Senha VIP (opcional)
3. Clique em "Publicar"
4. Aguarde aprovação do administrador
5. Seu mapa aparecerá em "Explorar" após aprovação

### Primeira Vez na Administração
1. Faça login com: `Janddersonjanddersonde@gmail.com`
2. Senha padrão: `admin123`
3. Acesse o menu "Administração"
4. Comece a gerenciar mapas e usuários

## 💾 Armazenamento de Dados

- **Plataforma:** GitHub Pages (100% estático)
- **Banco de Dados:** LocalStorage do navegador
- **Persistência:** Dados salvos automaticamente no navegador do usuário
- **Sincronização:** Todos os dados são salvos localmente para funcionamento offline

## 📱 Compatibilidade

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers
- ✅ Tablets

## 🛠️ Tecnologias

- HTML5
- CSS3 (com animações e gradientes)
- JavaScript ES6+
- LocalStorage API
- GitHub Pages

## 📂 Estrutura do Projeto

```
craftland-community/
├── index.html              # Página principal
├── manifest.json           # PWA Manifest
├── .nojekyll              # Configuração GitHub Pages
├── css/
│   ├── style.css          # Estilos principais
│   └── responsive.css     # Estilos responsivos
├── js/
│   ├── app.js             # Inicialização principal
│   ├── auth.js            # Autenticação e login
│   ├── maps.js            # Gerenciamento de mapas
│   ├── ui.js              # Funções de interface
│   ├── admin.js           # Painel de administração
│   └── storage.js         # Gerenciamento de dados
└── README.md              # Este arquivo
```

## ⚙️ Instalação Local

### Opção 1: Clonar e abrir localmente
```bash
git clone https://github.com/dicadejogosonline-maker/craftland-community.git
cd craftland-community
# Abra o index.html em um navegador
```

### Opção 2: Usar um servidor local (recomendado)
```bash
# Com Python 3
python -m http.server 8000

# Ou com Node.js
npx http-server

# Depois acesse: http://localhost:8000
```

## 📝 Notas Importantes

1. **Dados Locais:** Todos os dados são armazenados no localStorage do navegador. Limpar o cache do navegador resultará na perda de dados.
2. **Imagens:** As imagens são convertidas para base64 e armazenadas localmente.
3. **Segurança:** Este é um exemplo educacional. Para produção, implemente autenticação real no backend.
4. **Admin Padrão:** A primeira vez que acessar, use a conta de admin fornecida.

## 🎯 Funcionalidades Futuras

- [ ] Sincronização com backend
- [ ] Autenticação real com JWT
- [ ] Suporte a múltiplos idiomas
- [ ] Sistema de notificações
- [ ] Respostas a comentários
- [ ] Favoritos pessoais
- [ ] Badges e achievements
- [ ] Integração com Discord

## 🤝 Contribuições

Sinta-se à vontade para fazer fork, reportar problemas ou sugerir melhorias!

## 📄 Licença

Este projeto é de código aberto e disponível sob a Licença MIT.

## 🎮 Créditos

Desenvolvido com ❤️ para a comunidade Craftland

---

**Versão:** 1.0.0  
**Data:** 18 de Julho de 2026  
**Status:** ✅ Pronto para uso
