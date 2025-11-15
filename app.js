<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Where My Bus</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css"/>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%);
      color: #333;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    header {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      padding: 15px;
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .container {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .sidebar {
      width: 320px;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(10px);
      padding: 20px;
      box-shadow: 2px 0 10px rgba(0,0,0,0.1);
      overflow-y: auto;
    }

    .sidebar h2 {
      margin-top: 0;
      font-size: 1.2rem;
      color: #222;
    }

    .sidebar input, .sidebar button, .sidebar select {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border-radius: 8px;
      border: 1px solid #ccc;
    }

    .sidebar button {
      background: #4CAF50;
      color: white;
      border: none;
      font-weight: bold;
      cursor: pointer;
      transition: 0.3s;
    }

    .sidebar button:hover {
      background: #45a049;
    }

    #map {
      flex: 1;
    }

    .bus-list {
      margin-top: 15px;
      max-height: 200px;
      overflow-y: auto;
    }

    .bus-item {
      padding: 8px;
      border-bottom: 1px solid #ddd;
      cursor: pointer;
    }
    .bus-item:hover {
      background: #f0f0f0;
    }
  </style>
</head>
<body>
  <header>🚌 Where My Bus</header>
  <div class="container">
    <div class="sidebar">
      <h2>Register a Bus</h2>
      <input type="text" id="busNumber" placeholder="Bus Number">
      <input type="text" id="busRoute" placeholder="Route Name">
      <input type="color" id="busColor" value="#ff0000">
      <button onclick="registerBus()">Register Bus</button>

      <h2>Find a Bus</h2>
      <input type="text" id="searchInput" placeholder="Search by number/route" oninput="searchBus()">

      <div class="bus-list" id="busList"></div>
    </div>
    <div id="map"></div>
  </div>

  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script>
    // Initialize map
    const map = L.map('map').setView([7.8731, 80.7718], 7); // Sri Lanka center
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    let buses = [];

    function registerBus() {
      const number = document.getElementById("busNumber").value.trim();
      const route = document.getElementById("busRoute").value.trim();
      const color = document.getElementById("busColor").value;

      if (!number || !route) {
        alert("Please enter bus number and route!");
        return;
      }

      // Place marker at map center (for demo)
      const latlng = map.getCenter();
      const marker = L.circleMarker(latlng, {
        radius: 10,
        color: color,
        fillColor: color,
        fillOpacity: 0.8
      }).addTo(map)
        .bindPopup(`<b>Bus ${number}</b><br>Route: ${route}`);

      const bus = { number, route, color, marker, latlng };
      buses.push(bus);
      updateBusList();
    }

    function updateBusList(filtered = null) {
      const list = document.getElementById("busList");
      list.innerHTML = "";
      (filtered || buses).forEach((bus, index) => {
        const item = document.createElement("div");
        item.className = "bus-item";
        item.textContent = `🚌 ${bus.number} - ${bus.route}`;
        item.onclick = () => {
          map.setView(bus.marker.getLatLng(), 14);
          bus.marker.openPopup();
        };
        list.appendChild(item);
      });
    }

    function searchBus() {
      const query = document.getElementById("searchInput").value.toLowerCase();
      const filtered = buses.filter(b => 
        b.number.toLowerCase().includes(query) || 
        b.route.toLowerCase().includes(query)
      );
      updateBusList(filtered);
    }

    // Simulate bus movement
    setInterval(() => {
      buses.forEach(bus => {
        let latlng = bus.marker.getLatLng();
        let newLat = latlng.lat + (Math.random() - 0.5) * 0.01;
        let newLng = latlng.lng + (Math.random() - 0.5) * 0.01;
        bus.marker.setLatLng([newLat, newLng]);
      });
    }, 4000);
  </script>
</body>
</html>
