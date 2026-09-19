document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const showLoginBtn = document.getElementById("showLogin");
  const showSignupBtn = document.getElementById("showSignup");
  const switchToSignupBtn = document.getElementById("switchToSignup");
  const switchToLoginBtn = document.getElementById("switchToLogin");

  if (showLoginBtn && showSignupBtn) {
    showLoginBtn.addEventListener("click", function () {
      showLoginBtn.classList.add("active");
      showSignupBtn.classList.remove("active");
      loginForm.classList.remove("hidden");
      signupForm.classList.add("hidden");
    });

    showSignupBtn.addEventListener("click", function () {
      showSignupBtn.classList.add("active");
      showLoginBtn.classList.remove("active");
      signupForm.classList.remove("hidden");
      loginForm.classList.add("hidden");
    });
  }

  if (switchToSignupBtn) {
    switchToSignupBtn.addEventListener("click", function () {
      showSignupBtn.click();
    });
  }

  if (switchToLoginBtn) {
    switchToLoginBtn.addEventListener("click", function () {
      showLoginBtn.click();
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const email = document.getElementById("loginEmail");
      const password = document.getElementById("loginPassword");
      const message = document.getElementById("loginMessage");

      if (!email.value.trim() || !password.value.trim()) {
        showMessage(message, "Please enter both email and password.", true);
        return;
      }

      if (!isValidEmail(email.value)) {
        showMessage(message, "Please enter a valid email address.", true);
        return;
      }

      showMessage(message, "Login successful. Redirecting...", false);
      setTimeout(function () {
        window.location.href = "dashboard.html";
      }, 600);
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const name = document.getElementById("signupName");
      const email = document.getElementById("signupEmail");
      const password = document.getElementById("signupPassword");
      const confirmPassword = document.getElementById("signupConfirmPassword");
      const message = document.getElementById("signupMessage");

      if (!name.value.trim() || !email.value.trim() || !password.value.trim() || !confirmPassword.value.trim()) {
        showMessage(message, "Please complete all sign-up fields.", true);
        return;
      }

      if (!isValidEmail(email.value)) {
        showMessage(message, "Please enter a valid email address.", true);
        return;
      }

      if (password.value.length < 6) {
        showMessage(message, "Password should be at least 6 characters long.", true);
        return;
      }

      if (password.value !== confirmPassword.value) {
        showMessage(message, "Passwords do not match.", true);
        return;
      }

      showMessage(message, "Account created successfully! Redirecting to dashboard...", false);
      setTimeout(function () {
        window.location.href = "dashboard.html";
      }, 600);
    });
  }

  function showMessage(element, text, isError) {
    if (!element) {
      return;
    }

    element.textContent = text;
    element.classList.remove("error", "success");

    if (isError) {
      element.classList.add("error");
    } else {
      element.classList.add("success");
    }
  }

  function isValidEmail(value) {
    return /\S+@\S+\.\S+/.test(value);
  }

  const routeCards = document.querySelectorAll(".route-card");
  const alternativeCard = document.getElementById("alternativeRouteCard");
  const viewRouteBtn = document.getElementById("viewRouteBtn");
  const stayRouteBtn = document.getElementById("stayRouteBtn");

  if (routeCards.length) {
    routeCards.forEach(function (card) {
      card.addEventListener("click", function () {
        routeCards.forEach(function (item) {
          item.classList.remove("selected");
          const badge = item.querySelector(".route-badge");
          if (badge) {
            badge.textContent = "Alternative";
            badge.classList.remove("selected-badge");
          }
        });

        card.classList.add("selected");
        const badge = card.querySelector(".route-badge");
        if (badge) {
          badge.textContent = "Selected";
          badge.classList.add("selected-badge");
        }
      });
    });
  }

  if (viewRouteBtn && alternativeCard) {
    viewRouteBtn.addEventListener("click", function () {
      alternativeCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
      const firstRoute = document.querySelector(".route-card:nth-of-type(2)");
      if (firstRoute) {
        firstRoute.click();
      }
    });
  }

  if (stayRouteBtn) {
    stayRouteBtn.addEventListener("click", function () {
      const selectedCard = document.querySelector(".route-card.selected");
      if (selectedCard) {
        selectedCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  const recentPlaces = document.querySelectorAll(".recent-place");
  const destinationInput = document.getElementById("destinationInput");
  const destinationSearchForm = document.getElementById("destinationSearchForm");
  const searchStatus = document.getElementById("searchStatus");

  if (recentPlaces.length && destinationInput) {
    recentPlaces.forEach(function (placeButton) {
      placeButton.addEventListener("click", function () {
        recentPlaces.forEach(function (item) {
          item.classList.remove("active");
        });
        placeButton.classList.add("active");
        destinationInput.value = placeButton.getAttribute("data-location");
        destinationInput.focus();
      });
    });
  }

  if (destinationSearchForm) {
    destinationSearchForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!destinationInput || !destinationInput.value.trim()) {
        if (searchStatus) {
          searchStatus.textContent = "Please enter a destination.";
          searchStatus.className = "search-status error";
        }
        return;
      }

      const query = destinationInput.value.trim();
      const requestUrl = "https://nominatim.openstreetmap.org/search?format=jsonv2&q=" + encodeURIComponent(query);

      fetch(requestUrl, {
        headers: {
          Accept: "application/json"
        }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error("Search request failed.");
          }
          return response.json();
        })
        .then(function (data) {
          if (!data || !data.length) {
            if (searchStatus) {
              searchStatus.textContent = "Destination not found";
              searchStatus.className = "search-status error";
            }
            return;
          }

          const result = data[0];
          const latitude = parseFloat(result.lat);
          const longitude = parseFloat(result.lon);

          if (window.waywiseMap && window.waywiseMap.setView) {
            window.waywiseMap.setView([latitude, longitude], 13);
          }

          if (window.waywiseDestinationMarker) {
            window.waywiseMap.removeLayer(window.waywiseDestinationMarker);
          }

          window.waywiseDestinationMarker = L.marker([latitude, longitude]).addTo(window.waywiseMap);
          window.waywiseDestinationMarker.bindPopup(result.display_name || query).openPopup();

          if (searchStatus) {
            searchStatus.textContent = "Destination found: " + (result.display_name || query);
            searchStatus.className = "search-status success";
          }
        })
        .catch(function (error) {
          if (searchStatus) {
            searchStatus.textContent = "Unable to search destination. Please try again.";
            searchStatus.className = "search-status error";
          }
        });
    });
  }

  const editProfileBtn = document.getElementById("editProfileBtn");
  const cancelProfileBtn = document.getElementById("cancelProfileBtn");
  const profileForm = document.getElementById("profileForm");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");

  if (editProfileBtn && profileForm) {
    editProfileBtn.addEventListener("click", function () {
      profileForm.classList.remove("hidden");
      document.getElementById("profileNameInput").focus();
    });
  }

  if (cancelProfileBtn && profileForm) {
    cancelProfileBtn.addEventListener("click", function () {
      profileForm.classList.add("hidden");
    });
  }

  if (profileForm) {
    profileForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const nameInput = document.getElementById("profileNameInput");
      const emailInput = document.getElementById("profileEmailInput");

      if (!nameInput.value.trim() || !emailInput.value.trim()) {
        return;
      }

      if (!isValidEmail(emailInput.value)) {
        return;
      }

      if (profileName) {
        profileName.textContent = nameInput.value.trim();
      }

      if (profileEmail) {
        profileEmail.textContent = emailInput.value.trim();
      }

      profileForm.classList.add("hidden");
    });
  }

  const reportForm = document.getElementById("reportForm");
  const feedbackSuccess = document.getElementById("feedbackSuccess");

  if (reportForm) {
    reportForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const issueType = document.getElementById("issueType");
      const issueDetails = document.getElementById("issueDetails");

      if (!issueType.value || !issueDetails.value.trim()) {
        return;
      }

      if (feedbackSuccess) {
        feedbackSuccess.classList.remove("hidden");
      }

      const statusNode = document.getElementById("reportStatus");
      if (statusNode) {
        statusNode.textContent = "Reported → Reviewed → Updated";
      }

      issueType.value = "";
      issueDetails.value = "";
    });
  }

  initializeDashboardMap();
});

function initializeDashboardMap() {
  const mapElement = document.getElementById("map");
  if (!mapElement || typeof L === "undefined") {
    return;
  }

  if (window.waywiseMap) {
    window.waywiseMap.remove();
  }

  const map = L.map("map", {
    zoomControl: true,
    attributionControl: true,
    preferCanvas: true
  }).setView([28.6139, 77.209], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
  }).addTo(map);

  const currentLocationMarker = L.marker([28.6139, 77.209]).addTo(map);
  currentLocationMarker.bindPopup("Current Location");

  window.waywiseMap = map;
  window.waywiseDestinationMarker = null;

  setTimeout(function () {
    if (window.waywiseMap) {
      window.waywiseMap.invalidateSize();
    }
  }, 200);

  window.addEventListener("resize", function () {
    if (window.waywiseMap) {
      window.waywiseMap.invalidateSize();
    }
  });
}
