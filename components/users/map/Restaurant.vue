```vue
<template>
  <div class="flex">
    <!-- Sidebar -->
    <div class="w-1/4 h-[calc(100vh-80px)] overflow-y-auto p-4 bg-gray-100">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Tìm kiếm nhà hàng..."
        class="w-full p-2 mb-4 border rounded"
      />
      <div v-for="restaurant in filteredRestaurants" :key="restaurant.id" class="mb-4">
        <div
          class="flex items-center p-2 bg-white rounded-lg shadow border border-gray-300 cursor-pointer hover:bg-gray-200"
          @click="flyToRestaurant(restaurant)"
        >
          <img
            :src="restaurant.mainimage"
            alt="Restaurant Image"
            class="w-20 h-20 object-cover rounded-l-lg"
          />
          <div class="flex-1 p-2">
            <h3 class="text-sm font-semibold">{{ restaurant.name }}</h3>
            <p class="text-xs text-gray-600">{{ restaurant.address }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Map -->
    <div class="w-3/4 h-[calc(100vh-80px)]">
      <LMap
        ref="map1"
        :zoom="12"
        :max-zoom="20"
        :center="[10.77985629, 106.7030089]"
        @ready="onMapReady"
        class="w-full h-full border-1 border-gray-200"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import L from 'leaflet';

const map1 = ref(null);
const restaurants = ref([]);
const searchQuery = ref('');
const config = useRuntimeConfig();
const currentLocationMarker = ref(null);

// Filter restaurants based on search query
const filteredRestaurants = computed(() =>
  restaurants.value.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
);

// Add markers to the map
const addMarkersToMap = () => {
  console.log('Adding markers to the map:', restaurants.value);

  restaurants.value.forEach((restaurant) => {
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="marker-wrapper">
          <img src="${restaurant.mainimage}" alt="${restaurant.name}" class="marker-image" />
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });

    const marker = L.marker([restaurant.latitude, restaurant.longitude], { icon: customIcon }).addTo(map1.value.leafletObject);
    marker.bindPopup(`<b>${restaurant.name}</b><br>${restaurant.address}`);
    restaurant.marker = marker;
  });
};

// Fetch restaurants from API
const fetchRestaurants = async () => {
  try {
    const response = await fetch(`${config.public.apiBase}/restaurants/public/restaurants/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch restaurants');
    }

    const data = await response.json();
    restaurants.value = data;

    if (map1.value && map1.value.leafletObject) {
      addMarkersToMap();
    }
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
};

// Fetch current location using HERE Maps API
const fetchCurrentLocation = async () => {
  try {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Center the map on the user's location
          map1.value.leafletObject.setView([latitude, longitude], 16);

          // Remove previous marker if it exists
          if (currentLocationMarker.value) {
            map1.value.leafletObject.removeLayer(currentLocationMarker.value);
          }

          // Add a marker for the current location
          const customIcon = L.divIcon({
            className: 'current-location-marker',
            html: `
              <div class="marker-wrapper" style="background-color: blue; border-radius: 50%; width: 50px; height: 50px;">
                <span style="color: white; text-align: center; line-height: 20px;">Bạn</span>
              </div>
            `,
            iconSize: [20, 20],
            iconAnchor: [10, 20],
            popupAnchor: [0, -20],
          });

          currentLocationMarker.value = L.marker([latitude, longitude], { icon: customIcon })
            .addTo(map1.value.leafletObject)
            .bindPopup('<b>Vị trí hiện tại</b>')
            .openPopup();

          // Use HERE Reverse Geocoding to get address details
          const hereApiKey = config.public.hereApiKey;
          const response = await fetch(
            `https://revgeocode.search.hereapi.com/v1/revgeocode?at=${latitude},${longitude}&apiKey=${hereApiKey}`
          );

          if (!response.ok) {
            throw new Error('Failed to fetch address from HERE API');
          }

          const data = await response.json();
          const address = data.items[0]?.address?.label || 'Unknown address';
          currentLocationMarker.value.bindPopup(`<b>Vị trí hiện tại</b><br>${address}`).openPopup();
        },
        (error) => {
          console.error('Error getting browser location:', error);
          // Fallback to HERE Positioning API
          fetchLocationWithHereAPI();
        }
      );
    } else {
      console.error('Geolocation not supported by this browser.');
      fetchLocationWithHereAPI();
    }
  } catch (error) {
    console.error('Error fetching current location:', error);
  }
};

// Fallback: Fetch location using HERE Positioning API
const fetchLocationWithHereAPI = async () => {
  try {
    const hereApiKey = config.public.hereApiKey;
    const response = await fetch(
      `https://pos.api.here.com/positioning/v1/locate?apiKey=${hereApiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // Note: Requires Wi-Fi or cellular data, which may not be available client-side
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch location from HERE Positioning API');
    }

    const data = await response.json();
    const { lat, lng } = data.location;

    map1.value.leafletObject.setView([lat, lng], 16);

    if (currentLocationMarker.value) {
      map1.value.leafletObject.removeLayer(currentLocationMarker.value);
    }

    const customIcon = L.divIcon({
      className: 'current-location-marker',
      html: `
        <div class="marker-wrapper" style="background-color: blue; border-radius: 50%; width: 20px; height: 20px;">
          <span style="color: white; text-align: center; line-height: 20px;">You</span>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -50],
    });

    currentLocationMarker.value = L.marker([lat, lng], { icon: customIcon })
      .addTo(map1.value.leafletObject)
      .bindPopup('<b>Vị trí hiện tại</b>')
      .openPopup();
  } catch (error) {
    console.error('Error fetching location from HERE API:', error);
  }
};

// Create custom Leaflet control for the "Locate Me" button
const createLocateMeControl = () => {
  const LocateMeControl = L.Control.extend({
    options: {
      position: 'topleft', // Position the button in the top-left corner
    },

    onAdd: function (map) {
      const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
      container.innerHTML = '<button title="Tìm vị trí của tôi" style="background: white; border: 2px solid rgba(0,0,0,0.2); padding: 5px; cursor: pointer;">📍</button>';
      container.style.backgroundColor = 'white';
      container.style.width = '34px';
      container.style.height = '34px';

      container.onclick = function () {
        fetchCurrentLocation();
      };

      return container;
    },
  });

  return new LocateMeControl();
};

// Initialize map layers
const onMapReady = () => {
  const wmsLayer1 = L.tileLayer.wms('https://thuduc-maps.hcmgis.vn/thuducserver/wms', {
    layers: 'thuduc:thuduc_maps',
    format: 'image/png',
    transparent: true,
    maxZoom: 24,
    attribution: 'Map data © <a href="https://thuduc-maps.hcmgis.vn/">HCMGIS</a>',
  });

  wmsLayer1.addTo(map1.value.leafletObject);

  // Add the "Locate Me" button to the map
  createLocateMeControl().addTo(map1.value.leafletObject);

  console.log('Map is ready:', map1.value.leafletObject);

  // Add markers if restaurants data is already fetched
  if (restaurants.value.length > 0) {
    addMarkersToMap();
  }
};

// Fly to a specific restaurant and show popup
const flyToRestaurant = (restaurant) => {
  map1.value.leafletObject.flyTo([restaurant.latitude, restaurant.longitude], 16);
  if (restaurant.marker) {
    restaurant.marker.openPopup();
  }
};

// Fetch data on component mount
onMounted(() => {
  fetchRestaurants();
});
</script>

<style>
.marker-wrapper {
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}

.marker-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.current-location-marker .marker-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
```