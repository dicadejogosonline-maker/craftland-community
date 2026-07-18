# Craftland Community - Guia de Instalação e Configuração

## 🚀 Início Rápido

### Opção 1: GitHub Pages (Recomendado)

O site já está configurado para funcionar no GitHub Pages!

**URL:** https://dicadejogosonline-maker.github.io/craftland-community/

1. Acesse o link acima
2. Clique em "Entrar"
3. Crie sua conta ou use a conta de admin
4. Comece a publicar mapas!

### Opção 2: Executar Localmente

#### Requisitos
- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Nenhuma dependência externa!

#### Passos

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/dicadejogosonline-maker/craftland-community.git
   cd craftland-community
   ```

2. **Inicie um servidor local:**

   **Com Python 3:**
   ```bash
   python -m http.server 8000
   ```

   **Com Python 2:**
   ```bash
   python -m SimpleHTTPServer 8000
   ```

   **Com Node.js (npm):**
   ```bash
   npx http-server
   ```

   **Com PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Abra no navegador:**
   ```
   http://localhost:8000
   ```

## 👥 Contas de Teste

### Conta de Administrador (Pré-criada)
- **Email:** `Janddersonjanddersonde@gmail.com`
- **Senha:** `admin123`
- **Acesso:** Menu "Administração"

### Criar Conta de Teste
1. Clique em "Entrar"
2. Clique em "Registrar"
3. Preencha:
   - Nome de Usuário (ex: "TestadorMaps")
   - Email (ex: "teste@example.com")
   - Senha (mínimo 6 caracteres)
4. Clique em "Registrar"

## 🗺️ Testando Funcionalidades

### 1. Teste de Registro
```
✓ Registre com email e senha
✓ Confirmação de sucesso
✓ Login automático após registro
```

### 2. Teste de Publicação de Mapa
```
✓ Clique em "Publicar Mapa"
✓ Preencha todos os campos:
  - Nome: "Castelo Mágico"
  - Room ID: "123456789"
  - Descrição: "Um castelo encantado com desafios"
  - Categoria: "Aventura"
  - Imagem: Envie uma imagem do seu computador
  - Senha VIP: (opcional) "senha123"
✓ Clique em "Publicar Mapa"
✓ Mensagem de sucesso
✓ Status: "Pendente de Aprovação"
```

### 3. Teste de Admin - Aprovar Mapa
```
✓ Faça logout
✓ Faça login com admin
✓ Clique em "Administração"
✓ Vá para "Gerenciar Mapas"
✓ Clique em "👁️ Visualizar"
✓ Preencha avaliação (8.5) e comentário
✓ Clique em "Salvar Revisão"
✓ Volte e clique em "✅ Aprovar"
✓ Sucesso!
```

### 4. Teste de Explorar
```
✓ Clique em "Explorar"
✓ Veja todos os mapas aprovados
✓ Teste busca por nome
✓ Teste busca por criador
✓ Teste busca por Room ID
✓ Teste filtro de categoria
```

### 5. Teste de Curtir
```
✓ Clique em um mapa
✓ Clique em "❤️ Curtir"
✓ Botão muda para "❤️ Curtido"
✓ Número de curtidas aumenta
```

### 6. Teste de Comentários
```
✓ Na modal do mapa, escreva um comentário
✓ Clique em "Publicar Comentário"
✓ Comentário aparece na lista
✓ Número de comentários aumenta
```

### 7. Teste de Rankings
```
✓ Clique em "Rankings"
✓ Veja "Mais Curtidos"
✓ Veja "Melhor Avaliados"
✓ Mapas aparecem em ordem correta
```

### 8. Teste de Perfil
```
✓ Clique em "Perfil"
✓ Edite a bio
✓ Clique em "Alterar Avatar"
✓ Envie uma imagem
✓ Avatar aparece
✓ Veja seus mapas publicados
```

### 9. Teste de Persistência
```
✓ Publique um mapa
✓ Curta um mapa
✓ Feche o navegador
✓ Reabra o site
✓ Você continua logado
✓ Mapas ainda existem
✓ Curtidas persistem
```

### 10. Teste de Copiar Room ID
```
✓ Abra um mapa
✓ Clique em "Copiar" do Room ID
✓ Mensagem de sucesso
✓ Cole em um documento (Ctrl+V)
✓ Room ID foi copiado
```

## 🎨 Checklist de Design

- ✅ Tema dark gaming (preto, roxo, verde, ouro)
- ✅ Responsivo em mobile
- ✅ Responsivo em tablet
- ✅ Responsivo em desktop
- ✅ Animações suaves
- ✅ Gradientes em botões
- ✅ Efeito hover em cards
- ✅ Notificações toast
- ✅ Loading screen
- ✅ Menu hamburger mobile

## 📱 Testar em Mobile

1. **Chrome DevTools:**
   - Abra DevTools (F12)
   - Clique em "Toggle device toolbar" (Ctrl+Shift+M)
   - Selecione diferentes dispositivos
   - Teste todas as funcionalidades

2. **Dispositivo Real:**
   - Se estiver em localhost: `http://seu-ip:8000`
   - Se no GitHub Pages: Use a URL completa

## 🐛 Troubleshooting

### Problema: "Dados não persistem"
**Solução:** Verifique se o navegador permite localStorage
- Abra DevTools > Application > LocalStorage
- Deve haver entradas: `craftland_users`, `craftland_maps`

### Problema: "Imagens não aparecem"
**Solução:** 
- Certifique-se de que o arquivo é uma imagem válida
- Tamanho recomendado: até 2MB
- Formatos: JPG, PNG, GIF, WebP

### Problema: "Login não funciona"
**Solução:**
- Limpe o cache (Ctrl+Shift+Delete)
- Feche todas as abas do site
- Reabra em aba privada
- Tente novamente

### Problema: "GitHub Pages não mostra mudanças"
**Solução:**
- Aguarde 1-2 minutos
- Limpe cache (Ctrl+Shift+Delete)
- Teste em navegador diferente

## 📊 Verificar Dados Salvos

1. Abra DevTools (F12)
2. Vá para "Application" ou "Storage"
3. Clique em "Local Storage"
4. Selecione o domínio do site
5. Você verá:
   - `craftland_users` - Dados de usuários
   - `craftland_maps` - Dados de mapas
   - `craftland_current_user` - Usuário logado

## 🔧 Personalizações

### Mudar Cores

Edite em `css/style.css` as variáveis CSS:

```css
:root {
    --primary-bg: #0a0a0a;          /* Fundo escuro */
    --primary-color: #9d4edd;       /* Roxo principal */
    --accent-gold: #f59e0b;         /* Ouro */
    --accent-green: #10b981;        /* Verde */
    /* ... mais cores */
}
```

### Mudar Email de Admin

Edite em `js/storage.js`:

```javascript
function initializeAdmin() {
    const adminEmail = 'seu-email@example.com'; // Mude aqui
    // ...
}
```

### Mudar Senha de Admin

Mude após fazer login:
1. Vá para "Entrar"
2. Clique em "Resetar Senha"
3. Insira o email de admin
4. Digite a nova senha
5. Confirme

## 📈 Próximas Passos

1. **Backend:** Integre com um servidor Node.js/Express
2. **Banco de Dados:** Use MongoDB ou PostgreSQL
3. **Autenticação:** Implemente JWT
4. **Email:** Adicione verificação de email
5. **CDN:** Hospede imagens em CDN
6. **API:** Crie API RESTful

## 📚 Documentação Adicional

- `README.md` - Visão geral do projeto
- `ADMIN.md` - Guia completo de administração
- `index.html` - Estrutura HTML
- `css/style.css` - Estilos principais
- `js/storage.js` - Gerenciamento de dados

## ✅ Checklist Final

- [ ] Site carrega sem erros
- [ ] Pode registrar conta
- [ ] Pode fazer login
- [ ] Pode publicar mapa
- [ ] Admin pode aprovar mapa
- [ ] Mapa aparece em Explorar
- [ ] Pode curtir mapa
- [ ] Pode comentar
- [ ] Rankings funcionam
- [ ] Perfil funciona
- [ ] Dados persistem após reabrir
- [ ] Design responsivo OK
- [ ] Sem erros de console

## 🆘 Suporte

Para problemas:
1. Verifique o console (F12 > Console)
2. Procure por erros vermelhos
3. Verifique o localStorage
4. Tente em outro navegador
5. Reporte no GitHub Issues

---

**Versão:** 1.0.0  
**Última atualização:** 18 de Julho de 2026  
**Status:** ✅ Pronto para teste e produção
