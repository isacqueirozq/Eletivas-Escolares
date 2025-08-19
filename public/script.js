const supabaseUrl = 'https://tjetblccvbqclecjosyq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRqZXRibGNjdmJxY2xlY2pvc3lxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxMjE4OTgsImV4cCI6MjA3MDY5Nzg5OH0.yQ3kWbccNw3J6cCi62UU1UvWuMUWkeAGnEVzYCjJQOk';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

async function carregarEletivas() {
  const { data:eletivas, error } = await supabase
    .from('eletivas')
    .select('id, nome')
    .order('nome', { ascending: true });

  const select = document.getElementById('eletiva');
  select.innerHTML = '';

  if (error) {
    const option = document.createElement('option');
    option.textContent = 'Erro ao carregar eletivas';
    select.appendChild(option);
    return;
  }

  if (data.length === 0) {
    const option = document.createElement('option');
    option.textContent = 'Nenhuma eletiva cadastrada';
    select.appendChild(option);
    return;
  }

  data.forEach(eletiva => {
    const option = document.createElement('option');
    option.value = eletiva.id;
    option.textContent = eletiva.nome;
    select.appendChild(option);
  });
}

document.getElementById('inscricaoForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nomeAluno = document.getElementById('nomeAluno').value;
  const eletiva = document.getElementById('eletiva').value;
  const res = await fetch('/api/inscrever', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `nomeAluno=${encodeURIComponent(nomeAluno)}&eletiva=${encodeURIComponent(eletiva)}`
  });
  document.getElementById('mensagem').textContent = res.ok ? 'Inscrição realizada!' : 'Vagas esgotadas';
  carregarEletivas();
});

window.addEventListener('DOMContentLoaded', carregarEletivas);
