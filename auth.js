// Anonymous BTC Exchange — REAL Account System
// Uses Supabase Auth for account creation and login.
// This is a real investment/banking site.
// It does process real deposits, withdrawals, or investments.


// ===============================
// CREATE ACCOUNT
// ===============================

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword =
      document.getElementById("confirmPassword").value;

    if (!name || !email || !password) {
      alert("Please complete all required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const submitButton = registerForm.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      // Create account with Supabase Auth
      const { data, error } =
        await supabaseClient.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              name: name
            }
          }
        });

      if (error) {
        console.error("Signup error:", error);
        alert(error.message);
        return;
      }

      if (!data || !data.user) {
        alert("Account could not be created.");
        return;
      }

      // If email confirmation is enabled, Supabase may not
      // provide a session immediately.
      if (!data.session) {
        alert(
          "Account created successfully.\n\n" +
          "Please confirm your email before logging in."
        );

        window.location.href = "login.html";
        return;
      }

      const selectedPlan =
        new URLSearchParams(window.location.search).get("plan") ||
        "None";

      // Create the user's profile.
      // The ID MUST be the same as the Supabase Auth user ID.
      const { error: profileError } =
        await supabaseClient
          .from("students")
          .upsert(
            {
              id: data.user.id,
              name: name,
              email: email,
              balance: 0,
              plan: selectedPlan
            },
            {
              onConflict: "id"
            }
          );

      if (profileError) {
        console.error("Profile setup error:", profileError);

        alert(
          "Account was created, but profile setup failed.\n\n" +
          profileError.message +
          "\n\nCode: " +
          profileError.code
        );

        return;
      }

      // Store only non-sensitive information locally.
      localStorage.setItem(
        "btcCurrentUser",
        JSON.stringify({
          id: data.user.id,
          name: name,
          email: email,
          plan: selectedPlan
        })
      );

      // Go to dashboard
      window.location.href = "dashboard.html";

    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong while creating your account.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}


// ===============================
// LOGIN
// ===============================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email =
      document
        .getElementById("loginEmail")
        .value
        .trim()
        .toLowerCase();

    const password =
      document.getElementById("loginPassword").value;

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    const submitButton = loginForm.querySelector(
      'button[type="submit"], input[type="submit"]'
    );

    if (submitButton) {
      submitButton.disabled = true;
    }

    try {
      // IMPORTANT:
      // Login through Supabase Auth.
      // Do NOT use localStorage to check passwords.
      const { data, error } =
        await supabaseClient.auth.signInWithPassword({
          email: email,
          password: password
        });

      if (error) {
        console.error("Login error:", error);
        alert("Incorrect email or password.");
        return;
      }

      if (!data || !data.user) {
        alert("Unable to log in. Please try again.");
        return;
      }

      // Get the user's profile
      let { data: profile, error: profileError } =
        await supabaseClient
          .from("students")
          .select("*")
          .eq("id", data.user.id)
          .maybeSingle();

      // If the profile doesn't exist, create it.
      if (!profile) {
        const name =
          data.user.user_metadata?.name ||
          data.user.email?.split("@")[0] ||
          "User";

        const { data: newProfile, error: createError } =
          await supabaseClient
            .from("students")
            .insert({
              id: data.user.id,
              name: name,
              email: data.user.email,
              balance: 0,
              plan: "None"
            })
            .select()
            .single();

        if (createError) {
          console.error("Profile creation error:", createError);

          alert(
            "Login successful, but your profile could not be loaded.\n\n" +
            createError.message
          );

          return;
        }

        profile = newProfile;
      }

      if (profileError) {
        console.error("Profile loading error:", profileError);

        alert(
          "Login successful, but your profile could not be loaded."
        );

        return;
      }

      // Save non-sensitive profile information locally.
      localStorage.setItem(
        "btcCurrentUser",
        JSON.stringify({
          id: data.user.id,
          name: profile.name || "User",
          email: profile.email || data.user.email,
          plan: profile.plan || "None"
        })
      );

      // Go to dashboard
      window.location.href = "dashboard.html";

    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong while logging in.");
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
      }
    }
  });
}


// ===============================
// DASHBOARD
// ===============================

async function loadDashboard() {
  try {
    // Check the actual Supabase login session.
    const {
      data: { user },
      error: userError
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      localStorage.removeItem("btcCurrentUser");
      window.location.href = "login.html";
      return;
    }

    // Get profile from students table.
    const { data: profile, error: profileError } =
      await supabaseClient
        .from("students")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

    if (profileError) {
      console.error("Dashboard profile error:", profileError);
      alert("Unable to load your profile.");
      return;
    }

    if (!profile) {
      alert("Your profile could not be found.");
      return;
    }

    const nameElement =
      document.getElementById("userName");

    const emailElement =
      document.getElementById("userEmail");

    const planElement =
      document.getElementById("userPlan");

    const balanceElement =
      document.getElementById("userBalance");

    if (nameElement) {
      nameElement.textContent =
        profile.name || "User";
    }

    if (emailElement) {
      emailElement.textContent =
        profile.email || user.email || "";
    }

    if (planElement) {
      planElement.textContent =
        profile.plan || "None";
    }

    if (balanceElement) {
      const balance =
        Number(profile.balance || 0);

      balanceElement.textContent =
        "$" + balance.toFixed(2);
    }

    // Keep local profile information updated.
    localStorage.setItem(
      "btcCurrentUser",
      JSON.stringify({
        id: user.id,
        name: profile.name || "User",
        email: profile.email || user.email,
        plan: profile.plan || "None"
      })
    );

  } catch (error) {
    console.error("Dashboard error:", error);
    window.location.href = "login.html";
  }
}


// ===============================
// LOGOUT
// ===============================

async function logout() {
  try {
    await supabaseClient.auth.signOut();
  } catch (error) {
    console.error("Logout error:", error);
  }

  localStorage.removeItem("btcCurrentUser");

  window.location.href = "login.html";
}


// ===============================
// REAL FEATURE MESSAGE
// ===============================

function realMessage() {
  alert(
    "This is a investment website. " +
    "Real deposits, withdrawals, investments, " +
    "or financial transactions are processed."
  );
}


// ===============================
// AUTO LOAD DASHBOARD
// ===============================

if (
  window.location.pathname.toLowerCase().includes("dashboard")
) {
  loadDashboard();
    }
