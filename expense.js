document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalExpense = document.getElementById("total-expense");
    const themeToggle = document.getElementById("theme-toggle");
    const filterNameInput = document.getElementById("filter-name");
    const filterAmountInput = document.getElementById("filter-amount");
    const filterButton = document.getElementById("filter-button");
    const remindersList = document.getElementById("reminders-list");
  
    // Manage expenses in a class for better structure
    class ExpenseManager {
      constructor() {
        this.expenses = [];
        this.filteredExpenses = [];
      }
  
      addExpense(name, amount, category, date) {
        this.expenses.push({ name, amount, category, date });
      }
  
      deleteExpense(index) {
        this.expenses.splice(index, 1);
      }
  
      filterExpenses(filterName, filterAmount) {
        this.filteredExpenses = this.expenses.filter((expense) => {
          const matchesName = filterName ? expense.name.toLowerCase().includes(filterName) : true;
          const matchesAmount = !isNaN(filterAmount) ? expense.amount === filterAmount : true;
          return matchesName && matchesAmount;
        });
        return this.filteredExpenses;
      }
  
      getTotal(expensesToSum = this.expenses) {
        return expensesToSum.reduce((sum, expense) => sum + expense.amount, 0);
      }
  
      getUpcomingExpenses(days = 7) {
        const today = new Date();
        return this.expenses.filter((expense) => {
          const expenseDate = new Date(expense.date);
          const differenceInDays = (expenseDate - today) / (1000 * 60 * 60 * 24);
          return differenceInDays >= 0 && differenceInDays <= days;
        });
      }
    }
  
    const expenseManager = new ExpenseManager();
  
    // UI Utility Functions
    const renderExpenses = (expensesToRender = expenseManager.expenses) => {
      expenseList.innerHTML = "";
      const fragment = document.createDocumentFragment();
      expensesToRender.forEach((expense, index) => {
        const expenseItem = document.createElement("div");
        expenseItem.className = "expense-item";
        expenseItem.innerHTML = `
          <span>${expense.name} - $${expense.amount} (${expense.category}) - Due: ${expense.date}</span>
          <button data-index="${index}">Delete</button>
        `;
        fragment.appendChild(expenseItem);
      });
      expenseList.appendChild(fragment);
    };
  
    const renderReminders = () => {
      remindersList.innerHTML = "";
      const upcomingExpenses = expenseManager.getUpcomingExpenses();
      const fragment = document.createDocumentFragment();
      upcomingExpenses.forEach((expense) => {
        const reminderItem = document.createElement("div");
        reminderItem.className = "reminder-item";
        reminderItem.textContent = `${expense.name} is due on ${expense.date} - $${expense.amount}`;
        fragment.appendChild(reminderItem);
      });
      remindersList.appendChild(fragment);
    };
  
    const updateTotal = (expensesToSum = expenseManager.expenses) => {
      totalExpense.textContent = expenseManager.getTotal(expensesToSum).toFixed(2);
    };
  
    // Event Listeners
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDarkMode = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });
  
    expenseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("expense-name").value.trim();
      const amount = parseFloat(document.getElementById("expense-amount").value);
      const category = document.getElementById("expense-category").value;
      const date = document.getElementById("expense-date").value;
  
      if (!name || amount <= 0 || !date) {
        alert("Please enter valid expense details!");
        return;
      }
  
      expenseManager.addExpense(name, amount, category, date);
      updateTotal();
      renderExpenses();
      renderReminders();
      expenseForm.reset();
    });
  
    expenseList.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const index = e.target.getAttribute("data-index");
        expenseManager.deleteExpense(index);
        updateTotal();
        renderExpenses();
        renderReminders();
      }
    });
  
    filterButton.addEventListener("click", () => {
      const filterName = filterNameInput.value.toLowerCase();
      const filterAmount = parseFloat(filterAmountInput.value);
      const filteredExpenses = expenseManager.filterExpenses(filterName, filterAmount);
      renderExpenses(filteredExpenses);
      updateTotal(filteredExpenses);
    });
  
    // Initialize Theme
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark-mode");
    }
  });