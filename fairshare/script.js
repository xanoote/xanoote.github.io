document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const income1Input = document.getElementById('income1');
    const income2Input = document.getElementById('income2');
    const totalIncomeSpan = document.getElementById('total-income');
    const p1PercentSpan = document.getElementById('p1-percent');
    const p2PercentSpan = document.getElementById('p2-percent');

    // New Custom Currency Selector Elements
    const currencyTrigger = document.getElementById('currency-trigger');
    const currencyOptions = document.getElementById('currency-options');
    const currencyDisplay = document.getElementById('current-currency-display');
    const currencyOptionElements = document.querySelectorAll('.currency-option');

    const expensesList = document.getElementById('expenses-list');
    const addExpenseBtn = document.getElementById('add-expense-btn');
    const totalExpensesSpan = document.getElementById('total-expenses');

    const p1FinalShareSpan = document.getElementById('p1-final-share');
    const p2FinalShareSpan = document.getElementById('p2-final-share');

    // Currency State
    let currentCurrency = 'USD';

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
        // Convert everything to "cents" (multiply by 100) to perform integer arithmetic
        const inc1Cents = Math.round((parseFloat(income1Input.value) || 0) * 100);
        const inc2Cents = Math.round((parseFloat(income2Input.value) || 0) * 100);
        const totalIncomeCents = inc1Cents + inc2Cents;

        let p1Percent = 0;
        let p2Percent = 0;

        if (totalIncomeCents > 0) {
            p1Percent = (inc1Cents / totalIncomeCents) * 100;
            p2Percent = (inc2Cents / totalIncomeCents) * 100;
        }

        // Update Income Stats
        totalIncomeSpan.textContent = formatCurrency(totalIncomeCents / 100);
        p1PercentSpan.textContent = `${p1Percent.toFixed(2)}%`;
        p2PercentSpan.textContent = `${p2Percent.toFixed(2)}%`;

        // Calculate Total Expenses in cents
        let totalExpensesCents = 0;
        const expenseInputs = document.querySelectorAll('.expense-amount');
        expenseInputs.forEach(input => {
            totalExpensesCents += Math.round((parseFloat(input.value) || 0) * 100);
        });

        totalExpensesSpan.textContent = formatCurrency(totalExpensesCents / 100);

        // Final Share Calculation
		const p1PercentRounded = parseFloat(p1Percent.toFixed(2));
		const p2PercentRounded = parseFloat(p2Percent.toFixed(2));
        const p1ShareCents = totalIncomeCents > 0
            ? Math.round(totalExpensesCents * (p1PercentRounded / 100))
            : 0;
        const p2ShareCents = totalIncomeCents > 0
            ? Math.round(totalExpensesCents * (p2PercentRounded / 100))
            : 0;

        p1FinalShareSpan.textContent = formatCurrency(p1ShareCents / 100);
        p2FinalShareSpan.textContent = formatCurrency(p2ShareCents / 100);
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

    // --- Currency Auto-Detection Logic ---
    function detectDefaultCurrency() {
        const lang = navigator.language || navigator.userLanguage;
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

    // --- Listeners ---
    income1Input.addEventListener('input', calculate);
    income2Input.addEventListener('input', calculate);

    // Custom Select Logic
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

    addExpenseBtn.addEventListener('click', () => {
        expensesList.appendChild(createExpenseRow());
        calculate();
    });

    // Initialization
    initExpenses();
    updateCurrencyUI(detectDefaultCurrency());
    calculate();
});
