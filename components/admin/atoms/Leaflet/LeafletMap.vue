<template>
    <div>
        <div id="map" class="w-screen h-screen"></div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import L from 'leaflet';

const map = ref<L.Map | null>(null);

// Declare layers as a ref to hold the layer objects
const layers = ref({
    wmsLayer: null as L.TileLayer.WMS | null,
    googleStreets: null as L.TileLayer | null,
});

onMounted(() => {
    // Initialize the map
    map.value = L.map('map', { zoomControl: false }).setView([10.8084903, 106.7999323], 10) as L.Map;
    L.control.zoom({ position: 'bottomright' }).addTo(map.value as L.Map);

    // Initialize the WMS layer
    const wmsLayer = L.tileLayer.wms('https://thuduc-maps.hcmgis.vn/thuducserver/wms', {
        layers: 'thuduc:thuduc_maps',
        format: 'image/png',
        transparent: true,
        maxZoom: 24,
        attribution: 'Map data © <a href="https://thuduc-maps.hcmgis.vn/">HCMGIS</a>',
    }) as L.TileLayer.WMS; // Explicitly cast the layer

    // Initialize the Google Streets layer
    const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    });

    // Initially add the WMS layer to the map
    wmsLayer.addTo(map.value as L.Map);

    // Store the layers in the reactive layers object
    layers.value = {
        wmsLayer,
        googleStreets
    };
});

function toggleMapLayer() {
    console.log('Map Management button clicked in LeafletMap!');
    if (!map.value) return;

    const { wmsLayer, googleStreets } = layers.value;

    if (!wmsLayer || !googleStreets) return; // Ensure both layers are available

    // Remove the current active layer
    if (map.value.hasLayer(wmsLayer as L.TileLayer.WMS)) {
        map.value.removeLayer(wmsLayer as L.TileLayer.WMS);
        // Add the Google Streets layer
        googleStreets.addTo(map.value as L.Map);
    } else {
        map.value.removeLayer(googleStreets as L.TileLayer);
        // Add the WMS layer
        wmsLayer.addTo(map.value as L.Map);
    }
}

function Google_Map() {
    if (!map.value) return;

    const { wmsLayer, googleStreets } = layers.value;

    if (!wmsLayer || !googleStreets) return;
    if (map.value.hasLayer(wmsLayer as L.TileLayer.WMS)) {
        map.value.removeLayer(wmsLayer as L.TileLayer.WMS);
        // Add the Google Streets layer
        googleStreets.addTo(map.value as L.Map);
    }
}

function HCMGIS_Map() {
    if (!map.value) return;

    const { wmsLayer, googleStreets } = layers.value;

    if (!wmsLayer || !googleStreets) return;
    if (map.value.hasLayer(googleStreets as L.TileLayer)) {
        map.value.removeLayer(googleStreets as L.TileLayer);
        // Add the Google Streets layer
        wmsLayer.addTo(map.value as L.Map);
    }
}

defineExpose({
    Google_Map, HCMGIS_Map
});
</script>
