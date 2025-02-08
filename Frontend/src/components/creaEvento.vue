<script setup>
    import {ref,onMounted} from 'vue';
    const props = defineProps({
        event: Object,
        eventmodify: Boolean
    });

    let eventModify = props.eventmodify;
    let tagsToSearch = ref([]);
    let confirmationMessage = ref('');
    let showConfirmationBanner = ref(false);
    let showSureBanner = ref(false);
    let map;
    let marker;

    let base64String;
    let eName = (eventModify) ? ref(props.event.name) : ref('');
    let eDes = (eventModify) ? ref(props.event.description) : ref('');
    let needbooking = (eventModify) ? ref(props.event.needBooking) : ref('false');
    let maxSeats = (eventModify) ? ref(props.event.maxSeats) : ref(0);
    let startDate = (eventModify) ? ref(((props.event.startDate.year<10) ? '0'+props.event.startDate.year : props.event.startDate.year)+'-'+((props.event.startDate.month<10) ? '0'+props.event.startDate.month : props.event.startDate.month)+'-'+((props.event.startDate.day<10) ? '0'+props.event.startDate.day : props.event.startDate.day)) : ref('');
    let startHour = (eventModify) ? ref(((props.event.startDate.hour<10) ? '0'+props.event.startDate.hour : props.event.startDate.hour)+':'+((props.event.startDate.minutes<10)?'0'+props.event.startDate.minutes:props.event.startDate.minutes)) : ref('');
    let endDate = (eventModify) ? ref(((props.event.endDate.year<10) ? '0'+props.event.endDate.year : props.event.endDate.year)+'-'+((props.event.endDate.month<10) ? '0'+props.event.endDate.month : props.event.endDate.month)+'-'+((props.event.endDate.day<10) ? '0'+props.event.endDate.day : props.event.endDate.day)) : ref('');
    let endHour = (eventModify) ? ref(((props.event.endDate.hour<10)?'0'+props.event.endDate.hour:props.event.endDate.hour)+':'+((props.event.endDate.minutes<10)?'0'+props.event.endDate.minutes:props.event.endDate.minutes)) : ref('');
    let resources =(eventModify) ? ref(props.event.resources) : ref('');
    let eLat = (eventModify) ? ref(props.event.location.lat) : ref('');
    let eLng = (eventModify) ? ref(props.event.location.lng) : ref('');
    let eAddress = (eventModify) ? ref(props.event.location.address) : ref('');

    const tags = [  
                    {id:1,text: 'Musica', restStyle: "btn btn-sm btn-outline btn-primary", activeStyle: "btn btn-sm btn-active btn-primary"},
                    {id:2,text: 'Arte', restStyle: "btn btn-sm btn-outline btn-secondary", activeStyle: "btn btn-sm btn-active btn-secondary"},
                    {id:3,text: 'Cinema', restStyle: "btn btn-sm btn-outline btn-accent", activeStyle: "btn btn-sm btn-active btn-accent"},
                    {id:4,text: 'Teatro', restStyle: "btn btn-sm btn-outline btn-info", activeStyle: "btn btn-sm btn-info"},
                    {id:5,text: 'Sport', restStyle: "btn btn-sm btn-outline btn-success", activeStyle: "btn btn-sm btn-success"},
                    {id:6,text: 'Altro', restStyle: "btn btn-sm btn-outline btn-warning", activeStyle: "btn btn-sm btn-warning"}
                ];

    function getClass(tag){
        return tagsToSearch.value.includes(tag) ? tag.activeStyle : tag.restStyle;
    }

    async function insertDeleteTag(tag){
        if(tagsToSearch.value.includes(tag)){ // il tag è già dentro
            tagsToSearch.value.splice(tagsToSearch.value.indexOf(tag),1);
        } else { // devo inserire il tag
            tagsToSearch.value.push(tag)
        }
    }

    async function commitChanges(){

        console.log(needbooking.value + typeof(needbooking.value))
        showSureBanner.value = false;

        console.log (base64String);

        if (eventModify){ // se sto modificando un evento devo prima eliminare l'altra copia e poi ricrearlo
            const url = new URL('https://eventn-83ey.onrender.com/api/v1/events/'+props.event._id);

            const response = await fetch(url, {
                method: "DELETE",
                body: JSON.stringify({AuthNToken: document.AuthNToken}), // non c'è bisogno di controlli perchè c'è bisogno di esssere autenticati per vedere il bottone
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();

            if ( response.status != 200 ){
                console.log(response.status);
                console.log(data.message);
                confirmationMessage.value = data.message;
                showConfirmationBanner.value=true;
                return; // se non riesco a eliminare l'evento non posso andare avanti
            }
        }

        const eventLocation = {
            lat: eLat.value,
            lng: eLng.value,
            address: eAddress.value
        }

        let YMD = startDate.value.split('-');
        let HM = startHour.value.split(':');
        const sDate = {
            day: parseInt(YMD[2]),
            month: parseInt(YMD[1]),
            year: parseInt(YMD[0]),
            hour: parseInt(HM[0]),
            minutes: parseInt(HM[1])
        }

        YMD = endDate.value.split('-');
        HM = endHour.value.split(':');
        const eDate = {
            day: parseInt(YMD[2]),
            month: parseInt(YMD[1]),
            year: parseInt(YMD[0]),
            hour: parseInt(HM[0]),
            minutes: parseInt(HM[1])
        }

        let tags = tagsToSearch.value.map(tag=>tag.text);

        const newEvent = {
            name: eName.value,
            startDate: sDate,
            endDate: eDate,
            location: eventLocation,
            description: eDes.value,
            image: base64String,
            needBooking: (needbooking.value === true),
            tags: tags,
            maxSeats: maxSeats.value,
            resources: resources.value
        }

        const url = new URL('https://eventn-83ey.onrender.com/api/v1/events/');

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({AuthNToken: document.AuthNToken, Event: newEvent}), // non c'è bisogno di controlli perchè c'è bisogno di esssere autenticati per vedere il bottone
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if ( response.status != 201 ){
            console.log(response.status);
            console.log(data.message);
            confirmationMessage.value = data.message;
        } else confirmationMessage.value = 'Successo!';

        showConfirmationBanner.value=true;

    }

    function savePosition() {
        const lat = document.getElementById('lat').innerText;
        const lng = document.getElementById('lng').innerText;
        eLat.value = lat;
        eLng.value = lng;
        console.log(`Posizione salvata: Latitudine ${lat}, Longitudine ${lng}`);
        alert(`Posizione salvata: Latitudine ${lat}, Longitudine ${lng}`);
    }

    onMounted(()=>{

        map = L.map('map').setView([46.0667, 11.1167], 13); // Coordinate di Trento con zoom 13

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        map.on('click', function(e) {
            const { lat, lng } = e.latlng;
            document.getElementById('lat').innerText = lat.toFixed(6);
            document.getElementById('lng').innerText = lng.toFixed(6);

            if (marker) {
                marker.setLatLng(e.latlng);
            } else {
                marker = L.marker(e.latlng).addTo(map);
            }
        });

    })

</script>

<template>
    <div class="max-w-4xl mx-auto p-6 max-h-[90vh] overflow-auto">
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 v-if="eventModify" class="card-title text-2xl font-semibold">Modifica Evento</h2>
                <h2 v-else class="card-title text-2xl font-semibold">Crea un Nuovo Evento</h2>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Nome Evento</span>
                        </label>
                        <input type="text" v-model="eName" placeholder="Nome Evento" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Descrizione</span>
                        </label>
                        <textarea v-model="eDes" placeholder="Descrizione" class="textarea textarea-bordered" required></textarea>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Luogo</span>
                        </label>
                        <div>
                            <input type="text" v-model="eAddress" placeholder="Indirizzo" class="input input-bordered" required>
                            <h2 class="text-2xl font-bold mb-6 center-text spaced-content">Seleziona il luogo dell'evento</h2>
                            <div id="map" class="mb-6"></div>
                            <p class="center-text">Latitudine: <span id="lat"></span></p>
                            <p class="center-text">Longitudine: <span id="lng"></span></p>
                            <div class="center-text">
                                <button class="btn btn-primary mt-4" @click="savePosition()">Salva posizione</button>
                            </div>
                        </div>
                    </div>
                    <div class="form-control">
                        <label class="cursor-pointer label">
                            <span class="label-text">Necessaria Prenotazione</span>
                            <input v-model="needbooking" type="checkbox" class="toggle toggle-primary">
                        </label>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Numero di Posti</span>
                        </label>
                        <input v-model="maxSeats" type="number" placeholder="Numero di Posti Massimi" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Data di inizio</span>
                        </label>
                        <input v-model="startDate" type="date" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Orario di inizio</span>
                        </label>
                        <input v-model="startHour" type="time" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Data di fine </span>
                        </label>
                        <input v-model="endDate" type="date" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Orario di fine</span>
                        </label>
                        <input v-model="endHour" type="time" class="input input-bordered" required>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Immagine</span>
                        </label>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Richiesta Risorse al Comune (facoltativo)</span>
                        </label>
                        <textarea v-model="resources" placeholder="Richiesta Risorse" class="textarea textarea-bordered"></textarea>
                    </div>
                    <div class="form-control">
                        <label class="label">
                            <span class="label-text">Tags</span>
                        </label>
                        <div class="flex justify-center mb-6 space-x-2">
                            <button v-for="tag in tags" :key="tag.id" :class="getClass(tag)" @click="insertDeleteTag(tag)">{{ tag.text }}</button>
                        </div>
                    </div>
                    <div class="form-control mt-6">
                        <button class="btn btn-primary" @click="showSureBanner = true">Crea Evento</button>
                    </div>
            </div>
            <div class="card-actions justify-end">
                <button class="btn btn-accent btn-outline" @click="$emit('close')">Chiudi</button>
            </div>
        </div>
    </div>

    <div v-if="showSureBanner" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow-lg">
            <h3 class="text-xl font-semibold mb-4">Sicuro di voler procedere?</h3>
            <div class="flex justify-end space-x-2">
                <button class="btn btn-secondary" @click="showSureBanner = false">Annulla</button>
                <button class="btn btn-primary" @click="commitChanges()">Conferma</button>
            </div>
        </div>
    </div>

    <div v-if="showConfirmationBanner" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow-lg">
            <h3 class="text-xl font-semibold mb-4">{{ confirmationMessage }}</h3>
            <div class="flex justify-end">
                <button class="btn btn-primary" @click="$emit('close')">OK</button>
            </div>
        </div>
    </div>
</template>

<style>
    .tags-input {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
    }
    .tag {
        background-color: #e2e8f0;
        padding: 5px 10px;
        border-radius: 5px;
        display: flex;
        align-items: center;
    }
    .tag span {
        margin-right: 5px;
    }
    .tag button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 16px;
    }
    .button-custom {
        border: 2px solid #3b82f6; 
        background-color: #3b82f6; 
        color: #ffffff; 
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 16px;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
    }
    .button-custom:hover {
        background-color: #ffffff; 
        color: #3b82f6; 
    }
</style>