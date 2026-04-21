const API = 'http://localhost:8000/api';

let todosPoliticos = [];
let politicoAtual = null;

// ─── Navegação ────────────────────────────────────────────────
function mostrarSecao(nome) {
  document.querySelectorAll('.secao').forEach(s => s.classList.remove('ativa'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`secao-${nome}`).classList.add('ativa');
  const idx = ['inicio','politicos','sobre'].indexOf(nome);
  document.querySelectorAll('.nav-btn')[idx]?.classList.add('active');

  if (nome === 'politicos' && todosPoliticos.length === 0) carregarPoliticos();
  if (nome === 'inicio') carregarStats();
}

// ─── Stats do hero ────────────────────────────────────────────
async function carregarStats() {
  try {
    const data = await fetchJSON(`${API}/politicos/`);
    const total = data.length;
    const mediaGastos = total ? data.reduce((s, p) => s + p.gastos_gabinete, 0) / total : 0;
    const mediaPresenca = total ? data.reduce((s, p) => s + p.presenca_percent, 0) / total : 0;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-gastos').textContent = 'R$ ' + mediaGastos.toLocaleString('pt-BR', { maximumFractionDigits: 0 });
    document.getElementById('stat-presenca').textContent = mediaPresenca.toFixed(1) + '%';
  } catch {
    // silencioso — API pode não estar rodando
  }
}

// ─── Carregar políticos ───────────────────────────────────────
async function carregarPoliticos() {
  const grid = document.getElementById('grid-politicos');
  grid.innerHTML = `<div class="loading"><div class="spinner"></div> Carregando dados...</div>`;

  try {
    const data = await fetchJSON(`${API}/politicos/`);
    todosPoliticos = data;
    popularFiltros(data);
    renderGrid(data);
  } catch (e) {
    grid.innerHTML = `<div class="erro-msg">⚠️ Não foi possível conectar ao backend.<br/><small>Certifique-se que o servidor está rodando em localhost:8000</small></div>`;
  }
}

function popularFiltros(politicos) {
  const estados = [...new Set(politicos.map(p => p.estado))].sort();
  const partidos = [...new Set(politicos.map(p => p.partido))].sort();

  const selEstado = document.getElementById('filtro-estado');
  const selPartido = document.getElementById('filtro-partido');

  estados.forEach(e => {
    const opt = document.createElement('option');
    opt.value = e; opt.textContent = e;
    selEstado.appendChild(opt);
  });

  partidos.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p; opt.textContent = p;
    selPartido.appendChild(opt);
  });
}

function filtrar() {
  const busca = document.getElementById('busca').value.toLowerCase();
  const estado = document.getElementById('filtro-estado').value;
  const partido = document.getElementById('filtro-partido').value;

  const filtrados = todosPoliticos.filter(p => {
    return (!busca || p.nome.toLowerCase().includes(busca) || p.cargo.toLowerCase().includes(busca))
      && (!estado || p.estado === estado)
      && (!partido || p.partido === partido);
  });

  renderGrid(filtrados);
}

// ─── Render cards ─────────────────────────────────────────────
function renderGrid(lista) {
  const grid = document.getElementById('grid-politicos');
  if (lista.length === 0) {
    grid.innerHTML = `<div class="erro-msg">Nenhum político encontrado.</div>`;
    return;
  }

  grid.innerHTML = lista.map(p => `
    <div class="card" onclick="abrirModal(${p.id})">
      <div class="card-header">
        <img class="card-foto" src="${p.foto_url || 'https://i.pravatar.cc/150?u=' + p.id}" alt="${p.nome}" onerror="this.src='https://i.pravatar.cc/150?u=${p.id}'" />
        <div>
          <div class="card-nome">${p.nome}</div>
          <div class="card-cargo">${p.cargo} · ${p.estado}</div>
        </div>
      </div>

      <div class="card-badges">
        <span class="badge partido">${p.partido}</span>
        <span class="badge">${p.projetos_aprovados} proj. aprovados</span>
      </div>

      <div class="card-stats">
        <div class="mini-stat">
          <div class="mini-stat-label">Patrimônio</div>
          <div class="mini-stat-val">${formatarReal(p.patrimonio)}</div>
        </div>
        <div class="mini-stat">
          <div class="mini-stat-label">Gastos gabinete</div>
          <div class="mini-stat-val">${formatarReal(p.gastos_gabinete)}</div>
        </div>
      </div>

      <div class="presenca-bar">
        <div class="presenca-label">
          <span>Presença nas votações</span>
          <span>${p.presenca_percent}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill ${p.presenca_percent < 70 ? 'baixo' : p.presenca_percent < 85 ? 'medio' : ''}"
               style="width: ${p.presenca_percent}%"></div>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── Modal ────────────────────────────────────────────────────
async function abrirModal(id) {
  politicoAtual = id;
  const modal = document.getElementById('modal');
  const content = document.getElementById('modal-content');

  modal.classList.add('aberto');
  content.innerHTML = `<div class="loading"><div class="spinner"></div> Carregando...</div>`;

  try {
    const [politico, comentarios] = await Promise.all([
      fetchJSON(`${API}/politicos/${id}`),
      fetchJSON(`${API}/comentarios/${id}`)
    ]);

    content.innerHTML = `
      <div class="modal-header">
        <img class="modal-foto" src="${politico.foto_url || 'https://i.pravatar.cc/150?u=' + id}" alt="${politico.nome}" />
        <div>
          <div class="modal-nome">${politico.nome}</div>
          <div class="modal-cargo-estado">${politico.cargo} — ${politico.estado}</div>
          <div class="modal-partido">${politico.partido}</div>
        </div>
      </div>

      <div class="modal-grid">
        <div class="modal-stat-card">
          <div class="modal-stat-label">Patrimônio declarado</div>
          <div class="modal-stat-val">${formatarReal(politico.patrimonio)}</div>
        </div>
        <div class="modal-stat-card">
          <div class="modal-stat-label">Gastos de gabinete</div>
          <div class="modal-stat-val">${formatarReal(politico.gastos_gabinete)}</div>
        </div>
        <div class="modal-stat-card">
          <div class="modal-stat-label">Presença nas votações</div>
          <div class="modal-stat-val">${politico.presenca_percent}%</div>
        </div>
        <div class="modal-stat-card">
          <div class="modal-stat-label">Projetos aprovados</div>
          <div class="modal-stat-val">${politico.projetos_aprovados}</div>
        </div>
      </div>

      <div class="modal-section-title">Comentários cidadãos</div>

      <div class="comentario-form">
        <input id="c-autor" type="text" placeholder="Seu nome" maxlength="60" />
        <textarea id="c-texto" placeholder="Deixe seu comentário sobre este político..." maxlength="500"></textarea>
        <button class="btn-comentar" onclick="enviarComentario()">Publicar comentário</button>
        <div class="msg-moderacao" id="msg-moderacao"></div>
      </div>

      <div id="lista-comentarios">
        ${renderComentarios(comentarios)}
      </div>
    `;
  } catch {
    content.innerHTML = `<div class="erro-msg">Erro ao carregar dados.</div>`;
  }
}

function renderComentarios(lista) {
  if (!lista.length) return `<div class="sem-comentarios">Seja o primeiro a comentar.</div>`;
  return lista.map(c => `
    <div class="comentario-item">
      <div class="comentario-autor">${c.autor}</div>
      <div class="comentario-texto">${c.texto}</div>
      <div class="comentario-data">${new Date(c.created_at).toLocaleDateString('pt-BR')}</div>
    </div>
  `).join('');
}

async function enviarComentario() {
  const autor = document.getElementById('c-autor').value.trim();
  const texto = document.getElementById('c-texto').value.trim();
  const msg = document.getElementById('msg-moderacao');

  if (!autor || !texto) {
    mostrarMsg(msg, 'Preencha seu nome e o comentário.', 'erro');
    return;
  }

  try {
    const resp = await fetch(`${API}/comentarios/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ politico_id: politicoAtual, autor, texto })
    });

    const data = await resp.json();

    if (!resp.ok) throw new Error();

    if (data.aprovado) {
      mostrarMsg(msg, '✓ Comentário publicado com sucesso!', 'ok');
      document.getElementById('c-autor').value = '';
      document.getElementById('c-texto').value = '';

      // Recarregar comentários
      const comentarios = await fetchJSON(`${API}/comentarios/${politicoAtual}`);
      document.getElementById('lista-comentarios').innerHTML = renderComentarios(comentarios);
    } else {
      mostrarMsg(msg, '✕ Comentário bloqueado pela moderação automática.', 'erro');
    }
  } catch {
    mostrarMsg(msg, 'Erro ao enviar. Tente novamente.', 'erro');
  }
}

function mostrarMsg(el, texto, tipo) {
  el.textContent = texto;
  el.className = `msg-moderacao ${tipo}`;
  el.style.display = 'block';
  setTimeout(() => el.style.display = 'none', 4000);
}

function fecharModal(e) {
  if (!e || e.target === document.getElementById('modal')) {
    document.getElementById('modal').classList.remove('aberto');
    politicoAtual = null;
  }
}

// ─── Utils ────────────────────────────────────────────────────
async function fetchJSON(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

function formatarReal(val) {
  if (val >= 1_000_000) return 'R$ ' + (val / 1_000_000).toFixed(1) + 'M';
  if (val >= 1_000) return 'R$ ' + (val / 1_000).toFixed(0) + 'k';
  return 'R$ ' + val.toLocaleString('pt-BR');
}

// ─── Init ─────────────────────────────────────────────────────
carregarStats();
