const form = document.getElementById('transaction-form');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const destinationInput = document.getElementById('destination');
const typeInput = document.getElementById('type');
const typeButtons = document.querySelectorAll('.type-btn');
const expenseReportBody = document.getElementById('expense-report-body');
const categoryChart = document.getElementById('category-chart');
const transactionHistoryChart = document.getElementById('transaction-history-chart');
const balanceEl = document.getElementById('balance');
const incomeEl = document.getElementById('income');
const expenseEl = document.getElementById('expense');
const emergencyTotalEl = document.getElementById('emergency-total');
const investmentTotalEl = document.getElementById('investment-total');
const serviceTotalEl = document.getElementById('service-total');
const editAmountModal = document.getElementById('edit-amount-modal');
const editAmountInput = document.getElementById('edit-amount-input');
const cancelEditAmountButton = document.getElementById('cancel-edit-amount');
const saveEditAmountButton = document.getElementById('save-edit-amount');
const languageSelect = document.getElementById('language-select');
const clearTransactionsButton = document.getElementById('clear-transactions');

let editingAmountId = null;

const STORAGE_KEY = 'controleFinanceiroTransacoes';
const LANGUAGE_KEY = 'controleFinanceiroLanguage';
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
let currentLanguage = localStorage.getItem(LANGUAGE_KEY) || 'pt';

const translations = {
  pt: {
    title: 'Controle Financeiro',
    appName: 'Controle Financeiro',
    appHeadline: '💵 Organize suas finanças facilmente',
    appSubtitle: 'Adicione receitas e despesas, acompanhe seu saldo e visualize o histórico.',
    languageLabel: 'Idioma',
    balanceLabel: 'Saldo',
    incomeLabel: 'Entradas',
    serviceLabel: 'Prestações de serviços',
    expenseLabel: 'Saídas',
    emergencyLabel: 'Emergência',
    investmentLabel: 'Investimento',
    transactionLegend: 'Nova transação',
    description: 'Descrição',
    descriptionPlaceholder: 'Ex: Salário, Aluguel',
    value: 'Valor',
    valuePlaceholder: '0,00',
    category: 'Categoria',
    categoryPlaceholder: 'Ex: Alimentação',
    destination: 'Destino',
    destinationNormal: 'Normal',
    destinationEmergency: 'Emergência',
    destinationInvestment: 'Investimento',
    destinationService: 'Prestações de serviços',
    type: 'Tipo',
    entry: 'Entrada',
    expenseType: 'Saída',
    addTransaction: 'Adicionar transação',
    historyTitle: 'Histórico de transações',
    historyDesc: 'Toque no ícone de lixeira para remover uma transação.',
    reportTitle: 'Relatório de despesas',
    reportDesc: 'Veja as despesas em ordem do maior para o menor valor.',
    chartTitle: 'Despesas por categoria',
    chartDesc: 'Visualize o total gasto em cada categoria.',
    historyChartTitle: 'Histórico de entradas e saídas',
    historyChartDesc: 'Acompanhe cada lançamento em ordem cronológica.',
    noHistoryChart: 'Nenhum lançamento para exibir.',
    incomeSeries: 'Entrada',
    expenseSeries: 'Saída',
    footer: 'Desenvolvido por Marlon Meneguzzi',
    descriptionHeader: 'Descrição',
    categoryHeader: 'Categoria',
    destinationHeader: 'Destino',
    valueHeader: 'Valor',
    dateHeader: 'Data',
    modalTitle: 'Editar valor da transação',
    modalLabel: 'Valor',
    cancel: 'Cancelar',
    save: 'Salvar',
    alertFillAll: 'Preencha todos os campos com valores válidos.',
    alertInvalidValue: 'Informe um valor numérico maior que zero.',
    noTransactions: 'Nenhuma transação registrada ainda.',
    noExpenses: 'Nenhuma despesa registrada ainda.',
    noExpenseChart: 'Nenhuma despesa para exibir.',
      uncategorized: 'Sem categoria',
      editPromptPrefix: 'Editar',
      cannotBeEmpty: 'não pode ficar vazio',
    deleteTransactionLabel: 'Remover transação',
    editValueLabel: 'Editar valor',
    editCategoryLabel: 'Editar categoria',
    editDescriptionLabel: 'Editar descrição',
    clearHistory: 'Limpar histórico',
    clearHistoryConfirm: 'Confirma apagar todo o histórico de transações? Esta ação não pode ser desfeita.',
    clearTransactions: 'Limpar lançamentos',
    confirmEditAll: 'Confirma editar todas as despesas sequencialmente?'
  },
  en: {
    title: 'Financial Control',
    appName: 'Financial Control',
    appHeadline: '💵 Keep your finances organized easily',
    appSubtitle: 'Add income and expenses, track your balance, and view your history.',
    languageLabel: 'Language',
    balanceLabel: 'Balance',
    incomeLabel: 'Income',
    serviceLabel: 'Service income',
    expenseLabel: 'Expenses',
    emergencyLabel: 'Emergency',
    investmentLabel: 'Investment',
    transactionLegend: 'New transaction',
    description: 'Description',
    descriptionPlaceholder: 'Ex: Salary, Rent',
    value: 'Value',
    valuePlaceholder: '0.00',
    category: 'Category',
    categoryPlaceholder: 'Ex: Food',
    destination: 'Destination',
    destinationNormal: 'Normal',
    destinationEmergency: 'Emergency',
    destinationInvestment: 'Investment',
    destinationService: 'Service income',
    type: 'Type',
    entry: 'Income',
    expenseType: 'Expense',
    addTransaction: 'Add transaction',
    historyTitle: 'Transaction history',
    historyDesc: 'Tap the trash icon to remove a transaction.',
    reportTitle: 'Expense report',
    reportDesc: 'See expenses sorted from largest to smallest.',
    chartTitle: 'Expenses by category',
    chartDesc: 'View the total spent in each category.',
    historyChartTitle: 'Income and expense history',
    historyChartDesc: 'Follow each transaction in chronological order.',
    noHistoryChart: 'No transactions to show.',
    incomeSeries: 'Income',
    expenseSeries: 'Expense',
    footer: 'Built by Marlon Meneguzzi',
    descriptionHeader: 'Description',
    categoryHeader: 'Category',
    destinationHeader: 'Destination',
    valueHeader: 'Value',
    dateHeader: 'Date',
    modalTitle: 'Edit transaction amount',
    modalLabel: 'Value',
    cancel: 'Cancel',
    save: 'Save',
    alertFillAll: 'Please fill in all fields with valid values.',
    alertInvalidValue: 'Enter a numeric value greater than zero.',
    noTransactions: 'No transactions recorded yet.',
    noExpenses: 'No expenses recorded yet.',
    noExpenseChart: 'No expenses to show.',
    uncategorized: 'Uncategorized',
    editPromptPrefix: 'Edit',
    cannotBeEmpty: 'cannot be empty',
    deleteTransactionLabel: 'Remove transaction',
    editValueLabel: 'Edit amount',
    editCategoryLabel: 'Edit category',
    editDescriptionLabel: 'Edit description',
    clearHistory: 'Clear history',
    clearHistoryConfirm: 'Confirm delete all transaction history? This action cannot be undone.',
    clearTransactions: 'Clear transactions',
    confirmEditAll: 'Confirm edit all expenses sequentially?'
  },
  es: {
    title: 'Control Financiero',
    appName: 'Control Financiero',
    appHeadline: '💵 Organiza tus finanzas fácilmente',
    appSubtitle: 'Agrega ingresos y gastos, sigue tu saldo y visualiza el historial.',
    languageLabel: 'Idioma',
    balanceLabel: 'Saldo',
    incomeLabel: 'Ingresos',
    serviceLabel: 'Ingresos por servicios',
    expenseLabel: 'Gastos',
    emergencyLabel: 'Emergencia',
    investmentLabel: 'Inversión',
    transactionLegend: 'Nueva transacción',
    description: 'Descripción',
    descriptionPlaceholder: 'Ej: Salario, Alquiler',
    value: 'Valor',
    valuePlaceholder: '0,00',
    category: 'Categoría',
    categoryPlaceholder: 'Ej: Alimentación',
    destination: 'Destino',
    destinationNormal: 'Normal',
    destinationEmergency: 'Emergencia',
    destinationInvestment: 'Inversión',
    destinationService: 'Ingresos por servicios',
    type: 'Tipo',
    entry: 'Ingreso',
    expenseType: 'Gasto',
    addTransaction: 'Agregar transacción',
    historyTitle: 'Historial de transacciones',
    historyDesc: 'Toca el icono de la papelera para eliminar una transacción.',
    reportTitle: 'Informe de gastos',
    reportDesc: 'Ve los gastos ordenados de mayor a menor.',
    chartTitle: 'Gastos por categoría',
    chartDesc: 'Visualiza el total gastado en cada categoría.',
    historyChartTitle: 'Historial de ingresos y gastos',
    historyChartDesc: 'Sigue cada registro en orden cronológico.',
    noHistoryChart: 'No hay registros para mostrar.',
    incomeSeries: 'Ingreso',
    expenseSeries: 'Gasto',
    footer: 'Desarrollado por Marlon Meneguzzi',
    descriptionHeader: 'Descripción',
    categoryHeader: 'Categoría',
    destinationHeader: 'Destino',
    valueHeader: 'Valor',
    dateHeader: 'Fecha',
    modalTitle: 'Editar valor de la transacción',
    modalLabel: 'Valor',
    cancel: 'Cancelar',
    save: 'Guardar',
    alertFillAll: 'Completa todos los campos con valores válidos.',
    alertInvalidValue: 'Ingresa un valor numérico mayor que cero.',
    noTransactions: 'Ninguna transacción registrada aún.',
    noExpenses: 'Ningún gasto registrado aún.',
    noExpenseChart: 'No hay gastos para mostrar.',
    uncategorized: 'Sin categoría',
    editPromptPrefix: 'Editar',
    cannotBeEmpty: 'no puede estar vacío',
    deleteTransactionLabel: 'Eliminar transacción',
    editValueLabel: 'Editar valor',
    editCategoryLabel: 'Editar categoría',
    editDescriptionLabel: 'Editar descripción',
    clearHistory: 'Borrar historial',
    clearHistoryConfirm: '¿Confirma eliminar todo el historial de transacciones? Esta acción no se puede deshacer.',
    clearTransactions: 'Borrar registros',
    confirmEditAll: '¿Confirma editar todos los gastos de forma secuencial?'
  }
};

function t(key) {
  return translations[currentLanguage][key] || translations.pt[key] || key;
}

function translateTextNode(element, text) {
  const textNode = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
  if (textNode) {
    textNode.textContent = text;
  } else {
    element.textContent = text;
  }
}

function translateElement(element) {
  const key = element.dataset.i18n;
  if (!key) return;

  if (element.tagName === 'INPUT') {
    element.placeholder = t(key);
    return;
  }

  if (element.tagName === 'OPTION') {
    element.textContent = t(key);
    return;
  }

  if (element.tagName === 'BUTTON') {
    element.textContent = t(key);
    return;
  }

  if (element.tagName === 'SELECT') {
    return;
  }

  translateTextNode(element, t(key));
}

function updateTexts() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(translateElement);

  const placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
  placeholderElements.forEach((element) => {
    const key = element.dataset.i18nPlaceholder;
    if (!key) return;
    element.placeholder = t(key);
  });

  if (languageSelect) {
    languageSelect.value = currentLanguage;
  }

  const title = document.querySelector('title');
  if (title) {
    title.textContent = t('title');
  }

  document.documentElement.lang = currentLanguage === 'pt' ? 'pt-BR' : currentLanguage;
}

function saveLanguage(language) {
  currentLanguage = language;
  localStorage.setItem(LANGUAGE_KEY, language);
  updateTexts();
  calculateSummary();
  renderExpenseReport();
  renderExpenseChart();
}

function translateDestination(destination) {
  switch (destination) {
    case 'normal':
      return t('destinationNormal');
    case 'emergencia':
      return t('destinationEmergency');
    case 'investimento':
      return t('destinationInvestment');
    case 'prestacoes':
      return t('destinationService');
    default:
      return destination;
  }
}

function getDirectionSymbol(type) {
  return type === 'income' ? '+' : '-';
}

function formatCurrency(value) {
  return value.toLocaleString(currentLanguage === 'en' ? 'en-US' : currentLanguage === 'es' ? 'es-ES' : 'pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formatDate(date) {
  return new Intl.DateTimeFormat(currentLanguage === 'en' ? 'en-US' : currentLanguage === 'es' ? 'es-ES' : 'pt-BR', {
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
  const emergencyTotal = transactions
    .filter((txn) => txn.type === 'expense' && txn.destination === 'emergencia')
    .reduce((sum, txn) => sum + txn.amount, 0);
  const investmentTotal = transactions
    .filter((txn) => txn.type === 'expense' && txn.destination === 'investimento')
    .reduce((sum, txn) => sum + txn.amount, 0);
  const serviceTotal = transactions
    .filter((txn) => txn.type === 'income' && txn.destination === 'prestacoes')
    .reduce((sum, txn) => sum + txn.amount, 0);
  const balance = income - expense;

  incomeEl.textContent = formatCurrency(income);
  expenseEl.textContent = formatCurrency(expense);
  balanceEl.textContent = formatCurrency(balance);
  emergencyTotalEl.textContent = formatCurrency(emergencyTotal);
  investmentTotalEl.textContent = formatCurrency(investmentTotal);
  serviceTotalEl.textContent = formatCurrency(serviceTotal);
}

function renderExpenseReport() {
  const expenses = transactions
    .filter((txn) => txn.type === 'expense')
    .sort((a, b) => b.amount - a.amount);

  expenseReportBody.innerHTML = '';

  if (expenses.length === 0) {
    expenseReportBody.innerHTML = `
      <tr>
        <td colspan="6" style="padding: 24px; text-align: center; color: #64748b;">
          ${t('noExpenses')}
        </td>
      </tr>
    `;
    return;
  }

  expenses.forEach((transaction) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        ${transaction.description}
        <button class="delete-row-btn delete-in-description" aria-label="${t('deleteTransactionLabel')}" data-id="${transaction.id}">🗑</button>
      </td>
      <td>
        <button class="edit-category-btn" aria-label="${t('editCategoryLabel')}" data-id="${transaction.id}">✎</button>
        ${transaction.category}
      </td>
      <td>${translateDestination(transaction.destination)}</td>
      <td class="value-expense">
        <button class="edit-value-btn" aria-label="${t('editValueLabel')}" data-id="${transaction.id}">✎</button>
        - ${formatCurrency(transaction.amount)}
      </td>
      <td>${formatDate(transaction.date)}</td>
    `;

    expenseReportBody.appendChild(row);
  });
}

function editRow(id) {
  const transaction = transactions.find((t) => t.id === id);
  if (!transaction) return;

  const newDescription = prompt(`${t('editPromptPrefix')} ${t('description')}:`, transaction.description);
  if (newDescription === null) return;
  if (!newDescription.trim()) { alert(`${t('description')} ${t('cannotBeEmpty')}`); return; }
  transaction.description = newDescription.trim();

  const newCategory = prompt(`${t('editPromptPrefix')} ${t('category')}:`, transaction.category);
  if (newCategory === null) return;
  if (!newCategory.trim()) { alert(`${t('category')} ${t('cannotBeEmpty')}`); return; }
  transaction.category = newCategory.trim();

  const destPrompt = `${t('editPromptPrefix')} ${t('destination')} (normal, emergencia, investimento, prestacoes):`;
  const newDestination = prompt(destPrompt, transaction.destination);
  if (newDestination === null) return;
  transaction.destination = newDestination.trim() || transaction.destination;

  const rawAmount = prompt(`${t('editPromptPrefix')} ${t('value')}:`, transaction.amount.toString());
  if (rawAmount === null) return;
  const parsed = Number(rawAmount.replace(',', '.'));
  if (Number.isNaN(parsed) || parsed <= 0) { alert(t('alertInvalidValue')); return; }
  transaction.amount = Math.abs(parsed);

  const dateDefault = new Date(transaction.date).toISOString().slice(0, 10);
  const newDate = prompt(`${t('editPromptPrefix')} ${t('dateHeader')} (YYYY-MM-DD):`, dateDefault);
  if (newDate === null) return;
  const parsedDate = new Date(newDate);
  if (isNaN(parsedDate)) { alert('Data inválida'); return; }
  transaction.date = parsedDate.toISOString();

  saveTransactions();
  calculateSummary();
  renderExpenseReport();
  renderExpenseChart();
}

function renderExpenseChart() {
  renderTransactionHistoryChart();

  const totals = transactions
    .filter((txn) => txn.type === 'expense')
    .reduce((acc, txn) => {
      const category = txn.category.trim() || t('uncategorized');
      acc[category] = (acc[category] || 0) + txn.amount;
      return acc;
    }, {});

  const entries = Object.entries(totals).sort(([, a], [, b]) => b - a);
  categoryChart.innerHTML = '';

  if (entries.length === 0) {
    categoryChart.innerHTML = `<div class="empty-chart">${t('noExpenseChart')}</div>`;
    return;
  }

  const total = entries.reduce((sum, [, amount]) => sum + amount, 0);
  const colors = ['#fde68a', '#86efac', '#38bdf8', '#a78bfa', '#fb7185', '#f97316', '#22c55e', '#0ea5e9'];

  const cascadeChart = document.createElement('div');
  cascadeChart.className = 'cascade-chart';

  entries.forEach(([category, amount], index) => {
    const percent = amount / total;
    const widthPercent = Math.max(percent * 100, 6);
    const color = colors[index % colors.length];

    const row = document.createElement('div');
    row.className = 'cascade-row';
    row.innerHTML = `
      <div class="cascade-meta">
        <span class="cascade-label">${category}</span>
        <span class="cascade-value">${formatCurrency(amount)} · ${((percent * 100).toFixed(1))}%</span>
      </div>
      <div class="cascade-bar-wrapper">
        <div class="cascade-bar" style="width: ${widthPercent}%; background: ${color};"></div>
      </div>
    `;

    cascadeChart.appendChild(row);
  });

  const legend = document.createElement('div');
  legend.className = 'chart-legend';

  entries.forEach(([category, amount], index) => {
    const color = colors[index % colors.length];
    const percent = ((amount / total) * 100).toFixed(1);
    const item = document.createElement('div');
    item.className = 'legend-item';
    item.innerHTML = `
      <span class="legend-color" style="background:${color};"></span>
      <div class="legend-info">
        <span class="legend-label">${category}</span>
        <span class="legend-value">${formatCurrency(amount)} · ${percent}%</span>
      </div>
    `;
    legend.appendChild(item);
  });

  categoryChart.appendChild(cascadeChart);
  categoryChart.appendChild(legend);
}

function renderTransactionHistoryChart() {
  const chronologicalTransactions = [...transactions]
    .sort((first, second) => new Date(first.date) - new Date(second.date));

  transactionHistoryChart.innerHTML = '';

  if (chronologicalTransactions.length === 0) {
    transactionHistoryChart.innerHTML = `<div class="empty-chart">${t('noHistoryChart')}</div>`;
    return;
  }

  const largestAmount = Math.max(...chronologicalTransactions.map((transaction) => transaction.amount));
  const chart = document.createElement('div');
  chart.className = 'history-bars';

  chronologicalTransactions.forEach((transaction) => {
    const isIncome = transaction.type === 'income';
    const width = Math.max((transaction.amount / largestAmount) * 100, 4);
    const row = document.createElement('div');
    row.className = 'history-bar-row';
    row.innerHTML = `
      <div class="history-bar-meta">
        <span class="history-bar-label">${transaction.description}</span>
        <span class="history-bar-date">${formatDate(transaction.date)}</span>
      </div>
      <div class="history-bar-track">
        <div class="history-bar ${isIncome ? 'history-bar-income' : 'history-bar-expense'}" style="width: ${width}%;">
          ${isIncome ? '+' : '-'} ${formatCurrency(transaction.amount)}
        </div>
      </div>
    `;
    chart.appendChild(row);
  });

  const legend = document.createElement('div');
  legend.className = 'history-chart-legend';
  legend.innerHTML = `
    <span><i class="history-legend-income"></i>${t('incomeSeries')}</span>
    <span><i class="history-legend-expense"></i>${t('expenseSeries')}</span>
  `;

  transactionHistoryChart.appendChild(chart);
  transactionHistoryChart.appendChild(legend);
}

// Histórico de transações (tabela) removido — mantemos apenas relatórios e gráficos

function addTransaction(event) {
  event.preventDefault();

  const description = descriptionInput.value.trim();
  const category = categoryInput.value.trim();
  const rawAmount = (amountInput.value || '').toString().trim();
  const amount = Number(rawAmount.replace(',', '.'));
  const type = typeInput.value;
  const destination = destinationInput.value || 'normal';

  if (!description || !category || Number.isNaN(amount) || amount <= 0) {
    alert(t('alertFillAll'));
    return;
  }

  transactions.unshift({
    id: Date.now().toString(),
    description,
    category,
    destination,
    amount: Math.abs(amount),
    type,
    date: new Date().toISOString(),
  });

  saveTransactions();
  calculateSummary();
  renderExpenseReport();
  renderExpenseChart();
  form.reset();
  descriptionInput.focus();
}

// clearHistory removed when history UI was removed

function editField(id, field, labelKey) {
  const transaction = transactions.find((transaction) => transaction.id === id);
  if (!transaction) return;

  const labelText = t(labelKey);
  const promptText = `${t('editPromptPrefix')} ${labelText}:`;
  const currentValue = transaction[field] || '';
  const newValue = prompt(promptText, currentValue);
  if (newValue === null) return;

  const trimmedValue = newValue.trim();
  if (!trimmedValue) {
    alert(`${labelText} ${t('cannotBeEmpty')}`);
    return;
  }

  transaction[field] = trimmedValue;
  saveTransactions();
  renderExpenseReport();
  renderExpenseChart();
}

function editCategory(id) {
  editField(id, 'category', 'category');
}

function editDescription(id) {
  editField(id, 'description', 'description');
}

function openEditAmountModal(id) {
  const transaction = transactions.find((transaction) => transaction.id === id);
  if (!transaction) return;

  editingAmountId = id;
  editAmountInput.value = transaction.amount.toFixed(2);
  editAmountModal.classList.remove('hidden');
  editAmountModal.setAttribute('aria-hidden', 'false');
  editAmountInput.focus();
}

function closeEditAmountModal() {
  editingAmountId = null;
  editAmountInput.value = '';
  editAmountModal.classList.add('hidden');
  editAmountModal.setAttribute('aria-hidden', 'true');
}

function editAmount(id) {
  openEditAmountModal(id);
}

function saveEditedAmount() {
  if (!editingAmountId) return;

  const parsedValue = Number(editAmountInput.value.replace(',', '.'));
  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    alert(t('alertInvalidValue'));
    editAmountInput.focus();
    return;
  }

  if (parsedValue === 0) {
    removeTransaction(editingAmountId);
    closeEditAmountModal();
    return;
  }

  const transaction = transactions.find((transaction) => transaction.id === editingAmountId);
  if (!transaction) return;

  transaction.amount = Math.abs(parsedValue);
  saveTransactions();
  calculateSummary();
  renderExpenseReport();
  renderExpenseChart();
  closeEditAmountModal();
}

function removeTransaction(id) {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  saveTransactions();
  calculateSummary();
  renderExpenseReport();
  renderExpenseChart();
}

function clearTransactions() {
  if (!confirm(t('clearHistoryConfirm'))) return;

  transactions = [];
  saveTransactions();
  calculateSummary();
  renderExpenseReport();
  renderExpenseChart();
}

// table interactions removed with history UI

form.addEventListener('submit', addTransaction);
typeButtons.forEach((button) => {
  button.addEventListener('click', () => setTransactionType(button.dataset.type));
});
cancelEditAmountButton.addEventListener('click', closeEditAmountModal);
saveEditAmountButton.addEventListener('click', saveEditedAmount);
clearTransactionsButton.addEventListener('click', clearTransactions);
editAmountModal.addEventListener('click', (event) => {
  if (event.target.matches('[data-modal-close]')) {
    closeEditAmountModal();
  }
});

if (languageSelect) {
  languageSelect.addEventListener('change', () => saveLanguage(languageSelect.value));
}

// clear history button removed from HTML

window.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !editAmountModal.classList.contains('hidden')) {
    closeEditAmountModal();
  }
});

// Handle edit/delete clicks in the expense report table
if (expenseReportBody) {
  expenseReportBody.addEventListener('click', (event) => {
    const categoryBtn = event.target.closest('.edit-category-btn');
    if (categoryBtn) {
      editCategory(categoryBtn.dataset.id);
      return;
    }

    const valueBtn = event.target.closest('.edit-value-btn');
    if (valueBtn) {
      editAmount(valueBtn.dataset.id);
      return;
    }

    const delBtn = event.target.closest('.delete-row-btn');
    if (delBtn) {
      removeTransaction(delBtn.dataset.id);
      return;
    }
  });
}


updateTexts();
setTransactionType(typeInput.value);
calculateSummary();
renderExpenseReport();
renderExpenseChart();
