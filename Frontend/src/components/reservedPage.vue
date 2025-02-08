<script setup>
    import {ref,onMounted} from 'vue'
    import infoObj from './infoObj.vue';
    import creaEvento from './creaEvento.vue';
    const props = defineProps({
        role:String
    });

    let objs = ref([]);
    let role = ref(props.role);
    let showEvent = ref(false);
    let createEvent = ref(false);
    let eventToShow = ref({});

    async function init() {
        let response;

        if (role.value === 'citizen'){ // trovo tutte le prenotazioni che ha fatto

            const url = new URL("https://eventn-83ey.onrender.com/api/v1/users/"+document.userId+"/bookings");
            url.searchParams.append('AuthNToken',document.AuthNToken);

            response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            
        } else if (role.value === 'organization'){ // trovo tutti gli eventi che ha fatto

            const url = new URL("https://eventn-83ey.onrender.com/api/v1/users/"+document.userId+"/events");
            url.searchParams.append('AuthNToken',document.AuthNToken);

            response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

        } else if (role.value === 'townhall'){ // trovo tutti gli eventi non approvati

            const url = new URL("https://eventn-83ey.onrender.com/api/v1/events");
            url.searchParams.append('approved',false);
            url.searchParams.append('AuthNToken',document.AuthNToken);

            response = await fetch(url, {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

        }

        const data = await response.json();

        if ( response.status != 200 )
            objs.value = [];
        else{
            objs.value = data;
        }

        console.log(objs.value);
    }

    function inDate(day){
        const today = new Date();
        const eventDate = new Date(day);
        return (eventDate >= today);
    }

    async function getEvent(id) {
        eventToShow = objs.value.find(oggetto => oggetto._id === id);
        if( role === 'townhall' || role === 'organization'){
            const url = new URL('https://eventn-83ey.onrender.com/api/v1/events/'+eventToShow._id);
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

    onMounted(()=>init());
</script>

<template>
    <main class="max-w-6xl mx-auto p-6">
        <h2 v-if="role!=='townhall'" class="text-3xl font-bold text-center mb-6" id="page-title">I tuoi eventi</h2>
        <h2 v-else class="text-3xl font-bold text-center mb-6" id="page-title">Eventi non ancora approvati</h2>
        <div id="events-list" class="content-box w-full title">
            <div v-for="obj in objs" :key="obj._id">
                <div @click="getEvent(obj._id)" class="mb-4 p-4 border rounded-lg bg-white shadow-lg flex justify-between items-center">
                    <div>
                        <h3 v-if="role!=='citizen'" class="text-xl font-bold"><b>{{ obj.name }}</b></h3>
                        <h3 v-if="role==='citizen'" class="text-xl font-bold"><b>{{ obj.eventName }}</b></h3>
                        <p>{{ obj.startDate.day }}/{{ obj.startDate.month }}/{{ obj.startDate.year }} - {{ obj.location.address }}</p>
                        <p v-if="role==='citizen'">Posti prenotati: {{ obj.howMany }}</p>
                        <div>
                            <div v-if="inDate(obj.endDate.year+'-'+obj.endDate.month+'-'+obj.endDate.day)" class="event-status in-programma">
                                Programmato
                            </div>
                            <div v-else class="event-status concluso">
                                Concluso
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <button v-if="role==='organization'" @click="createEvent = true" class="create-event-btn">+</button>
        <div v-if="showEvent" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <infoObj  @close="()=>{showEvent=false;init()}" :event="eventToShow"/>
        </div>
        <div v-if="createEvent" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <creaEvento @close="()=>{createEvent=false;init()}" :event="{}" :eventmodify="false"/>
        </div>
    </main>
</template>

<style>
    html,body {
        height: 100%;
        margin: 0;
        padding: 0;
        background-color: #add8e6;
    }
    body {
        background-size: cover;
        background-position: center;
        background-color: #add8e6;
        font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; 
    }
    header {
        background-color: #87CEEB;  
        font-family: 'Poppins', sans-serif; 
    }
    h1 {
        font-family: 'Poppins', sans-serif; 
    }
    .content-box {
        background-color: rgba(173,216,232, 0.5);
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(173, 216, 230, 0.1);
    }
    .event-status {
        font-weight: bold;
    }
    .in-programma {
        color: green;
    }
    .concluso {
        color: red;
    }
    .create-event-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #34d399;
        border-radius: 50%; 
        width: 60px;  
        height: 60px; 
        padding: 0;  
        color: white;
        font-size: 2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        cursor: pointer;  
    }
</style>