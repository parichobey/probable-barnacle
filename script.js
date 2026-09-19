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

  const routeCards = document.querySelectorAll(".route-card");
  const alternativeCard = document.getElementById("alternativeRouteCard");
  const viewRouteBtn = document.getElementById("viewRouteBtn");
  const stayRouteBtn = document.getElementById("stayRouteBtn");

  if (routeCards.length) {
    routeCards.forEach(function (card) {
      card.addEventListener("click", function () {
        const routeId = card.getAttribute("data-route-id");
        setSelectedRoute(routeId);
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
      searchPlace(query, searchStatus);
    });
  }

  initializeVoiceCommands();

  const currentLocationForm = document.getElementById("currentLocationForm");
  const currentLocationInput = document.getElementById("currentLocationInput");
  const currentLocationValue = document.getElementById("currentLocationValue");

  if (currentLocationForm && currentLocationInput) {
    currentLocationForm.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!currentLocationInput.value.trim()) {
        return;
      }

      searchPlace(currentLocationInput.value.trim(), null, function (locationName, latitude, longitude) {
        if (window.waywiseMap && window.waywiseCurrentMarker) {
          window.waywiseMap.setView([latitude, longitude], 12);
          window.waywiseCurrentMarker.setLatLng([latitude, longitude]);
          window.waywiseCurrentMarker.bindPopup(locationName || "Current Location").openPopup();
        }

        window.waywiseCurrentCoordinates = [latitude, longitude];
        updateRouteGeometry();

        if (currentLocationValue) {
          currentLocationValue.textContent = locationName || currentLocationInput.value.trim();
        }
      }, false);
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

function initializeVoiceCommands() {
  const voiceButton = document.getElementById("voiceCommandBtn");
  const voiceLanguage = document.getElementById("voiceLanguage");
  const voiceIndicator = document.getElementById("voiceIndicator");
  const voiceTranscript = document.getElementById("voiceTranscript");

  if (!voiceButton || !voiceLanguage || !voiceIndicator || !voiceTranscript) {
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    voiceButton.disabled = true;
    voiceButton.textContent = "Voice unavailable";
    voiceIndicator.textContent = "Unsupported";
    voiceTranscript.textContent = "Use Chrome or Edge for voice commands.";
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  voiceButton.addEventListener("click", function () {
    if (voiceIndicator.classList.contains("listening")) {
      recognition.stop();
      return;
    }

    recognition.lang = voiceLanguage.value;
    voiceIndicator.textContent = "Listening...";
    voiceIndicator.className = "voice-indicator listening";
    voiceButton.textContent = "⏹ Stop listening";
    voiceTranscript.textContent = voiceLanguage.value === "hi-IN"
      ? "बोलिए..."
      : "Listening for your command...";
    recognition.start();
  });

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript.trim();
    voiceTranscript.textContent = "Heard: " + transcript;
    voiceIndicator.textContent = "Working";
    voiceIndicator.className = "voice-indicator active";
    handleVoiceCommand(transcript);
  };

  recognition.onerror = function (event) {
    voiceIndicator.textContent = "Try again";
    voiceIndicator.className = "voice-indicator";
    voiceButton.textContent = "🎙️ Speak";
    voiceTranscript.textContent = event.error === "not-allowed"
      ? "Microphone permission was blocked. Allow microphone access and try again."
      : "I could not hear that command. Please try again.";
  };

  recognition.onend = function () {
    voiceButton.textContent = "🎙️ Speak";
    if (voiceIndicator.classList.contains("listening")) {
      voiceIndicator.textContent = "Ready";
      voiceIndicator.className = "voice-indicator";
    }
  };
}

function handleVoiceCommand(transcript) {
  const command = transcript.toLowerCase().trim();
  const voiceTranscript = document.getElementById("voiceTranscript");
  const searchStatus = document.getElementById("searchStatus");

  if (/zoom in|ज़ूम इन|पास लाओ|नज़दीक/.test(command)) {
    if (window.waywiseMap) {
      window.waywiseMap.zoomIn();
    }
    voiceTranscript.textContent = "Done: zoomed in / ज़ूम इन किया गया";
    return;
  }

  if (/zoom out|ज़ूम आउट|दूर करो|दूर ले जाओ/.test(command)) {
    if (window.waywiseMap) {
      window.waywiseMap.zoomOut();
    }
    voiceTranscript.textContent = "Done: zoomed out / ज़ूम आउट किया गया";
    return;
  }

  if (/stay on|stay current|current route|वर्तमान रास्ते|इसी रास्ते/.test(command)) {
    const stayButton = document.getElementById("stayRouteBtn");
    if (stayButton) {
      stayButton.click();
    }
    voiceTranscript.textContent = "Done: staying on the current route / वर्तमान रास्ते पर रहेंगे";
    return;
  }

  if (/alternative|alternate|another route|वैकल्पिक रास्ता|दूसरा रास्ता|दूसरे रास्ते/.test(command)) {
    const viewButton = document.getElementById("viewRouteBtn");
    if (viewButton) {
      viewButton.click();
    }
    voiceTranscript.textContent = "Done: showing an alternative route / वैकल्पिक रास्ता दिखाया जा रहा है";
    return;
  }

  const routeMatch = command.match(/(?:route|रूट|रास्ता)\s*(?:number|नंबर)?\s*([123]|one|two|three|एक|दो|तीन)/);
  if (routeMatch) {
    const routeWords = { one: "1", two: "2", three: "3", "एक": "1", "दो": "2", "तीन": "3" };
    const routeId = routeWords[routeMatch[1]] || routeMatch[1];
    const routeCard = document.querySelector('.route-card[data-route-id="' + routeId + '"]');
    if (routeCard && routeCard.style.display !== "none") {
      routeCard.click();
      voiceTranscript.textContent = "Done: selected route " + routeId + " / रूट " + routeId + " चुना गया";
    } else {
      voiceTranscript.textContent = "That route is not available for this trip / यह रूट उपलब्ध नहीं है";
    }
    return;
  }

  const locationCommand = extractVoicePlace(command, true);
  if (locationCommand) {
    searchPlace(locationCommand, null, function (locationName, latitude, longitude) {
      if (window.waywiseMap && window.waywiseCurrentMarker) {
        window.waywiseMap.setView([latitude, longitude], 12);
        window.waywiseCurrentMarker.setLatLng([latitude, longitude]);
        window.waywiseCurrentMarker.bindPopup(locationName || "Current Location").openPopup();
      }

      window.waywiseCurrentCoordinates = [latitude, longitude];
      updateRouteGeometry();

      const currentLocationValue = document.getElementById("currentLocationValue");
      if (currentLocationValue) {
        currentLocationValue.textContent = locationName;
      }
    });
    voiceTranscript.textContent = "Updating current location to " + locationCommand;
    return;
  }

  const destinationCommand = extractVoicePlace(command, false);
  if (destinationCommand) {
    searchPlace(destinationCommand, searchStatus);
    voiceTranscript.textContent = "Searching destination " + destinationCommand;
    return;
  }

  voiceTranscript.textContent = "Try: “Navigate to India Gate” or “वर्तमान स्थान को नोएडा बदलो”";
}

function extractVoicePlace(command, isCurrentLocation) {
  const currentPrefixes = [
    "change current location to ", "set current location to ", "current location is ",
    "मेरी वर्तमान लोकेशन ", "वर्तमान स्थान को ", "अभी मैं ", "मैं अभी "
  ];
  const destinationPrefixes = [
    "navigate to ", "go to ", "take me to ", "destination ", "search for ",
    "मुझे ", "गंतव्य ", "जाना है ", "ले चलो "
  ];
  const prefixes = isCurrentLocation ? currentPrefixes : destinationPrefixes;

  for (let index = 0; index < prefixes.length; index += 1) {
    if (command.indexOf(prefixes[index]) === 0) {
      const place = command.slice(prefixes[index].length).trim();
      return place.replace(/(जाना है|ले चलो|पर हूं|पर हूँ)$/i, "").trim();
    }
  }

  if (!isCurrentLocation && /(जाना है|ले चलो|go|navigate)/.test(command)) {
    return command
      .replace(/^(मुझे|please|kindly)\s+/i, "")
      .replace(/(जाना है|ले चलो|please|now)$/i, "")
      .trim();
  }

  return "";
}

function searchPlace(query, statusElement, callback) {
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
        if (statusElement) {
          statusElement.textContent = "Destination not found";
          statusElement.className = "search-status error";
        }
        return;
      }

      const result = data[0];
      const latitude = parseFloat(result.lat);
      const longitude = parseFloat(result.lon);
      const displayName = result.display_name || query;

      if (statusElement && window.waywiseMap && window.waywiseMap.setView) {
        window.waywiseMap.setView([latitude, longitude], 13);
      }

      if (statusElement && window.waywiseDestinationMarker) {
        window.waywiseMap.removeLayer(window.waywiseDestinationMarker);
      }

      if (statusElement && window.waywiseMap) {
        window.waywiseDestinationMarker = L.marker([latitude, longitude]).addTo(window.waywiseMap);
        window.waywiseDestinationMarker.bindPopup(displayName).openPopup();
        window.waywiseDestinationCoordinates = [latitude, longitude];
        updateRouteGeometry();
      }

      if (statusElement) {
        statusElement.textContent = "Destination found: " + displayName;
        statusElement.className = "search-status success";
      }

      if (typeof callback === "function") {
        callback(displayName, latitude, longitude);
      }
    })
    .catch(function () {
      if (statusElement) {
        statusElement.textContent = "Unable to search destination. Please try again.";
        statusElement.className = "search-status error";
      }
    });
}

function setSelectedRoute(routeId) {
  const routeCards = document.querySelectorAll(".route-card");

  routeCards.forEach(function (card) {
    const isSelected = card.getAttribute("data-route-id") === routeId;
    card.classList.toggle("selected", isSelected);
    const badge = card.querySelector(".route-badge");
    if (badge) {
      badge.textContent = isSelected ? "Selected" : "Alternative";
      badge.classList.toggle("selected-badge", isSelected);
    }
  });

  if (window.waywiseRouteLayers) {
    window.waywiseRouteLayers.forEach(function (routeLayer) {
      const isActive = routeLayer.options.routeId === routeId;
      routeLayer.setStyle({
        color: isActive ? "#ffb000" : "#94a3b8",
        weight: isActive ? 6 : 4,
        opacity: isActive ? 1 : 0.72,
        dashArray: isActive ? "" : "8 10"
      });
    });
  }

  updateRouteSummary(routeId);
}

function updateRouteSummary(routeId) {
  const summary = document.querySelector(".map-route-summary span");
  const routeCard = document.querySelector('.route-card[data-route-id="' + routeId + '"]');
  if (!summary || !routeCard) {
    return;
  }

  const metrics = routeCard.querySelectorAll(".route-metrics strong");
  summary.textContent = "Route " + routeId + " · " + metrics[0].textContent + " · " + metrics[1].textContent;
}

function updateRouteGeometry() {
  if (!window.waywiseMap || !window.waywiseCurrentCoordinates || !window.waywiseDestinationCoordinates) {
    return;
  }

  const start = window.waywiseCurrentCoordinates;
  const end = window.waywiseDestinationCoordinates;
  const requestUrl = "https://router.project-osrm.org/route/v1/driving/" +
    start[1] + "," + start[0] + ";" + end[1] + "," + end[0] +
    "?alternatives=true&overview=full&geometries=geojson";

  fetch(requestUrl)
    .then(function (response) {
      if (!response.ok) {
        throw new Error("Route request failed.");
      }
      return response.json();
    })
    .then(function (data) {
      if (!data.routes || !data.routes.length) {
        return;
      }

      const routeCards = document.querySelectorAll(".route-card");
      routeCards.forEach(function (card, index) {
        card.style.display = index < data.routes.length ? "" : "none";
      });

      data.routes.slice(0, 3).forEach(function (route, index) {
        const card = document.querySelector('.route-card[data-route-id="' + (index + 1) + '"]');
        if (!card) {
          return;
        }

        const metrics = card.querySelectorAll(".route-metrics strong");
        if (metrics[0]) {
          metrics[0].textContent = Math.round(route.duration / 60) + " min";
        }
        if (metrics[1]) {
          metrics[1].textContent = (route.distance / 1000).toFixed(1) + " km";
        }
      });

      if (window.waywiseRouteLayers) {
        window.waywiseRouteLayers.forEach(function (routeLayer) {
          window.waywiseMap.removeLayer(routeLayer);
        });
      }

      window.waywiseRouteLayers = data.routes.slice(0, 3).map(function (route, index) {
        return L.geoJSON(route.geometry, {
          style: {
            color: index === 0 ? "#ffb000" : "#94a3b8",
            weight: index === 0 ? 6 : 4,
            opacity: index === 0 ? 1 : 0.8,
            dashArray: index === 0 ? "" : "8 10"
          },
          routeId: String(index + 1)
        }).addTo(window.waywiseMap);
      });

      setSelectedRoute("1");
      const routeBounds = L.featureGroup(window.waywiseRouteLayers).getBounds();
      if (routeBounds.isValid()) {
        window.waywiseMap.fitBounds(routeBounds, { padding: [40, 40] });
      }
    })
    .catch(function () {
      const status = document.getElementById("searchStatus");
      if (status) {
        status.textContent = "Destination found, but live routes are unavailable right now.";
        status.className = "search-status error";
      }
    });
}

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

  L.tileLayer("https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors & OpenStreetMap Germany"
  }).addTo(map);

  const routeLayers = [];

  const currentLocationMarker = L.marker([28.6139, 77.209]).addTo(map);
  currentLocationMarker.bindPopup("Current Location");

  const locationSummary = document.createElement("div");
  locationSummary.className = "map-route-summary";
  locationSummary.innerHTML = "<strong>Selected route</strong><span>Route 1 · 18 min</span>";
  const mapContainer = document.querySelector(".map-shell");
  if (mapContainer) {
    mapContainer.appendChild(locationSummary);
  }

  window.waywiseMap = map;
  window.waywiseCurrentMarker = currentLocationMarker;
  window.waywiseCurrentCoordinates = [28.6139, 77.209];
  window.waywiseDestinationCoordinates = [28.6315, 77.2167];
  window.waywiseDestinationMarker = null;
  window.waywiseRouteLayers = routeLayers;

  setSelectedRoute("1");
  const defaultDestination = L.marker(window.waywiseDestinationCoordinates).addTo(map);
  defaultDestination.bindPopup("Example destination");
  window.waywiseDestinationMarker = defaultDestination;
  updateRouteGeometry();

  requestAnimationFrame(function () {
    if (window.waywiseMap) {
      window.waywiseMap.invalidateSize();
    }
  });

  setTimeout(function () {
    if (window.waywiseMap) {
      window.waywiseMap.invalidateSize();
    }
  }, 250);

  if (!window.waywiseMapResizeHandler) {
    window.waywiseMapResizeHandler = function () {
      if (window.waywiseMap) {
        window.waywiseMap.invalidateSize();
      }
    };
    window.addEventListener("resize", window.waywiseMapResizeHandler);
  }
}
