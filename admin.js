// --- Admin Authentication ---
const adminLoginScreen = document.getElementById("admin-login-screen");
const adminDashboard = document.getElementById("admin-dashboard");

// Session check for dev convenience
if (sessionStorage.getItem("admin_logged_in") === "true") {
  adminLoginScreen.classList.add("hidden");
  adminDashboard.classList.remove("hidden");
  loadComplaints();
}

document.getElementById("admin-login-btn").addEventListener("click", () => {
  const pwd = document.getElementById("admin-pwd").value;
  if (pwd === "admin@123") {
    sessionStorage.setItem("admin_logged_in", "true");
    adminLoginScreen.classList.add("hidden");
    adminDashboard.classList.remove("hidden");
    loadComplaints();
  } else {
    alert("Invalid Credentials. Hint: admin@123");
  }
});

document.getElementById("admin-logout-btn").addEventListener("click", () => {
  sessionStorage.removeItem("admin_logged_in");
  adminDashboard.classList.add("hidden");
  adminLoginScreen.classList.remove("hidden");
  document.getElementById("admin-pwd").value = "";
});

// --- Load Complaints ---
function loadComplaints() {
  const tableBody = document.getElementById("complaints-table-body");
  const emptyState = document.getElementById("empty-state");
  const tableResp = document.querySelector(".table-responsive");
  tableBody.innerHTML = "";

  const complaints = JSON.parse(
    localStorage.getItem("vanisetu_complaints") || "[]",
  );

  if (complaints.length === 0) {
    tableResp.classList.add("hidden");
    emptyState.classList.remove("hidden");
    return;
  }

  tableResp.classList.remove("hidden");
  emptyState.classList.add("hidden");

  // Display newest first
  [...complaints].reverse().forEach((cmp) => {
    const tr = document.createElement("tr");

    const dateObj = new Date(cmp.timestamp);
    const formattedDate = `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;

    tr.innerHTML = `
            <td>
                <div style="font-weight: 600; color: white;">${cmp.id}</div>
                <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;"><i class="fa-solid fa-user" style="font-size:0.7rem"></i> ${cmp.userId}</div>
                <div style="font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-top: 4px;">${formattedDate}</div>
            </td>
            <td><span style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 6px; font-size: 0.85rem; color: white;">${cmp.category}</span></td>
            <td style="max-width: 250px;">
                <div style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-size: 0.95rem; color: #ddd; line-height: 1.4;" title="${cmp.text}">
                    ${cmp.text}
                </div>
            </td>
            <td>
                <a href="${cmp.mapLink}" target="_blank" class="action-btn" style="border-color: rgba(255,255,255,0.2); color: white; padding: 0.4rem 0.8rem; font-size: 0.8rem;">
                    <i class="fa-solid fa-location-dot"></i> Map
                </a>
            </td>
            <td>
                ${cmp.image ? `<a href="${cmp.image}" target="_blank"><img src="${cmp.image}" class="thumbnail" title="Click to view full image"></a>` : '<span style="color:var(--text-muted); font-size:0.8rem; font-style: italic;">No Image</span>'}
            </td>
            <td>
                <select class="status-select" data-id="${cmp.id}" style="color: ${getStatusColor(cmp.status)}; border-color: ${getStatusColor(cmp.status)}">
                    <option value="Pending" ${cmp.status === "Pending" ? "selected" : ""} style="color: var(--warning)">Pending</option>
                    <option value="In Progress" ${cmp.status === "In Progress" ? "selected" : ""} style="color: var(--secondary-glow)">In Progress</option>
                    <option value="Resolved" ${cmp.status === "Resolved" ? "selected" : ""} style="color: var(--success)">Resolved</option>
                </select>
            </td>
            <td>
                <button class="action-btn publish-btn" data-id="${cmp.id}">
                    <i class="fa-brands fa-x-twitter"></i> Publish
                </button>
            </td>
        `;
    tableBody.appendChild(tr);
  });

  // Event Listeners for status change
  document.querySelectorAll(".status-select").forEach((sel) => {
    sel.addEventListener("change", (e) => {
      const newStatus = e.target.value;
      const color = getStatusColor(newStatus);
      e.target.style.color = color;
      e.target.style.borderColor = color;
      updateStatus(e.target.dataset.id, newStatus);
    });
  });

  // Event Listeners for publish
  document.querySelectorAll(".publish-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = e.currentTarget.dataset.id;
      publishToTwitter(id);
    });
  });
}

function getStatusColor(status) {
  if (status === "Pending") return "var(--warning)";
  if (status === "In Progress") return "var(--secondary-glow)";
  if (status === "Resolved") return "var(--success)";
  return "white";
}

function updateStatus(id, newStatus) {
  let complaints = JSON.parse(
    localStorage.getItem("vanisetu_complaints") || "[]",
  );
  complaints = complaints.map((c) => {
    if (c.id === id) c.status = newStatus;
    return c;
  });
  localStorage.setItem("vanisetu_complaints", JSON.stringify(complaints));
}

// --- Social Publish Module ---
function publishToTwitter(id) {
  const complaints = JSON.parse(
    localStorage.getItem("vanisetu_complaints") || "[]",
  );
  const cmp = complaints.find((c) => c.id === id);
  if (!cmp) return;

  // Remove spaces from category for hashtag
  const cleanCategory = cmp.category.replace(/\s/g, "");
  const hashtags = `#Vanisetu #${cleanCategory} #CitizenReport`;

  // In a real app, authorities would be determined dynamically based on location
  const authorities = `@UPGovt @dm_prayagraj`;

  // Create the structured tweet
  const tweetText =
    `🚨 New Citizen Report Registered\n` +
    `🆔 ${cmp.id}\n\n` +
    `📌 Issue: ${cmp.text.length > 80 ? cmp.text.substring(0, 77) + "..." : cmp.text}\n` +
    `📍 Location: ${cmp.mapLink}\n\n` +
    `${authorities} Please investigate this issue.\n` +
    `${hashtags}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  // Open Twitter intent in new tab
  window.open(twitterUrl, "_blank");
}
