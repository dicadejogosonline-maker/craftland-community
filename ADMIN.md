# Craftland Community - Documentação de Administração

## 🔐 Acesso de Administrador

### Credenciais Padrão
- **Email:** `Janddersonjanddersonde@gmail.com`
- **Senha Inicial:** `admin123`
- **Acesso:** `/admin` ou menu "Administração"

## 📋 Painel de Administração

### 1️⃣ Gerenciar Mapas

Nesta seção, você pode:

- **Visualizar Mapas Pendentes:** Lista todos os mapas aguardando aprovação
- **Aprovar Mapas:** Clique em "✅ Aprovar" para que o mapa apareça em "Explorar"
- **Rejeitar Mapas:** Clique em "❌ Rejeitar" para recusar um mapa
- **Visualizar Detalhes:** Clique em "👁️ Visualizar" para ver o mapa completo

#### Processo de Revisão de Mapa:
1. Clique em "👁️ Visualizar"
2. Veja as informações: Room ID, descrição, imagem
3. Role até "Revisão do Administrador"
4. Digite uma avaliação de 0.0 a 10.0
5. Escreva um comentário sobre o mapa
6. Clique em "Salvar Revisão"
7. Volte para "Gerenciar Mapas" e aprove/rejeite

### 2️⃣ Gerenciar Usuários

Nesta seção, você pode:

- **Visualizar Todos os Usuários:** Nome, email, data de registro
- **Ver Avatar:** Imagem de perfil do usuário
- **Identificar Admin:** Usuários com badge "👑 Administrador"
- **Informações:** Email, data de criação e status

### 3️⃣ Dashboard

Vizualize as estatísticas gerais:

- **Total de Usuários:** Quantidade de contas criadas
- **Total de Mapas:** Todos os mapas publicados (aprovados + pendentes)
- **Mapas Pendentes:** Aguardando sua aprovação
- **Total de Comentários:** Todos os comentários nos mapas aprovados

## ⭐ Sistema de Avaliação

### Escala de Classificação (0.0 - 10.0)

- **9.0 - 10.0** - Excelente - Mapa de qualidade superior
- **8.0 - 8.9** - Muito Bom - Mapa com bom design e funcionalidade
- **7.0 - 7.9** - Bom - Mapa funcional, poucos problemas
- **6.0 - 6.9** - Satisfatório - Mapa aceitável com alguns melhoramentos
- **5.0 - 5.9** - Mediano - Mapa que precisa de melhorias
- **4.0 - 4.9** - Fraco - Mapa com vários problemas
- **0.0 - 3.9** - Muito Fraco - Rejeitar

## 📝 Dicas para Revisões

### Elementos a Verificar:
1. **Qualidade da Imagem:** Está clara e representa o mapa?
2. **Descrição:** É detalhada e informativa?
3. **Room ID:** Formato parece válido?
4. **Categoria:** Está corretamente categorizado?
5. **Conteúdo Inapropriado:** Há linguagem ofensiva ou conteúdo impróprio?

### Exemplos de Comentários:

✅ **Aprovado:**
- "Excelente mapa! Criativo com bom nível de dificuldade."
- "Muito bem decorado e funcional. Recomendo!"
- "Design inovador, adorei explorar cada área."

❌ **Rejeitar:**
- "Mapa muito simples, sem decoração."
- "Descrição insufi ciente. Reescrever e resubmeter."
- "Conteúdo impróprio. Rejeito."

## 🎯 Boas Práticas

1. **Seja Justo:** Avalie com base na qualidade e criatividade
2. **Seja Construtivo:** Seus comentários ajudam criadores a melhorar
3. **Seja Consistente:** Use os mesmos critérios para todos os mapas
4. **Seja Rápido:** Reduza o tempo de espera dos criadores
5. **Seja Imparcial:** Não deixe preferências pessoais interferir

## 🔄 Fluxo de Aprovação

```
Mapa Publicado
      ↓
   Pendente
      ↓
Admin Revisão
      ↓
Aprovado ou Rejeitado
      ↓
Aparece em Explorar (se aprovado)
```

## ⚠️ Problemas Comuns

### "Não consigo entrar no Painel Admin"
- Verifique o email exato: `Janddersonjanddersonde@gmail.com`
- Verifique a senha: `admin123`
- Limpe o cache do navegador e tente novamente

### "Os mapas não aparecem em Explorar"
- Verifique se foram aprovados
- Recarregue a página (Ctrl+F5)
- Verifique o localStorage do navegador

### "Meu comentário não apareceu"
- Recarregue a página para atualizar
- Verifique se está logado
- Verifique se o mapa está aprovado

## 📊 Relatórios

O dashboard fornece informações em tempo real sobre:
- Crescimento de usuários
- Volume de mapas publicados
- Atividade pendente
- Engajamento (comentários)

## 🔐 Segurança

### Senha
- **Primeira coisa a fazer:** Mude a senha padrão!
- Vá para Perfil → Resetar Senha
- Use uma senha forte e única

### Dados
- Todos os dados são salvos no localStorage
- Backup regular é recomendado
- Não compartilhe suas credenciais

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique este documento
2. Verifique o arquivo README.md
3. Reporte issues no GitHub

---

**Última atualização:** 18 de Julho de 2026  
**Versão:** 1.0.0
