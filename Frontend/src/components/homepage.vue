<script setup>
    import {ref} from 'vue';
    import vistaElenco from './vistaElenco.vue';
    import vistaCalendario from './vistaCalendario.vue';
    import creaEvento from './creaEvento.vue';
    const viste = {
        ELENCO: 'elenco',
        CALENDARIO: 'calendario',
        MAPPA: 'mappa'
    }

    let events = ref([]);
    const tags = [  
                    {id:1,text: 'Musica', restStyle: "btn btn-sm btn-outline btn-primary", activeStyle: "btn btn-sm btn-active btn-primary"},
                    {id:2,text: 'Arte', restStyle: "btn btn-sm btn-outline btn-secondary", activeStyle: "btn btn-sm btn-active btn-secondary"},
                    {id:3,text: 'Cinema', restStyle: "btn btn-sm btn-outline btn-accent", activeStyle: "btn btn-sm btn-active btn-accent"},
                    {id:4,text: 'Teatro', restStyle: "btn btn-sm btn-outline btn-info", activeStyle: "btn btn-sm btn-info"},
                    {id:5,text: 'Sport', restStyle: "btn btn-sm btn-outline btn-success", activeStyle: "btn btn-sm btn-success"},
                    {id:6,text: 'Altro', restStyle: "btn btn-sm btn-outline btn-warning", activeStyle: "btn btn-sm btn-warning"}
                ];
    let vistaCorrente = ref(viste.ELENCO);
    let tagsToSearch = ref([]);
    let role = document.role || 'unknown';
    let newEvent = ref(false);

    function getClass(tag){
        return tagsToSearch.value.includes(tag) ? tag.activeStyle : tag.restStyle;
    }

    function cambiaVista(newVista){
        vistaCorrente.value = newVista;
    }

    async function searchWords(eventName) {
        const url = new URL("https://eventn-83ey.onrender.com/api/v1/events/search/type");
        url.searchParams.append('name',eventName);

        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if ( response.status != 200 )
            events.value = [];
        else{
            events.value = data;
        }
    }

    async function insertDeleteTag(tag){

        if(tagsToSearch.value.includes(tag)){ // il tag è già dentro
            tagsToSearch.value.splice(tagsToSearch.value.indexOf(tag),1);
        } else { // devo inserire il tag
            tagsToSearch.value.push(tag)
        }

        if(tagsToSearch.value.length>0)
            await searchTags();
        else
            await getAllEvents(true);
    }

    async function searchTags() {
        const url = new URL("https://eventn-83ey.onrender.com/api/v1/events/search/tags");

        const search = []
        tagsToSearch.value.map(e=>search.push(e.text));

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(search),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if ( response.status != 200 )
            events.value = [];
        else{
            events.value = data;
        }
    }

    async function getAllEvents(approved) {
        const url = new URL("https://eventn-83ey.onrender.com/api/v1/events");
        url.searchParams.append('approved',approved);

        if(!approved){
            url.searchParams.append('AuthNToken',document.AuthNToken);
        }

        const response = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if ( response.status != 200 )
            events.value = [];
        else{
            events.value = data;
            console.log(events.value);
        }
    }

    document.addEventListener('DOMContentLoaded', async (event) => {
        console.log('La pagina è stata caricata!');
        await getAllEvents(true);
    });

</script>

<template>
<body class="bg-gray-100">
    <header class="flex justify-between items-center p-4 bg-white shadow-md">
        <h1 class="text-3xl font-bold" @click="getAllEvents(true)">EvenTN</h1>
        <div class="flex items-center space-x-4">
            <button class="btn btn-outline">🌐 Cambia Lingua</button>
            <button class="btn btn-outline">🔒Login</button>
        </div>
    </header>
    <main class="max-w-6xl mx-auto p-6">
        <div class="flex justify-center mb-6">
            <input v-model="eventName" @keyup.enter="searchWords(eventName)" type="text" placeholder="Cerca evento" class="input input-bordered w-full max-w-lg bg-white">
            <button v-if="role === 'townhall'" class="btn btn-neutral" @click="getAllEvents(false)">Eventi non approvati</button>
        </div>
        <div class="flex justify-center mb-6 space-x-2">
            <button v-for="tag in tags" :key="tag.id" :class="getClass(tag)" @click="insertDeleteTag(tag)">{{ tag.text }}</button>
        </div>
        <div v-if="vistaCorrente===viste.ELENCO">
            <h2 class="text-2xl font-bold mb-6">I prossimi eventi a Trento</h2>
            <vistaElenco :events="events"/>
        </div>
        <div v-else-if="vistaCorrente===viste.CALENDARIO">
            <h2 class="text-2xl font-bold mb-6">Quando i prossimi eventi a Trento?</h2>
            <vistaCalendario :events="events"/>
        </div>
        <div v-else> <!--vistaCorrente===viste.MAPPA-->

        </div>
        <div class="fixed bottom-0 left-0 p-4">
            <div class="tripartite-button">
                <button @click="cambiaVista(viste.ELENCO)" class="btn btn-active btn-secondary">Elenco</button>
                <button @click="cambiaVista(viste.MAPPA)" class="btn btn-active btn-secondary">Mappa</button>
                <button @click="cambiaVista(viste.CALENDARIO)" class="btn btn-active btn-secondary">Calendario</button>
            </div>

            <div v-if="role==='organization'" class="fixed bottom-0 right-0 p-4">
                <button class="btn btn-outline" @click="newEvent = true">Nuovo evento</button>
            </div>
        </div>

        <div v-if="newEvent" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <creaEvento @close="newEvent = false"/>
        </div>
    </main>
    </body>
</template>