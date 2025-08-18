async function carregarEletivas() {
  const res = await fetch('/api/eletivas');
  const data = await res.json();
  const select=document.getElementById('eletiva');
  select.innerHTML='';
  Object.keys(data).forEach(e=>{
    const opt=document.createElement('option');
    opt.value=e;
    opt.textContent=`${e} (${data[e].vagasRestantes} vagas restantes)`;
    select.appendChild(opt);
  });
}
document.getElementById('inscricaoForm').addEventListener('submit', async (e)=>{
  e.preventDefault();
  const nomeAluno=document.getElementById('nomeAluno').value;
  const eletiva=document.getElementById('eletiva').value;
  const res = await fetch('/api/inscrever',{
    method:'POST',
    headers:{'Content-Type':'application/x-www-form-urlencoded'},
    body:`nomeAluno=${encodeURIComponent(nomeAluno)}&eletiva=${encodeURIComponent(eletiva)}`
  });
  document.getElementById('mensagem').textContent = res.ok ? 'Inscrição realizada!' : 'Vagas esgotadas';
  carregarEletivas();
});
carregarEletivas();
