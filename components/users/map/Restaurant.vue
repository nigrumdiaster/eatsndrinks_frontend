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
          <!-- Image on the left -->
          <img
            :src="restaurant.mainimage"
            alt="Restaurant Image"
            class="w-20 h-20 object-cover rounded-l-lg"
          />
          <!-- Text on the right -->
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
    // Create a custom div icon for the marker
    const customIcon = L.divIcon({
      className: 'custom-marker', // Custom CSS class
      html: `
        <div class="marker-wrapper">
          <img src="${restaurant.mainimage}" alt="${restaurant.name}" class="marker-image" />
        </div>
      `,
      iconSize: [50, 50], // Adjust the size of the marker
      iconAnchor: [25, 50], // Anchor the icon (center bottom)
      popupAnchor: [0, -50], // Position of the popup relative to the icon
    });

    // Add the marker with the custom icon
    const marker = L.marker([restaurant.latitude, restaurant.longitude], { icon: customIcon }).addTo(map1.value.leafletObject);
    marker.bindPopup(`<b>${restaurant.name}</b><br>${restaurant.address}`);

    // Store marker in restaurant object for later use
    restaurant.marker = marker;
  });
};

// Fetch restaurants from API using fetch
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

    // Add markers after fetching restaurants
    if (map1.value && map1.value.leafletObject) {
      addMarkersToMap();
    }
  } catch (error) {
    console.error('Error fetching restaurants:', error);
  }
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

  const googleStreets1 = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: 20,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
  });

  wmsLayer1.addTo(map1.value.leafletObject);

  L.control.layers(
    {
      'HCMGIS': wmsLayer1,
      'Google Streets': googleStreets1,
    },
    {},
    { position: 'topright' }
  ).addTo(map1.value.leafletObject);

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
    restaurant.marker.openPopup(); // Open popup when flying to the marker
  }
};

// Fetch data on component mount
onMounted(fetchRestaurants);
</script>

<style>
.marker-wrapper {
  position: relative;
  width: 50px; /* Đảm bảo chiều rộng */
  height: 50px; /* Đảm bảo chiều cao bằng chiều rộng */
  border-radius: 50%; /* Tạo hình tròn */
  overflow: hidden; /* Ẩn phần thừa của ảnh */
  border: 2px solid white; /* Viền trắng */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5); /* Tùy chọn: Thêm bóng */
}

.marker-image {
  width: 100%; /* Đảm bảo ảnh phủ toàn bộ wrapper */
  height: 100%; /* Đảm bảo ảnh phủ toàn bộ wrapper */
  object-fit: cover; /* Đảm bảo ảnh không bị méo */
}
</style>