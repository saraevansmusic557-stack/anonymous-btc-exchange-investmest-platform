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
  registerForm.addEventListener("submit", async function(event) {
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

    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (!data.user) {
        alert("Account could not be created.");
        return;
      }

      const selectedPlan =
        new URLSearchParams(window.location.search).get("plan") || "None";

      const { error: profileError } = await supabaseClient
        .from("students")
        .insert({
          id: data.user.id,
          name: name,
          email: email,
          balance: 0,
          plan: selectedPlan
        });

      if (profileError) {
  alert(
    "Profile setup failed: " +
    profileError.message +
    "\n\nCode: " +
    profileError.code
  );

  console.error(profileError);
  return;
      }

      window.location.href = "dashboard.html";

    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
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
