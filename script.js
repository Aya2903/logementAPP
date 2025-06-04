let map = L.map('map').setView([43.6045, 1.4442], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let logements = [];
let markers = [];

function afficherLogements(filtres) {
  document.getElementById("liste-logements").innerHTML = "";
  markers.forEach(m => map.removeLayer(m));
  markers = [];

  logements
    .filter(l => {
      return (!filtres.ville || l.ville.toLowerCase().includes(filtres.ville.toLowerCase())) &&
             (!filtres.prixMax || l.loyer <= filtres.prixMax) &&
             (!filtres.type || l.type === filtres.type) &&
             (!filtres.surfaceMin || l.surface >= filtres.surfaceMin);
    })
    .forEach(logement => {
      // Afficher dans la liste
      const div = document.createElement("div");
      div.className = "logement";
      div.innerHTML = `
  <img src="${logement.image}" alt="Photo du logement">
  <b>${logement.type.toUpperCase()}</b><br>
  ${logement.adresse}<br>
  Loyer : ${logement.loyer} €<br>
  Surface : ${logement.surface} m²
`;


      document.getElementById("liste-logements").appendChild(div);

      // Marqueur sur la carte
      const marker = L.marker([logement.latitude, logement.longitude]).addTo(map);
      marker.bindPopup(`
  <img src="${logement.image}" alt="Photo du logement" style="width:100px;height:auto;margin-bottom:5px;"><br>
  <b>${logement.type.toUpperCase()}</b><br>
  ${logement.adresse}<br>
  Loyer : ${logement.loyer} €<br>
  Surface : ${logement.surface} m²
`);

      markers.push(marker);
    });
}

fetch('logements_toulouse.json')
  .then(r => r.json())
  .then(data => {
    logements = data;
    afficherLogements({});
  });

document.getElementById("filters").addEventListener("submit", (e) => {
  e.preventDefault();
  const filtres = {
    ville: document.getElementById("ville").value,
    prixMax: parseInt(document.getElementById("prixMax").value),
    type: document.getElementById("type").value,
    surfaceMin: parseInt(document.getElementById("surfaceMin").value)
  };
  afficherLogements(filtres);
});
