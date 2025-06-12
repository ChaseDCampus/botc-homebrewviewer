document.getElementById('fileInput').addEventListener('change', function(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      renderPage(data);
    } catch (err) {
      alert('Invalid JSON file.');
      console.error(err);
    }
  };
  reader.readAsText(file);
});

function renderPage(data) {
  const meta = data.find(item => item.id === '_meta');
  document.title = meta?.name || "Custom Script";
  document.getElementById('script-title').textContent = meta?.name || "";
  document.getElementById('script-author').textContent = "by " + (meta?.author || "");
  document.getElementById('script-author-credit').textContent = meta?.author || "";
  document.getElementById('script-almanac-bottom').textContent = meta?.almanac || "";

  const fabled = data.filter(r => r.team === "fabled");
  const roles = data.filter(r => ["townsfolk", "outsider", "minion", "demon"].includes(r.team));

  const fabledContainer = document.getElementById("fabled-icons");
  fabledContainer.innerHTML = "";
  fabled.forEach(f => {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "6px";

    const img = document.createElement("img");
    img.src = Array.isArray(f.image) ? f.image[0] : f.image || "";
    img.alt = f.name;
    img.style.width = "25px";
    img.style.height = "25px";

    const label = document.createElement("span");
    label.textContent = f.name;

    container.appendChild(img);
    container.appendChild(label);
    fabledContainer.appendChild(container);
  });

  const roleList = document.getElementById("role-list");
  roleList.innerHTML = "";

  const grouped = {};
  roles.forEach(r => {
    const team = r.team?.toLowerCase();
    if (!grouped[team]) grouped[team] = [];
    grouped[team].push(r);
  });

  ["townsfolk", "outsider", "minion", "demon"].forEach(team => {
    if (!grouped[team]) return;

    const divider = document.createElement("div");
    divider.className = "section-divider";
    const label = document.createElement("span");
const pluralMap = {
  townsfolk: "TOWNSFOLK", // already plural
  outsider: "OUTSIDERS",
  minion: "MINIONS",
  demon: "DEMONS"
};

label.textContent = pluralMap[team] || team.toUpperCase();

    divider.appendChild(label);
    roleList.appendChild(divider);

    const table = document.createElement("div");
    table.className = "role-table";

    grouped[team].forEach(role => {
      const row = document.createElement("div");
      row.className = "role-row";

      const img = document.createElement("img");
      img.src = Array.isArray(role.image) ? role.image[0] : role.image || "";
      img.alt = role.name;

      const name = document.createElement("div");
      name.className = "role-name";
      name.textContent = role.name;

      const ability = document.createElement("div");
      ability.className = "role-ability";
      ability.textContent = role.ability;

      row.append(img, name, ability);
      table.appendChild(row);
    });

    roleList.appendChild(table);
  });

}
