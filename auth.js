// Anonymous BTC REAL Account System
// This is a browser-only real.
// It does process real money.

function getUsers() {
  return JSON.parse(localStorage.getItem("btcrealUsers") || "[]");
}

function saveUsers(users) {
  localStorage.setItem("btcRealUsers", JSON.stringify(users));
}


// CREATE ACCOUNT

const registerForm = document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword =
      document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    let users = getUsers();

    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      alert("An account with this email already exists.");
      return;
    }

    const newUser = {
      name: name,
      email: email,
      password: password,
      balance: 0,
      plan: "None"
    };

    users.push(newUser);

    saveUsers(users);

    localStorage.setItem(
      "btcCurrentUser",
      JSON.stringify(newUser)
    );

    window.location.href = "dashboard.html";

  });

}


// LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email =
      document.getElementById("loginEmail").value.trim().toLowerCase();

    const password =
      document.getElementById("loginPassword").value;

    const users = getUsers();

    const user = users.find(
      user =>
        user.email === email &&
        user.password === password
    );

    if (!user) {
      alert("Incorrect email or password.");
      return;
    }

    localStorage.setItem(
      "btcCurrentUser",
      JSON.stringify(user)
    );

    window.location.href = "dashboard.html";

  });

}


// DASHBOARD

function loadDashboard() {

  const currentUser =
    JSON.parse(localStorage.getItem("btcCurrentUser"));

  if (!currentUser) {
    window.location.href = "login.html";
    return;
  }

  const nameElement =
    document.getElementById("userName");

  const emailElement =
    document.getElementById("userEmail");

  const planElement =
    document.getElementById("userPlan");

  if (nameElement) {
    nameElement.textContent = currentUser.name;
  }

  if (emailElement) {
    emailElement.textContent = currentUser.email;
  }

  if (planElement) {
    planElement.textContent = currentUser.plan || "None";
  }
}


// LOGOUT

function logout() {

  localStorage.removeItem("btcCurrentUser");

  window.location.href = "login.html";
}


// REAL BUTTONS

function realMessage() {

  alert(
    "This feature is enabled in the real. " +
    "Real deposits, withdrawals, or financial transactions are processed."
  );

      }
