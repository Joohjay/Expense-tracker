document.addEventListener("DOMContentLoaded", () => {
    const expenseForm = document.getElementById("expense-form");
    const expenseList = document.getElementById("expense-list");
    const totalExpense = document.getElementById("total-expense");
    const themeToggle = document.getElementById("theme-toggle");
  
    let expenses = [];
  
    // Load and apply saved theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      document.body.classList.add("dark-mode");
    }
  
    // Toggle theme and save preference
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark-mode");
      const isDarkMode = document.body.classList.contains("dark-mode");
      localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    });
  
    // Function to update the total expense
    function updateTotal() {
      const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      totalExpense.textContent = total.toFixed(2);
    }
  
    // Function to render the expense list
    function renderExpenses() {
      expenseList.innerHTML = "";
      expenses.forEach((expense, index) => {
        const expenseItem = document.createElement("div");
        expenseItem.className = "expense-item";
        expenseItem.innerHTML = `
          <span>${expense.name} - $${expense.amount} (${expense.category})</span>
          <button data-index="${index}">Delete</button>
        `;
        expenseList.appendChild(expenseItem);
      });
    }
  
    // Handle form submission
    expenseForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = document.getElementById("expense-name").value;
      const amount = parseFloat(document.getElementById("expense-amount").value);
      const category = document.getElementById("expense-category").value;
  
      if (name && amount > 0) {
        expenses.push({ name, amount, category });
        updateTotal();
        renderExpenses();
        expenseForm.reset();
      }
    });
  
    // Handle delete button click
    expenseList.addEventListener("click", (e) => {
      if (e.target.tagName === "BUTTON") {
        const index = e.target.getAttribute("data-index");
        expenses.splice(index, 1);
        updateTotal();
        renderExpenses();
      }
    });
  });