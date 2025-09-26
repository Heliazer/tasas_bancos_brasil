async function loadData() {
  const params = new URLSearchParams(location.search);
  const override = params.get('data');
  const candidates = [];
  if (override) {
    candidates.push(override);
    if (!override.startsWith('/')) candidates.push('./' + override);
  }
  candidates.push('data/bancos.json', './data/bancos.json', '../data/bancos.json', '/data/bancos.json');
  let lastErr;
  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) { lastErr = new Error(`HTTP ${res.status} ${res.statusText}`); continue; }
      const json = await res.json();
      return json.map(r => ({
        ...r,
        producto: r.producto || r.produto || '',
        tasa: typeof r.tasa === 'number' ? r.tasa : Number(r.tasa),
      }));
    } catch (e) {
      lastErr = e;
    }
  }
  // Fallback: inline JSON embedded in the HTML (works with file://)
  const inline = document.getElementById('inline-data');
  if (inline && inline.textContent.trim()) {
    const json = JSON.parse(inline.textContent);
    return json.map(r => ({
      ...r,
      producto: r.producto || r.produto || '',
      tasa: typeof r.tasa === 'number' ? r.tasa : Number(r.tasa),
    }));
  }
  if (location.protocol === 'file:') {
    throw new Error('Abriste el archivo con file://. Sirve el directorio con: python3 -m http.server 8000 y abre http://localhost:8000/');
  }
  throw lastErr || new Error('No se pudo cargar data/bancos.json');
}

function fmtPct(x) { return `${x.toFixed(2)}%`; }
function lastDate(records) {
  const ds = records.map(r => r.actualizado).filter(Boolean);
  if (!ds.length) return '—';
  return ds.sort().at(-1);
}

function unique(arr) { return [...new Set(arr)]; }

function applyFilters(records) {
  const q = document.querySelector('#search').value.trim().toLowerCase();
  const bank = document.querySelector('#bank').value;
  const tipo = document.querySelector('#tipoTasa').value;
  const minRate = parseFloat(document.querySelector('#minRate').value || '');

  return records.filter(r => {
    if (bank && r.banco !== bank) return false;
    if (tipo && r.tipo_tasa !== tipo) return false;
    if (!Number.isNaN(minRate) && (r.tasa ?? -Infinity) < minRate) return false;
    if (q) {
      const hay = [r.banco, r.producto, r.plazo, r.moneda].join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function updateMetrics(records) {
  const tasaVals = records.map(r => r.tasa).filter(v => typeof v === 'number' && !Number.isNaN(v));
  const avg = tasaVals.length ? tasaVals.reduce((a,b)=>a+b,0)/tasaVals.length : 0;
  document.querySelector('#metric-count').textContent = records.length;
  document.querySelector('#metric-banks').textContent = unique(records.map(r=>r.banco)).length;
  document.querySelector('#metric-avg').textContent = fmtPct(avg);
  document.querySelector('#metric-updated').textContent = lastDate(records);
}

function renderTable(records) {
  const tbody = document.querySelector('#table tbody');
  tbody.innerHTML = '';
  const frag = document.createDocumentFragment();
  records.forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${escapeHtml(r.banco)}</td>
      <td><a href="${encodeURI(r.url||'#')}" target="_blank" rel="noopener">${escapeHtml(r.producto)}</a></td>
      <td class="num">${typeof r.tasa === 'number' ? r.tasa.toFixed(2) : ''}</td>
      <td>${escapeHtml(r.plazo||'')}</td>
      <td>${escapeHtml(r.moneda||'')}</td>
      <td>${escapeHtml(r.actualizado||'')}</td>`;
    frag.appendChild(tr);
  });
  tbody.appendChild(frag);
}

function escapeHtml(s){ return String(s??'').replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c])); }

function prepareChartData(records, groupByBank) {
  if (groupByBank) {
    const by = new Map();
    for (const r of records) {
      if (typeof r.tasa !== 'number') continue;
      const k = r.banco;
      const v = by.get(k) || { sum:0, n:0 };
      v.sum += r.tasa; v.n += 1; by.set(k, v);
    }
    const arr = [...by.entries()].map(([k,{sum,n}]) => ({ label: k, value: sum/n }));
    return arr.sort((a,b)=>b.value-a.value).slice(0,10);
  }
  const arr = records.filter(r=>typeof r.tasa==='number').map(r=>({ label: r.producto, value: r.tasa }));
  return arr.sort((a,b)=>b.value-a.value).slice(0,10);
}

function renderBarChart(data) {
  const wrap = document.querySelector('#chart');
  wrap.innerHTML = '';
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  wrap.appendChild(svg);

  const W = wrap.clientWidth || 800;
  const H = wrap.clientHeight || 320;
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);

  const margin = { top: 16, right: 12, bottom: 80, left: 60 };
  const iw = W - margin.left - margin.right;
  const ih = H - margin.top - margin.bottom;

  const maxV = Math.max(1, ...data.map(d=>d.value));
  const barW = iw / Math.max(1, data.length);
  const g = elt('g', { transform: `translate(${margin.left},${margin.top})` });
  svg.appendChild(g);

  // Axes
  const yTicks = 5;
  for (let i=0;i<=yTicks;i++){
    const t = i/yTicks; const y = ih - t*ih; const v = t*maxV;
    g.appendChild(elt('line', { x1:0, x2:iw, y1:y, y2:y, stroke:'#223043' }));
    g.appendChild(text(fmtPct(v), -8, y+4, { 'text-anchor':'end', class:'axis' }));
  }

  data.forEach((d, i) => {
    const h = ih * (d.value / maxV);
    const x = i * barW + 8;
    const y = ih - h;
    const bw = Math.max(6, barW - 16);
    const rect = elt('rect', { x, y, width: bw, height: h, class: 'bar', rx: 6, ry: 6 });
    rect.addEventListener('mousemove', (e)=>{
      tooltip(`${escapeHtml(d.label)}\n${fmtPct(d.value)}`, e.clientX, e.clientY);
    });
    rect.addEventListener('mouseleave', hideTooltip);
    g.appendChild(rect);
    // x labels
    const tx = x + bw/2;
    const ty = ih + 14;
    const lbl = d.label.length > 18 ? d.label.slice(0,17)+'…' : d.label;
    g.appendChild(text(lbl, tx, ty, { 'text-anchor':'middle', class:'axis', transform: `rotate(0,${tx},${ty})` }));
  });
}

function elt(name, attrs={}){ const e = document.createElementNS('http://www.w3.org/2000/svg', name); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }
function text(s, x, y, attrs={}) { const t=elt('text',{x,y,...attrs}); t.textContent=s; return t; }

let tip;
function tooltip(content, cx, cy) {
  if (!tip) {
    tip = document.createElement('div');
    tip.style.position='fixed'; tip.style.background='rgba(12,16,24,.95)';
    tip.style.border='1px solid #2a3545'; tip.style.padding='8px 10px'; tip.style.borderRadius='8px';
    tip.style.pointerEvents='none'; tip.style.color='#dce7f3'; tip.style.fontSize='12px';
    tip.style.whiteSpace='pre'; tip.style.boxShadow='0 8px 24px rgba(0,0,0,0.35)';
    document.body.appendChild(tip);
  }
  tip.textContent = content;
  tip.style.left = (cx + 12) + 'px';
  tip.style.top = (cy + 12) + 'px';
  tip.style.display = 'block';
}
function hideTooltip(){ if (tip) tip.style.display='none'; }

function populateFilters(records){
  const bankSel = document.querySelector('#bank');
  const tipoSel = document.querySelector('#tipoTasa');
  const banks = unique(records.map(r=>r.banco)).sort();
  const tipos = unique(records.map(r=>r.tipo_tasa).filter(Boolean)).sort();
  for (const b of banks) {
    const o = document.createElement('option'); o.value=b; o.textContent=b; bankSel.appendChild(o);
  }
  for (const t of tipos) {
    const o = document.createElement('option'); o.value=t; o.textContent=t; tipoSel.appendChild(o);
  }
}

let sortKey = 'tasa';
let sortAsc = false;

async function main(){
  const all = await loadData();
  populateFilters(all);

  const state = { groupByBank: false };
  const controls = ['#search','#bank','#tipoTasa','#minRate'];
  controls.forEach(sel=> document.querySelector(sel).addEventListener('input', refresh));
  document.querySelector('#reset').addEventListener('click', ()=>{
    controls.forEach(sel=>{ const el=document.querySelector(sel); el.value=''; }); refresh();
  });
  document.querySelector('#groupByBank').addEventListener('change', (e)=>{ state.groupByBank = e.target.checked; refresh(); });

  // Sorting handlers
  document.querySelectorAll('#table thead th').forEach(th=>{
    th.addEventListener('click', ()=>{
      const k = th.getAttribute('data-key');
      if (!k) return;
      if (sortKey===k) sortAsc = !sortAsc; else { sortKey = k; sortAsc = true; }
      refresh();
    });
  });

  function refresh(){
    const filtered = applyFilters(all);
    updateMetrics(filtered);
    const chartData = prepareChartData(filtered, state.groupByBank);
    renderBarChart(chartData);
    const dataCopy = filtered.slice();
    dataCopy.sort((a,b)=>{
      const va = a[sortKey]; const vb = b[sortKey];
      if (sortKey==='tasa') return (va - vb) * (sortAsc?1:-1);
      return String(va||'').localeCompare(String(vb||'')) * (sortAsc?1:-1);
    });
    renderTable(dataCopy);
  }

  refresh();
}

main().catch(err=>{
  console.error(err);
  const chart = document.querySelector('#chart');
  chart.innerHTML = `<div style="padding:16px;color:#ffb4c4">Error cargando datos: ${escapeHtml(err.message)}</div>`;
});
