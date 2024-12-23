<script setup>
    import {ref} from 'vue';
    const props = defineProps({
        event: Object,
    });

    let tagsToSearch = ref([]);
    const eventModify = (props.event) ? true : false;
    let confirmationMessage = ref('');
    let showConfirmationBanner = ref(false);
    let showSureBanner = ref(false);

    let base64String;
    let eName = (eventModify) ? ref(props.event.name) : ref('');
    let eDes = (eventModify) ? ref(props.event.description) : ref('');
    let needBooking = (eventModify) ? ref(props.event.needBooking) : ref('false');
    let maxSeats = (eventModify) ? ref(props.event.maxSeats) : ref(0);
    let startDate = (eventModify) ? ref(((props.event.startDate.year<10) ? '0'+props.event.startDate.year : props.event.startDate.year)+'-'+((props.event.startDate.month<10) ? '0'+props.event.startDate.month : props.event.startDate.month)+'-'+((props.event.startDate.day<10) ? '0'+props.event.startDate.day : props.event.startDate.day)) : ref('');
    let startHour = (eventModify) ? ref(((props.event.startDate.hour<10) ? '0'+props.event.startDate.hour : props.event.startDate.hour)+':'+((props.event.startDate.minutes<10)?'0'+props.event.startDate.minutes:props.event.startDate.minutes)) : ref('');
    let endDate = (eventModify) ? ref(((props.event.endDate.year<10) ? '0'+props.event.endDate.year : props.event.endDate.year)+'-'+((props.event.endDate.month<10) ? '0'+props.event.endDate.month : props.event.endDate.month)+'-'+((props.event.endDate.day<10) ? '0'+props.event.endDate.day : props.event.endDate.day)) : ref('');
    let endHour = (eventModify) ? ref(((props.event.endDate.hour<10)?'0'+props.event.endDate.hour:props.event.endDate.hour)+':'+((props.event.endDate.minutes<10)?'0'+props.event.endDate.minutes:props.event.endDate.minutes)) : ref('');
    let resources =(eventModify) ? ref(props.event.resources) : ref('');
    let eVia = (eventModify) ? ref(props.event.location.via) : ref('');
    let eNumb = (eventModify) ? ref(props.event.location.number) : ref('');
    let eCity = (eventModify) ? ref(props.event.location.city) : ref('');
    let eCAP = (eventModify) ? ref(props.event.location.CAP) : ref('');
    let eReg = (eventModify) ? ref(props.event.location.region) : ref('');
    let eCount = (eventModify) ? ref(props.event.location.country) : ref('');

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

    function getBase64(event){ 
        const file = event.target.files[0];
        if (file) { 
            const reader = new FileReader(); 
            reader.onload = (e) => { 
                base64String = e.target.result.split(',')[1]; 
            }; 
            reader.readAsDataURL(file); 
        } 
    }

    async function insertDeleteTag(tag){
        if(tagsToSearch.value.includes(tag)){ // il tag è già dentro
            tagsToSearch.value.splice(tagsToSearch.value.indexOf(tag),1);
        } else { // devo inserire il tag
            tagsToSearch.value.push(tag)
        }
    }

    async function commitChanges(){

        showSureBanner.value = false;

        console.log(eName,eDes,startDate,startHour,needBooking,maxSeats,endDate,endHour,resources,eVia);

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
            via: eVia.value,
            number: eNumb.value,
            city: eCity.value,
            CAP: eCAP.value,
            region: eReg.value,
            country: eCount.value
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
            needBooking: (needBooking.value === 'true'),
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

</script>

<template>
    <div class="max-w-4xl mx-auto p-6 max-h-[90vh] overflow-auto">
        <div class="card bg-base-100 shadow-xl">
            <div class="card-body">
                <h2 v-if="eventModify" class="card-title text-2xl font-semibold">Modifica Evento</h2>
                <h2 v-else class="card-title text-2xl font-semibold">Crea un Nuovo Evento</h2>
                <button class="btn btn-error btn-s flex justify-left" @click="$emit('close')">X</button>
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
                            <input type="text" v-model="eVia" placeholder="Via" class="input input-bordered" required>
                            <input type="number" v-model="eNumb" placeholder="Numero" class="input input-bordered" required>
                            <input type="text" v-model="eCity" placeholder="Città" class="input input-bordered" required>
                            <input type="number" v-model="eCAP" placeholder="CAP" class="input input-bordered" required>
                            <input type="text" v-model="eReg" placeholder="Regione" class="input input-bordered" required>
                            <input type="text" v-model="eCount" placeholder="Stato" class="input input-bordered" required>
                        </div>
                    </div>
                    <div class="form-control">
                        <label class="cursor-pointer label">
                            <span class="label-text">Necessaria Prenotazione</span>
                            <input v-model="needBooking" type="checkbox" class="toggle toggle-primary">
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
                        <input v-if="eventModify" type="file" class="file-input file-input-bordered" @change="getBase64($event)">
                        <input v-else type="file" class="file-input file-input-bordered" required @change="getBase64($event)">
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
                        <div v-for="tag  in tags" :key="tag.id">
                            <button :class="getClass(tag)" @submit.prevent="insertDeleteTag(tag)">{{ tag.text }}</button>
                        </div>
                    </div>
                    <div class="form-control mt-6">
                        <button class="btn btn-primary" @click="showSureBanner = true">Crea Evento</button>
                    </div>
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
</style>