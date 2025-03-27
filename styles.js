body {
    margin: 0;
    background-color: #121212;
    color: #ffffff;
    font-family: 'Roboto Mono', monospace;
}

#map {
    height: calc(100vh - 40px);
    width: 100vw;
}

.leaflet-container {
    background: #1e1e1e;
    color: #cccccc;
}

.leaflet-popup-content-wrapper {
    background-color: #2c2c2c;
    color: #ffffff;
    border-radius: 4px;
    border: 1px solid #444444;
}

.leaflet-popup-tip {
    background-color: #2c2c2c;
}

.leaflet-control-attribution {
    display: none !important;
}

.leaflet-control-zoom {
    display: none !important;
}

.search-bar {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 1000;
    width: auto;
}

.search-container {
    display: flex;
    align-items: center;
    gap: 5px;
}

.search-bar input {
    padding: 6px 8px;
    border-radius: 5px;
    border: 1px solid #555555;
    background-color: #1e1e1e;
    color: #ffffff;
    width: 150px;
    font-size: 12px;
}

.search-bar button {
    padding: 6px 10px;
    background-color: #ff5722;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 12px;
}

.search-bar button:hover {
    background-color: #e64a19;
}

.bottom-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40px;
    background-color: #1e1e1e;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    border-top: 1px solid #444444;
    color: #ffffff;
    font-size: 16px;
    z-index: 1000;
}

.loader {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 18px;
    display: none;
    z-index: 1000;
}

.about-button, .legend-button {
    background-color: #000000;
    color: #ffffff;
    padding: 5px 10px;
    font-size: 12px;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.about-button:hover, .legend-button:hover {
    background-color: #333333;
}

.marker-cluster-small {
    background-color: #00e676;
    color: white;
}

.marker-cluster-medium {
    background-color: #ff9800;
    color: white;
}

.marker-cluster-large {
    background-color: #d50000;
    color: white;
}

#legend-card {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: #2c2c2c;
    border-radius: 8px;
    padding: 12px 15px;
    z-index: 1000;
    min-width: 200px;
    max-width: 400px;
    display: none;
    border: 1px solid #444444;
    font-size: 12px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.3);
}

.legend-content {
    width: max-content;
    max-width: 100%;
}

.legend-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    width: 100%;
}

.legend-color {
    width: 16px;
    height: 16px;
    margin-right: 10px;
    border-radius: 3px;
    flex-shrink: 0;
}

.legend-item span {
    white-space: nowrap;
    overflow: visible;
    text-overflow: clip;
}

#legend-card h3 {
    font-size: 14px;
    margin-bottom: 12px;
    font-weight: bold;
    white-space: nowrap;
    color: #ffffff;
    border-bottom: 1px solid #444;
    padding-bottom: 6px;
    width: 100%;
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 10px;
}

.logo {
    height: 32px;
    width: 32px;
}

@media (max-width: 768px) {
    #legend-card {
        top: 60px;
        left: 10px;
        right: 10px;
        width: calc(100% - 20px);
        max-width: none;
    }
    .legend-content {
        width: 100%;
    }
    .legend-item {
        white-space: normal;
    }
    .legend-item span {
        white-space: normal;
    }
    .search-bar {
        width: calc(100% - 20px);
        right: 10px;
    }
    .search-container {
        width: 100%;
    }
    .search-bar input {
        width: 100%;
    }
}
