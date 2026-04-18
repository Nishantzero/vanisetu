// --- Data and State ---
let currentUser = JSON.parse(localStorage.getItem("vanisetu_user"));
let complaintData = {
  text: "",
  category: "",
  lat: null,
  lng: null,
  mapLink: "",
  image: null,
};

// --- Localization (i18n) Dictionary ---
const i18n = {
  en: {
    subtitle: "Voice-First Citizen Complaint System",
    login_title: "Login",
    mobile_label: "Mobile Number",
    mobile_placeholder: "Enter 10-digit number",
    continue_btn: "Continue",
    record_title: "Record Complaint",
    tap_speak: "Tap to speak",
    speak_placeholder: "Speak or type your complaint here...",
    select_manual: "Or Select Category Manually",
    cat_water: "Water",
    cat_roads: "Roads",
    cat_electricity: "Electricity",
    cat_sanitation: "Sanitation",
    cat_others: "Others",
    next_step: "Next Step",
    attach_evidence: "Attach Evidence",
    capture_desc: "Capture a photo of the issue for better resolution.",
    init_camera: "Initializing Camera...",
    capture_img: "Capture Image",
    upload_device: "Upload from Device",
    skip_btn: "Skip",
    confirm_details: "Confirm Details",
    res_cat: "Category",
    res_desc: "Complaint Description",
    res_loc: "Location Evidence",
    res_view_map: "View on Map",
    res_img: "Attached Image",
    submit_auth: "Submit to Authority",
    edit_details: "Edit Details",
    alert_invalid_phone: "Please enter a valid 10-digit mobile number.",
    alert_no_desc:
      "Please describe the issue or use the microphone to record it.",
    alert_no_cat: "Please select a category for your complaint.",
    alert_loc_denied:
      "Location access denied. Please enable location permissions to report accurately.",
    alert_success: "Complaint Registered Successfully!\nYour Tracking ID is: ",
    alert_no_speech:
      "Speech recognition is not supported in this browser. Please type your complaint.",
    status_locating: "Locating...",
    status_listening: "Listening...",
  },
  hi: {
    subtitle: "आवाज़-आधारित नागरिक शिकायत प्रणाली",
    login_title: "लॉग इन करें",
    mobile_label: "मोबाइल नंबर",
    mobile_placeholder: "10-अंकों का नंबर दर्ज करें",
    continue_btn: "जारी रखें",
    record_title: "शिकायत दर्ज करें",
    tap_speak: "बोलने के लिए टैप करें",
    speak_placeholder: "अपनी शिकायत यहाँ बोलें या टाइप करें...",
    select_manual: "या मैन्युअल रूप से श्रेणी चुनें",
    cat_water: "पानी",
    cat_roads: "सड़कें",
    cat_electricity: "बिजली",
    cat_sanitation: "स्वच्छता",
    cat_others: "अन्य",
    next_step: "अगला कदम",
    attach_evidence: "प्रमाण संलग्न करें",
    capture_desc: "बेहतर समाधान के लिए समस्या की फोटो खींचें।",
    init_camera: "कैमरा शुरू हो रहा है...",
    capture_img: "फोटो खींचें",
    upload_device: "डिवाइस से अपलोड करें",
    skip_btn: "छोड़ें",
    confirm_details: "विवरण की पुष्टि करें",
    res_cat: "श्रेणी",
    res_desc: "शिकायत का विवरण",
    res_loc: "स्थान प्रमाण",
    res_view_map: "नक्शे पर देखें",
    res_img: "संलग्न फोटो",
    submit_auth: "अधिकारी को सबमिट करें",
    edit_details: "विवरण संपादित करें",
    alert_invalid_phone: "कृपया एक वैध 10-अंकीय मोबाइल नंबर दर्ज करें।",
    alert_no_desc:
      "कृपया समस्या का वर्णन करें या इसे रिकॉर्ड करने के लिए माइक्रोफ़ोन का उपयोग करें।",
    alert_no_cat: "कृपया अपनी शिकायत के लिए एक श्रेणी चुनें।",
    alert_loc_denied:
      "स्थान पहुंच अस्वीकार कर दी गई। कृपया सटीक रिपोर्ट करने के लिए स्थान सक्षम करें।",
    alert_success: "शिकायत सफलतापूर्वक पंजीकृत हो गई!\nआपका ट्रैकिंग आईडी है: ",
    alert_no_speech:
      "इस ब्राउज़र में स्पीच रिकग्निशन समर्थित नहीं है। कृपया अपनी शिकायत टाइप करें।",
    status_locating: "स्थान खोजा जा रहा है...",
    status_listening: "सुन रहा हूँ...",
  },
};

let currentLangCode = "en";
let currentLang = "en-IN"; // Voice recognition language

function setLanguage(lang) {
  currentLangCode = lang;
  currentLang = lang === "en" ? "en-IN" : "hi-IN";

  // Update UI texts dynamically
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang][key]) {
      el.innerText = i18n[lang][key];
    }
  });

  // Update placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (i18n[lang][key]) {
      el.placeholder = i18n[lang][key];
    }
  });

  // Update button active styles
  const btnEn = document.getElementById("lang-en-btn");
  const btnHi = document.getElementById("lang-hi-btn");
  if (btnEn && btnHi) {
    if (lang === "en") {
      btnEn.style.borderColor = "var(--primary-glow)";
      btnEn.style.color = "var(--primary-glow)";
      btnHi.style.borderColor = "var(--border-color)";
      btnHi.style.color = "var(--text-muted)";
    } else {
      btnHi.style.borderColor = "var(--primary-glow)";
      btnHi.style.color = "var(--primary-glow)";
      btnEn.style.borderColor = "var(--border-color)";
      btnEn.style.color = "var(--text-muted)";
    }
  }
}

// Add event listeners for language buttons
document
  .getElementById("lang-en-btn")
  .addEventListener("click", () => setLanguage("en"));
document
  .getElementById("lang-hi-btn")
  .addEventListener("click", () => setLanguage("hi"));

// Elements
const screens = {
  login: document.getElementById("screen-login"),
  main: document.getElementById("screen-main"),
  camera: document.getElementById("screen-camera"),
  result: document.getElementById("screen-result"),
};

// --- Initialization ---
function init() {
  if (currentUser) {
    showScreen("main");
    document.getElementById("user-id-display").innerText = currentUser.id;
  } else {
    showScreen("login");
  }
  // Set default language
  setLanguage("en");
}

function showScreen(screenName) {
  Object.values(screens).forEach((s) => s.classList.add("hidden"));
  screens[screenName].classList.remove("hidden");
}

// --- Login System ---
document.getElementById("login-btn").addEventListener("click", () => {
  const phone = document.getElementById("phone-input").value;
  if (/^\d{10}$/.test(phone)) {
    const last4 = phone.slice(-4);
    const random = Math.floor(1000 + Math.random() * 9000);
    currentUser = {
      id: `USER-${last4}-${random}`,
      phone: phone,
    };
    localStorage.setItem("vanisetu_user", JSON.stringify(currentUser));
    document.getElementById("user-id-display").innerText = currentUser.id;
    showScreen("main");
  } else {
    alert(i18n[currentLangCode].alert_invalid_phone);
  }
});

// --- Category Engine ---
const keywords = {
  Water: ["pani", "water", "पानी", "पाणी", "leak", "pipeline"],
  Roads: ["road", "sadak", "रस्ता", "pothole", "broken"],
  Electricity: ["bijli", "light", "वीज", "power", "cut", "pole"],
  Sanitation: ["garbage", "kachra", "dirt", "clean", "drain", "waste"],
};

function detectCategory(text) {
  const lowerText = text.toLowerCase();
  for (const [category, words] of Object.entries(keywords)) {
    for (const word of words) {
      if (lowerText.includes(word.toLowerCase())) {
        return category;
      }
    }
  }
  return "Others";
}

// --- Manual Category Selection ---
document.querySelectorAll(".category-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    document
      .querySelectorAll(".category-btn")
      .forEach((b) => b.classList.remove("active"));
    e.currentTarget.classList.add("active");
    complaintData.category = e.currentTarget.dataset.category;
  });
});

// --- Speech Recognition ---
const micBtn = document.getElementById("mic-btn");
const transcriptArea = document.getElementById("transcript-area");
const micStatus = document.getElementById("mic-status");

let recognition;
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;

  recognition.onstart = () => {
    micBtn.classList.add("recording");
    micStatus.innerText = i18n[currentLangCode].status_listening;
    transcriptArea.placeholder = i18n[currentLangCode].status_listening;
  };

  recognition.onresult = (event) => {
    let interimTranscript = "";
    let finalTranscript = "";
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }
    if (finalTranscript) {
      // Append the new transcript segment
      const currentText = transcriptArea.value.trim();
      transcriptArea.value = currentText
        ? currentText + " " + finalTranscript
        : finalTranscript;

      complaintData.text = transcriptArea.value;

      // Auto detect category
      const detected = detectCategory(complaintData.text);
      if (detected) {
        complaintData.category = detected;
        document.querySelectorAll(".category-btn").forEach((b) => {
          b.classList.remove("active");
          if (b.dataset.category === detected) b.classList.add("active");
        });
      }
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    micBtn.classList.remove("recording");
    micStatus.innerText = i18n[currentLangCode].tap_speak;
  };

  recognition.onend = () => {
    micBtn.classList.remove("recording");
    micStatus.innerText = i18n[currentLangCode].tap_speak;
  };
} else {
  micBtn.style.opacity = "0.5";
  micBtn.style.cursor = "not-allowed";
  micStatus.innerText = "Not supported";
}

micBtn.addEventListener("click", () => {
  if (recognition) {
    if (micBtn.classList.contains("recording")) {
      recognition.stop();
    } else {
      recognition.lang = currentLang;
      recognition.start();
    }
  } else {
    alert(i18n[currentLangCode].alert_no_speech);
  }
});

// --- Geolocation ---
function getLocation() {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          complaintData.lat = lat;
          complaintData.lng = lng;
          complaintData.mapLink = `https://www.google.com/maps?q=${lat},${lng}`;
          resolve();
        },
        (error) => {
          console.warn("Geolocation error:", error);
          alert(i18n[currentLangCode].alert_loc_denied);

          // Fallback for demo purposes if denied
          complaintData.lat = 28.6139;
          complaintData.lng = 77.209;
          complaintData.mapLink = `https://www.google.com/maps?q=28.6139,77.2090`;
          resolve();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }, // HIGHEST ACCURACY Settings as requested
      );
    } else {
      alert(i18n[currentLangCode].alert_loc_denied);
      // Fallback
      complaintData.lat = 28.6139;
      complaintData.lng = 77.209;
      complaintData.mapLink = `https://www.google.com/maps?q=28.6139,77.2090`;
      resolve();
    }
  });
}

// --- Main to Camera Navigation ---
document
  .getElementById("next-to-camera-btn")
  .addEventListener("click", async (e) => {
    const btn = e.currentTarget;

    // Ensure we capture manually typed text
    if (!complaintData.text && transcriptArea.value) {
      complaintData.text = transcriptArea.value.trim();
    } else if (complaintData.text !== transcriptArea.value) {
      complaintData.text = transcriptArea.value.trim();
    }

    if (!complaintData.category && complaintData.text) {
      complaintData.category = detectCategory(complaintData.text);
    }

    if (!complaintData.text) {
      alert(i18n[currentLangCode].alert_no_desc);
      return;
    }
    if (!complaintData.category) {
      alert(i18n[currentLangCode].alert_no_cat);
      return;
    }

    // UX Feedback
    const originalHtml = btn.innerHTML;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> ${i18n[currentLangCode].status_locating}`;
    btn.disabled = true;

    await getLocation();

    btn.innerHTML = originalHtml;
    btn.disabled = false;

    showScreen("camera");
    startCamera();
  });

// --- Camera System ---
const video = document.getElementById("camera-preview");
const canvas = document.getElementById("camera-canvas");
const cameraLoading = document.getElementById("camera-loading");
let stream;

async function startCamera() {
  cameraLoading.style.display = "block";
  video.style.display = "none";
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    video.srcObject = stream;
    video.onloadedmetadata = () => {
      cameraLoading.style.display = "none";
      video.style.display = "block";
    };
  } catch (err) {
    console.warn("Camera error:", err);
    cameraLoading.innerText = "Camera access denied or unavailable.";
    cameraLoading.style.display = "block";
  }
}

function stopCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
}

document.getElementById("capture-btn").addEventListener("click", () => {
  if (video.srcObject) {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    complaintData.image = canvas.toDataURL("image/jpeg", 0.8);
  }
  stopCamera();
  prepareResult();
});

// File upload fallback
const fileUpload = document.getElementById("file-upload");
document.getElementById("upload-btn").addEventListener("click", () => {
  fileUpload.click();
});

fileUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (ev) => {
      complaintData.image = ev.target.result;
      stopCamera();
      prepareResult();
    };
    reader.readAsDataURL(file);
  }
});

document.getElementById("skip-camera-btn").addEventListener("click", () => {
  stopCamera();
  prepareResult();
});

// --- Result Screen ---
function prepareResult() {
  showScreen("result");

  // Localize category dynamically based on current language
  const localizedCategory =
    i18n[currentLangCode][`cat_${complaintData.category.toLowerCase()}`] ||
    complaintData.category;

  document.getElementById("res-category").innerText = localizedCategory;
  document.getElementById("res-desc").innerText = complaintData.text;
  document.getElementById("res-location").href = complaintData.mapLink;

  const img = document.getElementById("res-image");
  if (complaintData.image) {
    img.src = complaintData.image;
    img.classList.remove("hidden");
  } else {
    img.classList.add("hidden");
  }
}

document.getElementById("back-to-edit-btn").addEventListener("click", () => {
  showScreen("main");
});

// --- Submit Complaint ---
document
  .getElementById("submit-complaint-btn")
  .addEventListener("click", () => {
    const trackingId = `CMP-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalComplaint = {
      id: trackingId,
      userId: currentUser.id,
      text: complaintData.text,
      category: complaintData.category, // store english key internally
      lat: complaintData.lat,
      lng: complaintData.lng,
      mapLink: complaintData.mapLink,
      image: complaintData.image,
      status: "Pending",
      timestamp: new Date().toISOString(),
    };

    // Save to local storage
    let existing = JSON.parse(
      localStorage.getItem("vanisetu_complaints") || "[]",
    );
    existing.push(finalComplaint);
    localStorage.setItem("vanisetu_complaints", JSON.stringify(existing));

    alert(i18n[currentLangCode].alert_success + trackingId);

    // Reset state for new complaint
    complaintData = {
      text: "",
      category: "",
      lat: null,
      lng: null,
      mapLink: "",
      image: null,
    };
    transcriptArea.value = "";
    document
      .querySelectorAll(".category-btn")
      .forEach((b) => b.classList.remove("active"));
    showScreen("main");
  });

// Run Init
init();

/*
 * FUTURE SCOPE:
 * 1. Auto social media posting via official Twitter/Facebook APIs.
 * 2. Direct integration with municipal corporation CRM databases.
 * 3. AI-based priority tagging (Emergency vs Normal) using NLP.
 * 4. Automated SMS/WhatsApp updates to users via Twilio/WhatsApp Business API.
 */
