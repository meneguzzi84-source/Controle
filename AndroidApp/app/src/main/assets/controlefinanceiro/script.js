const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const typeInput = document.getElementById('type');
const typeButtons = document.querySelectorAll('.type-btn');
const tableBody = document.getElementById('transaction-table-body');
const expenseReportBody = document.getElementById('expense-report-body');
const categoryChart = document.getElementById('category-chart');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');

const STORAGE_KEY = 'controleFinanceiroTransacoes';
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

function formatCurrency(value) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDate(date) {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

function saveTransactions() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function setTransactionType(type) {
  typeInput.value = type;
  typeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.type === type);
  });
}

function calculateSummary() {
  const income = transactions
    .filter((txn) => txn.type === 'income')
    .reduce((sum, txn) => sum + txn.amount, 0);
  const expense = transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((sum, txn) => sum + txn.amount, 0);
  const balance = income - expense;

  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);
  balanceEl.textContent = formatCurrency(balance);
}

function renderExpenseReport() {
  const expenses = transactions
    .filter((txn) => txn.type === 'expense')
    .sort((a, b) => b.amount - a.amount);

  expenseReportBody.innerHTML = '';

  if (expenses.length === 0) {
    expenseReportBody.innerHTML = `
      <tr>
        <td colspan="4" style="padding: 24px; text-align: center; color: #64748b;">
          Nenhuma despesa registrada ainda.
        </td>
      </tr>
    `;
    return;
  }

  expenses.forEach((transaction) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${transaction.description}</td>
      <td>${transaction.category}</td>
      <td class="value-expense">- ${formatCurrency(transaction.amount)}</td>
      <td>${formatDate(transaction.date)}</td>
    `;

    expenseReportBody.appendChild(row);
  });
}

function renderExpenseChart() {
  const totals = transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((acc, txn) => {
      const category = txn.category.trim() || 'Sem categoria';
      acc[category] = (acc[category] || 0) + txn.amount;
      return acc;
    }, {});

  const entries = Object.entries(totals).sort(([, a], [, b]) => b - a);
  categoryChart.innerHTML = '';

  if (entries.length === 0) {
    categoryChart.innerHTML = '<div class="empty-chart">Nenhuma despesa para exibir.</div>';
    return;
  }

  const maxValue = entries[0][1];

  entries.forEach(([category, amount]) => {
    const row = document.createElement('div');
    row.className = 'chart-row';
    const width = maxValue > 0 ? Math.round((amount / maxValue) * 100) : 0;

    row.innerHTML = `
      <div class="chart-row-label">
        <span>${category}</span>
        <span class="chart-value">${formatCurrency(amount)}</span>
      </div>
      <div class="chart-bar">
        <div class="chart-bar-fill" style="width:${width}%"></div>
      </div>
    `;

    categoryChart.appendChild(row);
  });
}

function renderTransactions() {
  tableBody.innerHTML = '';

  if (transactions.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="5" style="padding: 24px; text-align: center; color: #64748b;">
          Nenhuma transação registrada ainda.
        </td>
      </tr>
    `;
    return;
  }

  transactions.forEach((transaction) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="description-cell">
        <span>${transaction.description}</span>
        ${transaction.type === 'expense' ? `<button class="edit-btn edit-description-btn" aria-label="Editar descrição" data-id="${transaction.id}">✎</button>` : ''}
      </td>
      <td class="category-cell">
        <span>${transaction.category}</span>
        ${transaction.type === 'expense' ? `<button class="edit-btn edit-category-btn" aria-label="Editar categoria" data-id="${transaction.id}">✎</button>` : ''}
      </td>
      <td class="${transaction.type === 'income' ? 'value-income' : 'value-expense'}">
        ${transaction.type === 'income' ? '+' : '-'} ${formatCurrency(transaction.amount)}
      </td>
      <td>${formatDate(transaction.date)}</td>
      <td>
        <button class="delete-btn" aria-label="Remover transação" data-id="${transaction.id}">
          🗑
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function addTransaction(event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const category = categoryInput.value.trim();
  const amount = Number(amountInput.value);
  const type = typeInput.value;

  if (!description || !category || !amount || amount === 0) {
    alert('Preencha todos os campos com valores válidos.');
    return;
  }

  transactions.unshift({
    id: Date.now().toString(),
    description,
    category,
    amount: Math.abs(amount),
    type,
    date: new Date().toISOString(),
  });

  saveTransactions();
  renderTransactions();
  calculateSummary();
  renderExpenseReport();
  renderExpenseChart();
  form.reset();
  descriptionInput.focus();
}

function editField(id, field, label) {
  const transaction = transactions.find((transaction) => transaction.id === id);
  if (!transaction) return;

  const currentValue = transaction[field] || '';
  const newValue = prompt(`Editar ${label} da despesa:`, currentValue);
  if (newValue === null) return;

  const trimmedValue = newValue.trim();
  if (!trimmedValue) {
    alert(`${label} não pode ficar vazia.`);
    return;
  }

  transaction[field] = trimmedValue;
  saveTransactions();
  renderTransactions();
  renderExpenseReport();
  renderExpenseChart();
}

function editCategory(id) {
  editField(id, 'category', 'categoria');
}

function editDescription(id) {
  editField(id, 'description', 'descrição');
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  saveTransactions();
  renderTransactions();
  calculateSummary();
  renderExpenseReport();
  renderExpenseChart();
}

function handleTableClick(event) {
  const editDescriptionButton = event.target.closest('.edit-description-btn');
  if (editDescriptionButton) {
    editDescription(editDescriptionButton.dataset.id);
    return;
  }

  const editCategoryButton = event.target.closest('.edit-category-btn');
  if (editCategoryButton) {
    editCategory(editCategoryButton.dataset.id);
    return;
  }

  const button = event.target.closest('.delete-btn');
  if (!button) return;

  const transactionId = button.dataset.id;
  removeTransaction(transactionId);
}

form.addEventListener('submit', addTransaction);
typeButtons.forEach((button) => {
  button.addEventListener('click', () => setTransactionType(button.dataset.type));
});
tableBody.addEventListener('click', handleTableClick);

setTransactionType(typeInput.value);
renderTransactions();
calculateSummary();
renderExpenseReport();
renderExpenseChart();
