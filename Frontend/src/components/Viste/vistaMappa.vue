<script setup>
    import {ref, onMounted} from 'vue';
    import 'leaflet/dist/leaflet.css';
    import L from 'leaflet';
    import infoEvento from '../infoEvento.vue';
    const props = defineProps({
        events: Array
    });
    let showEvent = ref(false);
    let eventToShow;
    let map;

    async function getEvent(id) {
        const role = document.role || 'unknown';
        eventToShow = props.events.find(oggetto => oggetto.id === id);
        if( role === 'townhall' || role === 'organization'){
            const url = new URL('https://eventn-83ey.onrender.com/api/v1/events/'+eventToShow.id);
            url.searchParams.append('AuthNToken',document.AuthNToken);

            const response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();

            if ( response.status == 200 ){
                eventToShow = data;
            } else {
                console.log(response.status);
                console.log(data.message);
            }
        }

        showEvent.value = !showEvent.value;
    };

    //logica per la mappa
                
    async function viewEvent(event) {
        const eventDetails = encodeURIComponent(JSON.stringify(event));
        window.location.href = `infoEvento.html?event=${eventDetails}`;
    }
    async function initMap() {
        map = L.map('map').setView([46.0667, 11.1167], 13); // Coordinate di Trento con zoom 13

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        addMarkersToMap();
    }
    async function addMarkersToMap() {
        if (map && props.events.length > 0) {
            props.events.forEach(event => {
                const marker = L.marker([event.location.lat, event.location.lng])
                    .addTo(map)
                    .bindTooltip(`<b>${event.name}</b><br>${event.location.address}`, {
                        permanent: false,
                        direction: 'top',
                        offset: L.point(0, -10)
                    })
                    .on('click', () => {
                        getEvent(event.id);
                    });
            });
        }
    }

    onMounted(() => { initMap() });
</script>

<template>
    <body class="body">
    <div id="map" class="mb-6"></div>
    <div v-if="showEvent" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center" style="z-index: 2;">
        <infoEvento :event="eventToShow" @close="showEvent = false"/>
    </div>
    </body>
</template>

<style>
    html, body {
        height: 100%;    
        margin: 0;      
        padding: 0;     
    }

    body {
        background-color: #add8e6;  
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;         }

    
    header {
        background-color: #87CEEB;  
        font-family: 'Poppins', sans-serif; 
    }
    h1 {
        font-family: 'Poppins', sans-serif; 
    }
    .button-fixed {
        position: fixed;
        bottom: 10px;
        left: 10px;
        z-index: 9999;
    }
    #map {
        height: 500px; 
        width: 80%; 
        border-radius: 15px; 
        margin: 0 auto; 
        position: relative;
        z-index: 1;
    }
    .center-text {
        text-align: center;
    }
    .spaced-content {
        margin-top: 20px; 
    }
    .current-view {
        background-color: #990000;
        color: #000; 
        font-weight: bold; 
    }
</style>