<script setup>
    import {ref} from 'vue';
    import infoEvento from '../infoEvento.vue';
    const props = defineProps({
        events: Array
    });
    let showEvent = ref(false);
    let eventToShow;

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
    }
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="event in props.events" :key="event.id" class="card bg-white shadow-xl">
            <figure><img :src="'data:image/jpeg;base64,'+ event.image" :alt="event.title" /></figure>
            <div class="card-body">
                <h2 class="card-title">{{ event.name }}</h2>
                <p>{{ event.location.address }}</p>
                <p>Da {{ event.startDate.day }}/{{ event.startDate.month }}/{{ event.startDate.year }} alle {{ event.startDate.hour }}:{{ event.startDate.minutes }} fino a {{ event.endDate.day }}/{{ event.endDate.month }}/{{ event.endDate.year }} alle {{ event.endDate.hour }}:{{ event.endDate.minutes }}</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary" @click="getEvent(event.id)">Scopri</button>
                </div>
            </div>
        </div>
    </div>
    <div v-if="showEvent" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <infoEvento :event="eventToShow" @close="showEvent = false"/>
    </div>
</template>