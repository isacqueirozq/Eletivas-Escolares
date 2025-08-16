const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'painel_eletivas',
  resave: false,
  saveUninitialized: true
}));

const eletivas = {
  "Robótica": { vagasTotais: 10, vagasRestantes: 10 },
  "Teatro":   { vagasTotais: 15, vagasRestantes: 15 },
  "Música":   { vagasTotais: 8,  vagasRestantes: 8  }
};

let inscricoes = [];

const filePath = path.join(__dirname, 'inscricoes.json');
if (fs.existsSync(filePath)) {
  try {
    inscricoes = JSON.parse(fs.readFileSync(filePath));
  } catch (e) {}
}

app.get('/api/eletivas', (req,res)=>{ res.json(eletivas); });
app.post('/api/inscrever', (req,res)=>{
  const {nomeAluno, eletiva} = req.body;
  if (eletivas[eletiva] && eletivas[eletiva].vagasRestantes>0) {
    eletivas[eletiva].vagasRestantes -=1;
    const record = {nomeAluno,eletiva};
    inscricoes.push(record);
    fs.writeFileSync(filePath, JSON.stringify(inscricoes, null, 2));
    res.status(200).send('Inscrição realizada');
  } else {
    res.status(400).send('Vagas esgotadas');
  }
});

const credentials = { user:'admin', password:'atmas' };
app.get('/admin/login', (req,res)=>{ res.sendFile(path.join(__dirname,'public','login.html')); });
app.post('/admin/login', (req,res)=>{
  const {usuario,senha} = req.body;
  if(usuario===credentials.user && senha===credentials.password){
    req.session.auth=true;
    return res.redirect('/admin');
  }
  return res.redirect('/admin/login');
});

app.get('/admin', (req,res)=>{
  if(req.session.auth){
    return res.sendFile(path.join(__dirname,'public','admin.html'));
  }
  return res.redirect('/admin/login');
});

app.get('/admin/data',(req,res)=>{
  if(!req.session.auth) return res.status(401).send('Não autorizado');
  res.json({eletivas, inscricoes});
});

app.get('/admin/export',(req,res)=>{
  if(!req.session.auth) return res.status(401).send('Não autorizado');
  let csv='Nome, Eletiva\n';
  inscricoes.forEach(r=>{ csv+=`${r.nomeAluno},${r.eletiva}\n`; });
  res.header('Content-Type','text/csv');
  res.attachment('inscricoes.csv');
  res.send(csv);
});

app.get('/admin/logout',(req,res)=>{
  req.session.destroy();
  res.redirect('/admin/login');
});

const PORT = process.env.PORT||3000;
app.listen(PORT, ()=> console.log('Servidor iniciado'));
