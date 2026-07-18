import express from 'express';
import session from 'express-session';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Criar diretórios necessários
const uploadDirs = ['uploads/avatars', 'uploads/maps'];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(express.static('public'));

app.use(session({
  secret: 'craftland-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 dias
  }
}));

// Armazenamento de dados
const usersFile = 'data/users.json';
const mapsFile = 'data/maps.json';
const commentsFile = 'data/comments.json';
const likesFile = 'data/likes.json';

if (!fs.existsSync('data')) {
  fs.mkdirSync('data');
}

function loadData(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch {
    return [];
  }
}

function saveData(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

// Criar admin se não existir
function ensureAdminExists() {
  let users = loadData(usersFile);
  const adminEmail = 'janddersonjanddersonde@gmail.com';
  
  if (!users.find(u => u.email === adminEmail)) {
    const adminPassword = bcrypt.hashSync('AdminPassword123!', 10);
    users.push({
      id: uuidv4(),
      email: adminEmail,
      password: adminPassword,
      username: 'Administrador',
      bio: 'Administrador da comunidade Craftland',
      avatar: null,
      isAdmin: true,
      createdAt: new Date().toISOString()
    });
    saveData(usersFile, users);
    console.log('✓ Conta administrador criada:', adminEmail);
  }
}

ensureAdminExists();

// Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// ===================== AUTENTICAÇÃO =====================

app.post('/api/auth/register', (req, res) => {
  try {
    const { email, password, username } = req.body;
    let users = loadData(usersFile);

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: 'Email já registrado' });
    }

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: 'Nome de usuário já existe' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = {
      id: uuidv4(),
      email,
      password: hashedPassword,
      username,
      bio: '',
      avatar: null,
      isAdmin: false,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveData(usersFile, users);

    req.session.userId = newUser.id;
    res.status(201).json({ message: 'Registrado com sucesso!', user: { id: newUser.id, email, username } });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao registrar' });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    let users = loadData(usersFile);
    const user = users.find(u => u.email === email);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    req.session.userId = user.id;
    res.json({ 
      message: 'Login realizado!', 
      user: { 
        id: user.id, 
        email: user.email, 
        username: user.username,
        isAdmin: user.isAdmin
      } 
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Desconectado' });
});

app.get('/api/auth/session', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Não autenticado' });
  }

  let users = loadData(usersFile);
  const user = users.find(u => u.id === req.session.userId);
  
  if (!user) {
    return res.status(401).json({ error: 'Usuário não encontrado' });
  }

  res.json({ 
    user: { 
      id: user.id, 
      email: user.email, 
      username: user.username,
      avatar: user.avatar,
      bio: user.bio,
      isAdmin: user.isAdmin
    } 
  });
});

app.post('/api/auth/reset-password', (req, res) => {
  try {
    const { email, newPassword } = req.body;
    let users = loadData(usersFile);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    saveData(usersFile, users);
    res.json({ message: 'Senha resetada com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao resetar senha' });
  }
});

// ===================== PERFIS =====================

app.get('/api/users/:userId', (req, res) => {
  try {
    let users = loadData(usersFile);
    const user = users.find(u => u.id === req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({
      id: user.id,
      username: user.username,
      bio: user.bio,
      avatar: user.avatar,
      createdAt: user.createdAt
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar perfil' });
  }
});

app.put('/api/users/:userId', (req, res) => {
  try {
    if (req.session.userId !== req.params.userId) {
      return res.status(403).json({ error: 'Não autorizado' });
    }

    let users = loadData(usersFile);
    const user = users.find(u => u.id === req.params.userId);

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    if (req.body.username) user.username = req.body.username;
    if (req.body.bio) user.bio = req.body.bio;
    if (req.body.avatar) user.avatar = req.body.avatar;

    saveData(usersFile, users);
    res.json({ message: 'Perfil atualizado!', user });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar perfil' });
  }
});

app.post('/api/upload-avatar', upload.single('avatar'), (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem enviada' });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    let users = loadData(usersFile);
    const user = users.find(u => u.id === req.session.userId);

    if (user.avatar) {
      const oldPath = path.join(__dirname, 'public', user.avatar);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    user.avatar = imagePath;
    saveData(usersFile, users);
    res.json({ avatar: imagePath });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao fazer upload de avatar' });
  }
});

// ===================== MAPAS =====================

app.get('/api/maps', (req, res) => {
  try {
    const maps = loadData(mapsFile);
    const likes = loadData(likesFile);
    const comments = loadData(commentsFile);

    const enrichedMaps = maps.filter(m => m.approved).map(map => ({
      ...map,
      likeCount: likes.filter(l => l.mapId === map.id).length,
      commentCount: comments.filter(c => c.mapId === map.id).length
    }));

    res.json(enrichedMaps);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mapas' });
  }
});

app.post('/api/maps', upload.single('image'), (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { mapName, roomId, vipPassword, description, category } = req.body;
    let maps = loadData(mapsFile);

    if (!req.file) {
      return res.status(400).json({ error: 'Imagem do mapa é obrigatória' });
    }

    const newMap = {
      id: uuidv4(),
      mapName,
      roomId,
      vipPassword: vipPassword || null,
      description,
      category,
      image: `/uploads/${req.file.filename}`,
      creator: req.session.userId,
      approved: false,
      rating: 0,
      adminReview: '',
      createdAt: new Date().toISOString()
    };

    maps.push(newMap);
    saveData(mapsFile, maps);
    res.status(201).json({ message: 'Mapa publicado! Aguardando aprovação.', map: newMap });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao publicar mapa' });
  }
});

app.get('/api/maps/search', (req, res) => {
  try {
    const { query } = req.query;
    let maps = loadData(mapsFile);
    const likes = loadData(likesFile);
    const comments = loadData(commentsFile);
    let users = loadData(usersFile);

    const results = maps.filter(map => {
      if (!map.approved) return false;
      const creator = users.find(u => u.id === map.creator);
      const creatorName = creator ? creator.username : 'Desconhecido';
      const queryLower = query.toLowerCase();

      return map.mapName.toLowerCase().includes(queryLower) ||
             map.roomId.toLowerCase().includes(queryLower) ||
             creatorName.toLowerCase().includes(queryLower);
    }).map(map => ({
      ...map,
      likeCount: likes.filter(l => l.mapId === map.id).length,
      commentCount: comments.filter(c => c.mapId === map.id).length
    }));

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar mapas' });
  }
});

// ===================== CURTIDAS =====================

app.post('/api/maps/:mapId/like', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    let likes = loadData(likesFile);
    const existingLike = likes.find(l => l.mapId === req.params.mapId && l.userId === req.session.userId);

    if (existingLike) {
      likes = likes.filter(l => l.id !== existingLike.id);
    } else {
      likes.push({
        id: uuidv4(),
        mapId: req.params.mapId,
        userId: req.session.userId,
        createdAt: new Date().toISOString()
      });
    }

    saveData(likesFile, likes);
    res.json({ liked: !existingLike });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao curtir mapa' });
  }
});

app.get('/api/maps/:mapId/likes', (req, res) => {
  try {
    const likes = loadData(likesFile);
    const likeCount = likes.filter(l => l.mapId === req.params.mapId).length;
    const userLiked = req.session.userId ? likes.some(l => l.mapId === req.params.mapId && l.userId === req.session.userId) : false;
    res.json({ likeCount, userLiked });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar curtidas' });
  }
});

// ===================== COMENTÁRIOS =====================

app.get('/api/maps/:mapId/comments', (req, res) => {
  try {
    let comments = loadData(commentsFile);
    let users = loadData(usersFile);

    const mapComments = comments.filter(c => c.mapId === req.params.mapId && !c.parentId)
      .map(comment => {
        const user = users.find(u => u.id === comment.userId);
        const replies = comments.filter(r => r.parentId === comment.id)
          .map(reply => {
            const replyUser = users.find(u => u.id === reply.userId);
            return {
              ...reply,
              username: replyUser ? replyUser.username : 'Desconhecido',
              avatar: replyUser ? replyUser.avatar : null
            };
          });

        return {
          ...comment,
          username: user ? user.username : 'Desconhecido',
          avatar: user ? user.avatar : null,
          replies
        };
      });

    res.json(mapComments);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
});

app.post('/api/maps/:mapId/comments', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    const { text, parentId } = req.body;
    let comments = loadData(commentsFile);

    const newComment = {
      id: uuidv4(),
      mapId: req.params.mapId,
      userId: req.session.userId,
      text,
      parentId: parentId || null,
      createdAt: new Date().toISOString()
    };

    comments.push(newComment);
    saveData(commentsFile, comments);
    res.status(201).json({ message: 'Comentário postado!', comment: newComment });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao postar comentário' });
  }
});

// ===================== RANKINGS =====================

app.get('/api/rankings/most-liked', (req, res) => {
  try {
    let maps = loadData(mapsFile);
    const likes = loadData(likesFile);
    const comments = loadData(commentsFile);

    const ranking = maps
      .filter(m => m.approved)
      .map(map => ({
        ...map,
        likeCount: likes.filter(l => l.mapId === map.id).length,
        commentCount: comments.filter(c => c.mapId === map.id).length
      }))
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 10);

    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
});

app.get('/api/rankings/highest-rated', (req, res) => {
  try {
    let maps = loadData(mapsFile);
    const likes = loadData(likesFile);
    const comments = loadData(commentsFile);

    const ranking = maps
      .filter(m => m.approved && m.rating > 0)
      .map(map => ({
        ...map,
        likeCount: likes.filter(l => l.mapId === map.id).length,
        commentCount: comments.filter(c => c.mapId === map.id).length
      }))
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10);

    res.json(ranking);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar ranking' });
  }
});

// ===================== ADMIN =====================

app.get('/api/admin/dashboard', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    let users = loadData(usersFile);
    const user = users.find(u => u.id === req.session.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    let maps = loadData(mapsFile);
    const pendingMaps = maps.filter(m => !m.approved);
    const approvedMaps = maps.filter(m => m.approved);

    res.json({
      totalUsers: users.length,
      totalMaps: maps.length,
      approvedMaps: approvedMaps.length,
      pendingMaps: pendingMaps.length,
      pendingMapsList: pendingMaps
    });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao carregar dashboard' });
  }
});

app.put('/api/admin/maps/:mapId/approve', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    let users = loadData(usersFile);
    const user = users.find(u => u.id === req.session.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    let maps = loadData(mapsFile);
    const map = maps.find(m => m.id === req.params.mapId);

    if (!map) {
      return res.status(404).json({ error: 'Mapa não encontrado' });
    }

    map.approved = true;
    saveData(mapsFile, maps);
    res.json({ message: 'Mapa aprovado!', map });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao aprovar mapa' });
  }
});

app.put('/api/admin/maps/:mapId/rate', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    let users = loadData(usersFile);
    const user = users.find(u => u.id === req.session.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { rating, review } = req.body;
    let maps = loadData(mapsFile);
    const map = maps.find(m => m.id === req.params.mapId);

    if (!map) {
      return res.status(404).json({ error: 'Mapa não encontrado' });
    }

    map.rating = parseFloat(rating);
    map.adminReview = review || '';
    saveData(mapsFile, maps);
    res.json({ message: 'Avaliação adicionada!', map });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao avaliar mapa' });
  }
});

app.put('/api/admin/maps/:mapId/edit', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    let users = loadData(usersFile);
    const user = users.find(u => u.id === req.session.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const { mapName, description, category, vipPassword } = req.body;
    let maps = loadData(mapsFile);
    const map = maps.find(m => m.id === req.params.mapId);

    if (!map) {
      return res.status(404).json({ error: 'Mapa não encontrado' });
    }

    if (mapName) map.mapName = mapName;
    if (description) map.description = description;
    if (category) map.category = category;
    if (vipPassword !== undefined) map.vipPassword = vipPassword || null;

    saveData(mapsFile, maps);
    res.json({ message: 'Mapa editado!', map });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao editar mapa' });
  }
});

app.delete('/api/admin/maps/:mapId', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    let users = loadData(usersFile);
    const user = users.find(u => u.id === req.session.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    let maps = loadData(mapsFile);
    const map = maps.find(m => m.id === req.params.mapId);

    if (!map) {
      return res.status(404).json({ error: 'Mapa não encontrado' });
    }

    if (map.image) {
      const imagePath = path.join(__dirname, 'public', map.image);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    maps = maps.filter(m => m.id !== req.params.mapId);
    saveData(mapsFile, maps);
    res.json({ message: 'Mapa deletado!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar mapa' });
  }
});

app.get('/api/admin/users', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    let users = loadData(usersFile);
    const user = users.find(u => u.id === req.session.userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const userList = users.map(u => ({
      id: u.id,
      email: u.email,
      username: u.username,
      isAdmin: u.isAdmin,
      createdAt: u.createdAt
    }));

    res.json(userList);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
});

app.delete('/api/admin/users/:userId', (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    let users = loadData(usersFile);
    const admin = users.find(u => u.id === req.session.userId);

    if (!admin || !admin.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const targetUser = users.find(u => u.id === req.params.userId);
    if (!targetUser) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    users = users.filter(u => u.id !== req.params.userId);
    saveData(usersFile, users);
    res.json({ message: 'Usuário deletado!' });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

app.listen(PORT, () => {
  console.log(`🎮 Servidor Craftland rodando em http://localhost:${PORT}`);
});
