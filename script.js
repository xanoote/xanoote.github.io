document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Core Containers
    const currencyTrigger = document.getElementById('currency-trigger');
    const currencyOptions = document.getElementById('currency-options');
    const currencyDisplay = document.getElementById('current-currency-display');
    const currencyOptionElements = document.querySelectorAll('.currency-option');

    const personsContainer = document.getElementById('persons-container');
    const incomeStatsContainer = document.getElementById('income-stats-container');
    const addPersonBtn = document.getElementById('add-person-btn');

    const expensesList = document.getElementById('expenses-list');
    const addExpenseBtn = document.getElementById('add-expense-btn');

    const resultsContainer = document.getElementById('results-container');

    // Currency State
    let currentCurrency = 'USD';

    // Dynamic Persons Data Model
    let persons = [
        { id: 0, name: 'Person 01', income: 0 },
        { id: 1, name: 'Person 02', income: 0 }
    ];
    let nextPersonId = 2;

    // Initial State
    let expenses = [
        { name: 'Rent/Mortgage', amount: 0 },
        { name: 'Groceries', amount: 0 },
        { name: 'Utilities', amount: 0 },
        { name: 'Internet', amount: 0 },
        { name: 'Insurance', amount: 0 },
    ];

    function formatCurrency(value) {
        return new Intl.NumberFormat(getLanguageFromCurrency(currentCurrency), { style: 'currency', currency: currentCurrency }).format(value);
    }

    function calculate() {
        // Calculate income in cents for each person
        const personIncomes = persons.map(person => {
            const input = document.querySelector(`input[data-person-id="${person.id}"]`);
            return {
                id: person.id,
                cents: Math.round((parseFloat(input?.value) || 0) * 100)
            };
        });

        // Total income in cents
        const totalIncomeCents = personIncomes.reduce((sum, p) => sum + p.cents, 0);

        // Calculate percentages for each person
        const personPercentages = personIncomes.map(p => ({
            id: p.id,
            percent: totalIncomeCents > 0 ? (p.cents / totalIncomeCents) * 100 : 0
        }));

        // Update total income display
        const totalIncomeSpan = document.getElementById('total-income');
        if (totalIncomeSpan) {
            totalIncomeSpan.textContent = formatCurrency(totalIncomeCents / 100);
        }

        // Update income percentage stats for each person
        personPercentages.forEach(pp => {
            const percentSpan = document.querySelector(`span[data-person-percent-id="${pp.id}"]`);
            if (percentSpan) {
                percentSpan.textContent = `${pp.percent.toFixed(2)}%`;
            }
        });

        // Calculate total expenses in cents
        let totalExpensesCents = 0;
        const expenseInputs = document.querySelectorAll('.expense-amount');
        expenseInputs.forEach(input => {
            totalExpensesCents += Math.round((parseFloat(input.value) || 0) * 100);
        });

        const totalExpensesSpanElement = document.getElementById('total-expenses');
        if (totalExpensesSpanElement) {
            totalExpensesSpanElement.textContent = formatCurrency(totalExpensesCents / 100);
        }

        // Calculate final shares for each person
        personPercentages.forEach(pp => {
            const percentRounded = parseFloat(pp.percent.toFixed(2));
            const shareCents = totalIncomeCents > 0
                ? Math.round(totalExpensesCents * (percentRounded / 100))
                : 0;

            const shareSpan = document.querySelector(`div[data-person-share-id="${pp.id}"]`);
            if (shareSpan) {
                shareSpan.textContent = formatCurrency(shareCents / 100);
            }
        });
    }

    function createExpenseRow(name = '', amount = 0) {
        const row = document.createElement('div');
        row.className = 'expense-item';

        row.innerHTML = `
            <input type="text" class="expense-name" placeholder="Expense name" value="${name}">
            <input type="number" class="expense-amount" placeholder="Amount" value="${amount}" min="0">
            <button class="remove-btn" title="Remove expense">×</button>
        `;

        const removeBtn = row.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            row.remove();
            calculate();
        });

        const amountInput = row.querySelector('.expense-amount');
        amountInput.addEventListener('input', calculate);

        return row;
    }

    function initExpenses() {
        expensesList.innerHTML = '';
        expenses.forEach(exp => {
            expensesList.appendChild(createExpenseRow(exp.name, exp.amount));
        });
    }

    function renderPersonInputs() {
        personsContainer.innerHTML = '';

        persons.forEach((person) => {
            const inputField = document.createElement('div');
            inputField.className = 'input-field';

            const label = document.createElement('label');
            label.textContent = person.name;

            const input = document.createElement('input');
            input.type = 'number';
            input.className = 'person-income-input';
            input.setAttribute('data-person-id', person.id);
            input.value = person.income || 0;
            input.placeholder = '0.00';
            input.min = '0';
            input.addEventListener('input', (e) => {
                // Update the persons data model with the new income value
                const personObj = persons.find(p => p.id === person.id);
                if (personObj) {
                    personObj.income = parseFloat(e.target.value) || 0;
                }
                calculate();
            });

            inputField.appendChild(label);
            inputField.appendChild(input);
            personsContainer.appendChild(inputField);
        });
    }

    function renderIncomeStats() {
        incomeStatsContainer.innerHTML = '';

        // Total combined stat box
        const totalBox = document.createElement('div');
        totalBox.className = 'stat-box';
        totalBox.innerHTML = `
            <span class="stat-label">Total Combined</span>
            <span class="stat-value" id="total-income">0</span>
        `;
        incomeStatsContainer.appendChild(totalBox);

        // Ratio stat box for each person
        persons.forEach(person => {
            const ratioBox = document.createElement('div');
            ratioBox.className = 'stat-box p-ratio-box';
            ratioBox.innerHTML = `
                <span class="stat-label">${person.name} Ratio</span>
                <span class="stat-value" data-person-percent-id="${person.id}">0%</span>
            `;
            incomeStatsContainer.appendChild(ratioBox);
        });
    }

    function renderResults() {
        resultsContainer.innerHTML = '';

        persons.forEach(person => {
            const resultBox = document.createElement('div');
            resultBox.className = 'result-box';
            resultBox.innerHTML = `
                <span class="result-label">${person.name} Contribution</span>
                <div class="result-amount" data-person-share-id="${person.id}">0</div>
            `;
            resultsContainer.appendChild(resultBox);
        });
    }

    function addPerson() {
        persons.push({ id: nextPersonId, name: `Person ${String(nextPersonId + 1).padStart(2, '0')}`, income: 0 });
        nextPersonId++;

        renderPersonInputs();
        renderIncomeStats();
        renderResults();
        calculate();
    }
// --- Currency Auto-Detection Logic ---
    function detectDefaultCurrency() {
        const lang = navigator.language || 'en-US';
        if (lang.startsWith('sv-SE')) return 'SEK';
        if (lang.startsWith('no-NO')) return 'NOK';
        if (lang.startsWith('da-DK')) return 'DKK';
        if (lang.startsWith('en-US')) return 'USD';
        return 'EUR';
    }
	
	function getLanguageFromCurrency(currency) {
        if (currency.startsWith('SEK')) return 'sv-SE';
        if (currency.startsWith('NOK')) return 'no-NO';
        if (currency.startsWith('DKK')) return 'da-DK';
        return 'en-US';
    }

    function updateCurrencyUI(currency) {
        currentCurrency = currency;

        // Map currency code to readable label
        const labels = {
            'USD': 'USD ($)',
            'EUR': 'EUR (€)',
            'SEK': 'SEK (kr)',
            'NOK': 'NOK (kr)',
            'DKK': 'DKK (kr)'
        };
        currencyDisplay.textContent = labels[currency] || currency;

        // Update active class in options
        currencyOptionElements.forEach(opt => {
            opt.classList.toggle('active', opt.dataset.value === currency);
        });

        calculate();
    }

    // --- Currency Selector Listeners ---
    currencyTrigger.addEventListener('click', () => {
        currencyOptions.classList.toggle('open');
    });

    currencyOptionElements.forEach(option => {
        option.addEventListener('click', () => {
            updateCurrencyUI(option.dataset.value);
            currencyOptions.classList.remove('open');
        });
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!currencyTrigger.contains(e.target) && !currencyOptions.contains(e.target)) {
            currencyOptions.classList.remove('open');
        }
    });

    // --- Expense & Person Management Listeners ---
    addExpenseBtn.addEventListener('click', () => {
        expensesList.appendChild(createExpenseRow());
        calculate();
    });

    addPersonBtn.addEventListener('click', addPerson);

    // --- Initialization ---
    renderPersonInputs();
    renderIncomeStats();
    renderResults();
    initExpenses();
    updateCurrencyUI(detectDefaultCurrency());
    calculate();
});
