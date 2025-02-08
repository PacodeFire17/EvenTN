<script setup>
    import {ref,onMounted} from 'vue';
    import vistaElenco from './Viste/vistaElenco.vue';
    import vistaCalendario from './Viste/vistaCalendario.vue';
    import vistaMappa from './Viste/vistaMappa.vue';
    const viste = {
        ELENCO: 'elenco',
        CALENDARIO: 'calendario',
        MAPPA: 'mappa'
    }
    const props = defineProps({role:String})
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
    let role = ref(props.role);

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

    onMounted(async () => {
        console.log('La pagina è stata caricata!');
        await getAllEvents(true);
    });

</script>

<template>
<body class="bg-gray-100">
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
            <h2 class="text-2xl font-bold mb-6">Dove i prossimi eventi a Trento?</h2>
            <vistaMappa :events="events"/>
        </div>
        <div class="fixed bottom-0 left-0 p-4" style="z-index: 2;">
            <div class="tripartite-button">
                <button @click="cambiaVista(viste.ELENCO)" class="btn btn-active btn-secondary">Elenco</button>
                <button @click="cambiaVista(viste.MAPPA)" class="btn btn-active btn-secondary">Mappa</button>
                <button @click="cambiaVista(viste.CALENDARIO)" class="btn btn-active btn-secondary">Calendario</button>
            </div>
        </div>
    </main>
    </body>
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