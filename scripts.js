let map, heat, markersLayer, cache = new Map();
const loader = document.getElementById('loader');
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const legendCard = document.getElementById('legend-card');
const toggleLegendButton = document.getElementById('toggle-legend');
const locationButton = document.getElementById('location-button');
let searchMarker = null;
let userLocationMarker = null;

function initializeMap(center) {
    map = L.map('map', {
        preferCanvas: true,
        maxBounds: [[-90, -180], [90, 180]],
        maxZoom: 18,
        minZoom: 2,
        zoomControl: false
    }).setView(center, 5);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">Carto</a>',
        subdomains: 'abcd',
        maxZoom: 19,
        opacity: 0.9
    }).addTo(map);

    heat = L.heatLayer([], {
        radius: 60,
        blur: 50,
        opacity: 0.6,
        gradient: {
            0.2: "#00e676",
            0.4: "#ffeb3b",
            0.6: "#ff9800",
            0.8: "#ff5722",
            1.0: "#d50000"
        }
    }).addTo(map);

    markersLayer = L.markerClusterGroup({
        iconCreateFunction: function (cluster) {
            const count = cluster.getChildCount();
            let size = 'small';
            if (count > 100) size = 'large';
            else if (count > 50) size = 'medium';

            return L.divIcon({
                html: `<div><span>${count}</span></div>`,
                className: `marker-cluster marker-cluster-${size}`,
                iconSize: L.point(40, 40)
            });
        }
    }).addTo(map);
}

async function fetchData(apiUrl) {
    if (cache.has(apiUrl)) return cache.get(apiUrl);
    try {
        loader.style.display = 'block';
        const response = await fetch(apiUrl);
        const data = await response.json();
        cache.set(apiUrl, data);
        return data;
    } catch (error) {
        alert("Failed to fetch data. Please try again later.");
        return null;
    } finally {
        loader.style.display = 'none';
    }
}

async function updateMapData() {
    const boundsList = [
        [-85, -180, 0, 0],
        [-85, 0, 0, 180],
        [0, -180, 85, 0],
        [0, 0, 85, 180],
    ];

    const heatPoints = [];
    markersLayer.clearLayers();

    for (const bounds of boundsList) {
        const [south, west, north, east] = bounds;
        const apiUrl = `https://api.waqi.info/map/bounds/?latlng=${south},${west},${north},${east}&token=b4e61d40c7efcf81d2b8bb699d3138da26603d1e`;
        const data = await fetchData(apiUrl);

        if (!data || !data.data) {
            console.error(`No data returned for bounds: ${bounds}`);
            continue;
        }

        data.data.forEach(station => {
            if (station.lat && station.lon) {
                const aqi = parseInt(station.aqi);
                const isValidAqi = !isNaN(aqi) && aqi >= 0;

                if (isValidAqi) {
                    heatPoints.push([station.lat, station.lon, aqi / 500]);
                }

                const marker = L.circleMarker([station.lat, station.lon], {
                    radius: 6,
                    fillColor: isValidAqi ? getAqiColor(aqi) : '#888888',
                    color: isValidAqi ? "#ffffff" : "#666666",
                    weight: 1,
                    opacity: 1,
                    fillOpacity: isValidAqi ? 0.8 : 0.5
                }).bindPopup(`
                    <strong>Station:</strong> ${station.station.name || 'N/A'}<br>
                    <strong>AQI:</strong> ${isValidAqi ? aqi : 'N/A'}
                `);

                markersLayer.addLayer(marker);
            }
        });
    }

    if (heatPoints.length > 0) {
        heat.setLatLngs(heatPoints);
    } else {
        console.warn("No valid heatmap points available");
    }

    map.addLayer(markersLayer);
}

async function searchLocation(query) {
    const geocodeData = await fetchData(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`);
    if (!geocodeData || geocodeData.length === 0) {
        alert("Location not found. Please try again.");
        return;
    }

    const { lat, lon } = geocodeData[0];
    const reverseData = await fetchData(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const locationName = reverseData?.display_name || query;

    const aqiData = await fetchData(`https://api.waqi.info/feed/geo:${lat};${lon}/?token=b4e61d40c7efcf81d2b8bb699d3138da26603d1e`);
    const aqi = parseInt(aqiData?.data?.aqi);
    const isValidAqi = !isNaN(aqi) && aqi >= 0;

    if (searchMarker) {
        map.removeLayer(searchMarker);
    }

    searchMarker = L.marker([lat, lon])
        .bindPopup(`
            <strong>Location:</strong> ${locationName}<br>
            <strong>AQI:</strong> ${isValidAqi ? aqi : 'N/A'}
        `)
        .addTo(map);

    map.setView([lat, lon], 10);
    searchMarker.openPopup();
}

function getAqiColor(aqi) {
    if (aqi <= 50) return "#00e676";
    if (aqi <= 100) return "#ffeb3b";
    if (aqi <= 150) return "#ff9800";
    if (aqi <= 200) return "#ff5722";
    return "#d50000";
}

async function locateUser() {
    if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser");
        return;
    }

    loader.style.display = 'block';
    
    try {
        const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            });
        });

        const { latitude: lat, longitude: lng } = position.coords;
        
        // Remove previous user location marker if exists
        if (userLocationMarker) {
            map.removeLayer(userLocationMarker);
        }

        // Get location name
        const reverseData = await fetchData(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`);
        const locationName = reverseData?.display_name || "Your location";

        // Get AQI data
        const aqiData = await fetchData(`https://api.waqi.info/feed/geo:${lat};${lng}/?token=b4e61d40c7efcf81d2b8bb699d3138da26603d1e`);
        const aqi = parseInt(aqiData?.data?.aqi);
        const isValidAqi = !isNaN(aqi) && aqi >= 0;

        // Create marker for user location
        userLocationMarker = L.marker([lat, lng], {
            icon: L.divIcon({
                className: 'user-location-icon',
                html: '<div style="background-color: #4285F4; border-radius: 50%; width: 16px; height: 16px; border: 2px solid white;"></div>',
                iconSize: [20, 20]
            })
        }).bindPopup(`
            <strong>Your Location:</strong> ${locationName}<br>
            <strong>AQI:</strong> ${isValidAqi ? aqi : 'N/A'}
        `).addTo(map);

        // Center map on user location
        map.setView([lat, lng], 12);
        userLocationMarker.openPopup();

    } catch (error) {
        console.error("Error getting location:", error);
        alert("Could not get your location. Please make sure location services are enabled and try again.");
    } finally {
        loader.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initializeMap([20, 0]);
    updateMapData();

    // Initialize legend as closed
    legendCard.style.display = 'none';

    // Toggle legend visibility
    toggleLegendButton.addEventListener('click', () => {
        legendCard.style.display = legendCard.style.display === 'none' ? 'block' : 'none';
    });

    searchButton.addEventListener('click', () => {
        const query = searchInput.value.trim();
        if (query) searchLocation(query);
    });

    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const query = searchInput.value.trim();
            if (query) searchLocation(query);
        }
    });

    // Add click handler for location button
    locationButton.addEventListener('click', locateUser);
});
