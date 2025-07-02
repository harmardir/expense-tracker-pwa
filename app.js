function handleLogin(event) {
  event.preventDefault();
  const passwordInput = document.getElementById("password").value;
  const savedPassword = localStorage.getItem("password");

  if (!savedPassword) {
    // First-time password setup
    localStorage.setItem("password", passwordInput);
    localStorage.setItem("loggedIn", "true");
    showApp();
  } else {
    // Check password
    if (passwordInput === savedPassword) {
      localStorage.setItem("loggedIn", "true");
      showApp();
    } else {
      document.getElementById("login-error").style.display = "block";
    }
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  showLogin();
}

function showApp() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app-content").style.display = "block";
  updateUI();
}

function showLogin() {
  const savedPassword = localStorage.getItem("password");
  document.getElementById("login-title").textContent = savedPassword
    ? "Login"
    : "Set a Password";
  document.getElementById("login-button").textContent = savedPassword
    ? "Login"
    : "Set Password";
  document.getElementById("login-error").style.display = "none";
  document.getElementById("password").value = "";
  document.getElementById("login-screen").style.display = "block";
  document.getElementById("app-content").style.display = "none";
}

function resetApp() {
  if (confirm("This will erase all your data and reset the app. Continue?")) {
    localStorage.clear();
    location.reload();
  }
}


function logout() {
  localStorage.removeItem("loggedIn");
  showLogin();
}

function showApp() {
  document.getElementById("login-screen").style.display = "none";
  document.getElementById("app-content").style.display = "block";
  updateUI();
}

function showLogin() {
  document.getElementById("login-error").style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("login-screen").style.display = "block";
  document.getElementById("app-content").style.display = "none";
}

// === EXPENSE TRACKER SETUP ===
let entries = JSON.parse(localStorage.getItem('entries')) || [];

function updateUI() {
  let income = 0, expense = 0;
  const list = document.getElementById("history");
  list.innerHTML = "";

  [...entries].reverse().forEach((e, reversedIndex) => {
    const index = entries.length - 1 - reversedIndex;
    const li = document.createElement("li");
    li.innerHTML = `
  <div class="entry-left">
    <strong>${e.type.toUpperCase()}</strong> — ${e.description}<br />
    <small>${e.date}</small>
  </div>
  <div class="entry-right">
    <span>$${e.amount.toFixed(2)}</span>
    <button class="delete-btn" onclick="deleteEntry(${index})" title="Delete">
      🗑️
    </button>
  </div>
`;
    list.appendChild(li);

    if (e.type === 'income') income += e.amount;
    else expense += e.amount;
  });

  document.getElementById("income-total").textContent = income.toFixed(2);
  document.getElementById("expense-total").textContent = expense.toFixed(2);
  document.getElementById("balance").textContent = (income - expense).toFixed(2);
}

function showForm(type) {
  document.getElementById("entry-form").style.display = "block";
  document.getElementById("entry-type").value = type;
}

function saveEntry(event) {
  event.preventDefault();
  const type = document.getElementById("entry-type").value;
  const description = document.getElementById("description").value;
  const amount = parseFloat(document.getElementById("amount").value);

  entries.push({
    type,
    description,
    amount,
    date: new Date().toISOString().split("T")[0]
  });

  localStorage.setItem("entries", JSON.stringify(entries));
  event.target.reset();
  document.getElementById("entry-form").style.display = "none";
  updateUI();
}

function deleteEntry(index) {
  if (confirm("Delete this entry?")) {
    entries.splice(index, 1);
    localStorage.setItem("entries", JSON.stringify(entries));
    updateUI();
  }
}

function exportCSV() {
  let csv = "Type,Description,Amount,Date\n";
  entries.forEach(e => {
    csv += `${e.type},${e.description},${e.amount},${e.date}\n`;
  });

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "expense_history.csv";
  a.click();
}

function resetToHome() {
  document.getElementById("entry-form").style.display = "none";
  updateUI();
}


window.onload = () => {
  if (localStorage.getItem("loggedIn") === "true") {
    showApp();
  } else {
    showLogin();
  }

  document.getElementById("app-title").addEventListener("click", resetToHome);
};

// Register service worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

document.getElementById("app-title").addEventListener("click", resetToHome);

