/* =========================================
   ANONYMOUS BTC EXCHANGE
   REAL / INVESTMENT WEBSITE
========================================= */


/* MOBILE MENU */

function toggleMenu() {

  const nav = document.getElementById("navMenu");

  nav.classList.toggle("show");

}


/* REAL MODAL */

function openReal() {

  const modal = document.getElementById("realModal");

  modal.classList.add("show");

}


function closeReal() {

  const modal = document.getElementById("realModal");

  modal.classList.remove("show");

}


/* CLOSE MODAL WHEN CLICKING OUTSIDE */

document.getElementById("realModal").addEventListener("click", function(event) {

  if (event.target === this) {

    closeReal();

  }

});


/* PLAN SELECTION */

function selectPlan(plan) {

  openReal();

  const balance = document.getElementById("realBalance");

  if (plan === "Bronze") {

    balance.textContent = "$20.00";

  }

  if (plan === "Standard") {

    balance.textContent = "$100.00";

  }

  if (plan === "Gold") {

    balance.textContent = "$500.00";

  }

}


/* LIVE MARKET CHANGE */

function liveGrowth() {

  const balanceElement =
    document.getElementById("realBalance");

  let current =
    parseFloat(
      balanceElement.textContent.replace("$", "").replace(",", "")
    );

  /*
    This is a visual live mode.
    It does represent an actual investment return.
  */

  const movement =
    current * (Math.random() * 0.06 - 0.02);

  const newBalance =
    current + movement;

  balanceElement.textContent =
    "$" +
    newBalance.toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

}


/* FAQ */

function toggleFAQ(button) {

  const item =
    button.parentElement;

  item.classList.toggle("open");

  const icon =
    button.querySelector("span");

  if (item.classList.contains("open")) {

    icon.textContent = "−";

  } else {

    icon.textContent = "+";

  }

}


/* CLOSE MOBILE MENU AFTER CLICK */

document.querySelectorAll("#navMenu a").forEach(function(link) {

  link.addEventListener("click", function() {

    document
      .getElementById("navMenu")
      .classList.remove("show");

  });

});


/* SIMPLE MARKET NUMBER ANIMATION */

setInterval(function() {

  const prices =
    document.querySelectorAll(".market-price");

  prices.forEach(function(price) {

    price.style.opacity = "0.7";

    setTimeout(function() {

      price.style.opacity = "1";

    }, 200);

  });

}, 5000);
