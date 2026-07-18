# Craftland Community - Dados de Exemplo para Teste

Este arquivo contém exemplos de dados que podem ser importados para testes locais.

## 📝 Como Usar

1. Abra o console do navegador (F12)
2. Cole o código abaixo
3. Os dados de teste serão criados automaticamente

## 🧪 Dados de Teste

```javascript
// Execute isto no console do navegador para carregar dados de teste

const testData = {
    users: {
        'teste@example.com': {
            email: 'teste@example.com',
            username: 'Testador',
            password: 'dGVzdGUxMjM=', // "teste123" em base64
            isAdmin: false,
            createdAt: '2026-07-18T10:00:00Z',
            avatar: null,
            bio: 'Sou um testador da plataforma Craftland!'
        }
    },
    maps: [
        {
            id: 1626589200000,
            name: 'Castelo Mágico',
            roomId: '123456789',
            vipPassword: 'senha123',
            description: 'Um lindo castelo com muitas decorações e desafios emocionantes. Perfeito para aventuras!',
            category: 'adventure',
            image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22200%22%3E%3Crect fill=%22%239d4edd%22 width=%22280%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23f59e0b%22%3ECastelo M%C3%A1gico%3C/text%3E%3C/svg%3E',
            creator: 'BuilderMaster',
            creatorEmail: 'teste@example.com',
            createdAt: '2026-07-18T10:00:00Z',
            status: 'approved',
            likes: ['admin@example.com'],
            comments: [
                {
                    id: 1626589210000,
                    author: 'Testador',
                    text: 'Que mapa incrível! Adorei cada detalhe.',
                    createdAt: '2026-07-18T10:10:00Z',
                    replies: []
                }
            ],
            adminReview: {
                rating: 8.5,
                comment: 'Excelente criatividade e design. Muito bem executado!',
                reviewedAt: '2026-07-18T10:05:00Z'
            }
        },
        {
            id: 1626589300000,
            name: 'Arena PvP',
            roomId: '987654321',
            vipPassword: null,
            description: 'Arena competitiva para batalhas épicas. Tem múltiplos níveis e mecânicas interessantes.',
            category: 'pvp',
            image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22200%22%3E%3Crect fill=%2310b981%22 width=%22280%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23f59e0b%22%3EArena PvP%3C/text%3E%3C/svg%3E',
            creator: 'ProPlayer',
            creatorEmail: 'admin@example.com',
            createdAt: '2026-07-18T09:30:00Z',
            status: 'approved',
            likes: ['teste@example.com', 'admin@example.com'],
            comments: [],
            adminReview: {
                rating: 7.8,
                comment: 'Bom design, balanceamento bem feito.',
                reviewedAt: '2026-07-18T09:45:00Z'
            }
        },
        {
            id: 1626589400000,
            name: 'Mundo Criativo',
            roomId: '555666777',
            vipPassword: null,
            description: 'Mundo limitado para criatividade sem fim. Explore e construa suas próprias estruturas!',
            category: 'creative',
            image: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22280%22 height=%22200%22%3E%3Crect fill=%233a0ca3%22 width=%22280%22 height=%22200%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22Arial%22 font-size=%2224%22 fill=%22%23f59e0b%22%3EMundo Criativo%3C/text%3E%3C/svg%3E',
            creator: 'Artista',
            creatorEmail: 'teste@example.com',
            createdAt: '2026-07-18T08:00:00Z',
            status: 'approved',
            likes: [],
            comments: [],
            adminReview: null
        }
    ]
};

// Salvar dados
localStorage.setItem('craftland_users', JSON.stringify(testData.users));
localStorage.setItem('craftland_maps', JSON.stringify(testData.maps));

console.log('✅ Dados de teste carregados com sucesso!');
console.log('Usuários:', Object.keys(testData.users));
console.log('Mapas:', testData.maps.length);

// Recarregue a página
window.location.reload();
```

## 📊 Dados Criados

### Usuário de Teste
- **Email:** `teste@example.com`
- **Username:** `Testador`
- **Senha:** `teste123`
- **Admin:** Não
- **Bio:** "Sou um testador da plataforma Craftland!"

### Mapas de Exemplo

1. **Castelo Mágico** (Aprovado)
   - Room ID: `123456789`
   - Categoria: Aventura
   - Avaliação: 8.5⭐
   - Curtidas: 1
   - Comentários: 1

2. **Arena PvP** (Aprovado)
   - Room ID: `987654321`
   - Categoria: PvP
   - Avaliação: 7.8⭐
   - Curtidas: 2
   - Sem comentários

3. **Mundo Criativo** (Aprovado)
   - Room ID: `555666777`
   - Categoria: Criativo
   - Sem avaliação
   - Sem curtidas
   - Sem comentários

## 🧪 Testes Possíveis

### Com estes dados, você pode testar:

✅ Login com conta de teste  
✅ Visualizar mapas em Explorar  
✅ Buscar mapas  
✅ Curtir/Descurtir mapas  
✅ Adicionar comentários  
✅ Ver rankings (mapas mais curtidos e avaliados)  
✅ Editar perfil  
✅ Ver seus próprios mapas  
✅ Admin aprovando mapas  
✅ Visualizar avaliações  

## 🔄 Resetar Dados

Para limpar e começar do zero:

```javascript
// Limpar todos os dados
localStorage.removeItem('craftland_users');
localStorage.removeItem('craftland_maps');
localStorage.removeItem('craftland_current_user');

console.log('✅ Dados limpos! Recarregando...');
window.location.reload();
```

## 📝 Criar Mais Dados

Para adicionar mais mapas, use este modelo:

```javascript
const newMap = {
    id: Date.now(),
    name: 'Nome do Mapa',
    roomId: '111222333',
    vipPassword: 'senha' || null,
    description: 'Descrição aqui',
    category: 'survival', // adventure, creative, pvp, minigame, outros
    image: 'data:image/svg+xml,...', // ou URL da imagem
    creator: 'Seu Nome',
    creatorEmail: 'seu@email.com',
    createdAt: new Date().toISOString(),
    status: 'approved', // pending, approved, rejected
    likes: [],
    comments: [],
    adminReview: null
};

// Adicionar à lista
const maps = JSON.parse(localStorage.getItem('craftland_maps') || '[]');
maps.push(newMap);
localStorage.setItem('craftland_maps', JSON.stringify(maps));

console.log('✅ Novo mapa adicionado!');
```

## 🎯 Cenários de Teste

### Cenário 1: Teste Básico
1. Login com `teste@example.com` / `teste123`
2. Visualize os 3 mapas em Explorar
3. Curta um mapa
4. Veja o ranking atualizado

### Cenário 2: Teste de Admin
1. Login com `Janddersonjanddersonde@gmail.com` / `admin123`
2. Vá para Administração
3. Visualize o Dashboard
4. Veja estatísticas dos dados de teste

### Cenário 3: Teste de Interação
1. Crie sua própria conta
2. Publique um novo mapa
3. Mapa fica em "Pendente"
4. Faça login como admin e aprove
5. Veja seu mapa em Explorar

---

**Última atualização:** 18 de Julho de 2026  
**Versão:** 1.0.0
