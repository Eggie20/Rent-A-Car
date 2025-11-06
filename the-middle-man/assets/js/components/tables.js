// Client-side table utilities
(function () {
  function initDataTable(container, data, columns, options = {}) {
    // container: HTMLElement or selector
    const root = typeof container === 'string' ? document.querySelector(container) : container;
    if (!root) return { destroy() {} };
    root.innerHTML = '';

    const state = { page: 1, pageSize: options.pageSize || 10, sortKey: null, sortDir: 'asc', filter: '' };

    const toolbar = root.previousElementSibling?.classList.contains('table-toolbar') ? root.previousElementSibling : null;
    if (toolbar) {
      const input = toolbar.querySelector('input[type="search"]');
      if (input) input.addEventListener('input', (e) => { state.filter = e.target.value.trim().toLowerCase(); render(); });
      const exportBtn = toolbar.querySelector('[data-action="export"]');
      if (exportBtn) exportBtn.addEventListener('click', () => exportCSV(filtered(), 'export.csv'));
    }

    function filtered() {
      if (!state.filter) return data.slice();
      return data.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(state.filter)));
    }

    function sort(rows) {
      if (!state.sortKey) return rows;
      const dir = state.sortDir === 'asc' ? 1 : -1;
      return rows.sort((a, b) => (a[state.sortKey] > b[state.sortKey] ? dir : -dir));
    }

    function paginate(rows) {
      const start = (state.page - 1) * state.pageSize;
      return rows.slice(start, start + state.pageSize);
    }

    function render() {
      const table = document.createElement('table');
      table.className = 'table';
      const thead = document.createElement('thead');
      const tr = document.createElement('tr');
      columns.forEach(col => {
        const th = document.createElement('th');
        th.textContent = col.label;
        th.tabIndex = 0;
        th.addEventListener('click', () => {
          state.sortKey = col.key;
          state.sortDir = state.sortDir === 'asc' ? 'desc' : 'asc';
          render();
        });
        tr.appendChild(th);
      });
      thead.appendChild(tr);
      table.appendChild(thead);
      const tbody = document.createElement('tbody');
      const rows = paginate(sort(filtered()));
      rows.forEach(row => {
        const r = document.createElement('tr');
        columns.forEach(col => {
          const td = document.createElement('td');
          td.textContent = typeof col.render === 'function' ? col.render(row[col.key], row) : row[col.key];
          r.appendChild(td);
        });
        tbody.appendChild(r);
      });
      table.appendChild(tbody);
      root.replaceChildren(table);
    }

    function exportCSV(rows, filename) {
      const cols = columns.map(c => c.label);
      const text = [cols.join(',')]
        .concat(rows.map(r => columns.map(c => JSON.stringify(r[c.key] ?? '')).join(',')))
        .join('\n');
      const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    }

    render();
    return { render };
  }

  window.initDataTable = initDataTable;
})();
