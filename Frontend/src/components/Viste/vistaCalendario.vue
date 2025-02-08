<script setup>
    import {ref, onMounted} from 'vue';
    import infoEvento from '../infoEvento.vue';
    const props = defineProps({
        events: Array
    });
    let showEvent = ref(false);
    let eventToShow;
    let selectedEvents = ref([]);
    let activeDay = ref('');

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

    const months = [
        'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
        'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
    ];

    let currentDate = new Date(); // Data corrente

    // Funzione per ottenere i giorni di un mese
    function getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    // Funzione per ottenere il giorno della settimana del primo giorno del mese
    function getFirstDayOfMonth(month, year) {
        return new Date(year, month - 1, 1).getDay();
    }

    function isInDate(event,day){
        const startYear = `${event.startDate.year}-`
        const startMonth = ((event.startDate.month<10)?'0'+`${event.startDate.month}-`:`${event.startDate.month}-`);
        const startDay = ((event.startDate.day<10)?'0'+`${event.startDate.day}`:`${event.startDate.day}`);
        const startDate = startYear+startMonth+startDay;

        const endYear = `${event.endDate.year}-`
        const endMonth = ((event.endDate.month<10)?'0'+`${event.endDate.month}-`:`${event.endDate.month}-`);
        const endDay = ((event.endDate.day<10)?'0'+`${event.endDate.day}`:`${event.endDate.day}`);
        const endDate = endYear+endMonth+endDay;

        return (startDate<=day && endDate>=day);
    }

    // Funzione per generare il calendario
    function generateCalendar(month, year) {
        const firstDay = getFirstDayOfMonth(month, year);
        const daysInMonth = getDaysInMonth(month, year);
        const calendarDaysElement = document.getElementById('calendar-days');
        const monthNameElement = document.getElementById('month-name');
        
        // Cambia il nome del mese
        monthNameElement.innerText = `${months[month]} ${year}`;
        
        // Pulisce il calendario precedente
        calendarDaysElement.innerHTML = '';

        // Aggiungi i giorni vuoti prima del primo giorno
        for (let i = 0; i < firstDay; i++) {
            calendarDaysElement.innerHTML += `<div class="empty-day"></div>`; // Giorni vuoti
        }

        // Aggiungi i giorni del mese
        for (let day = 1; day <= daysInMonth; day++) {
            const dayString = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const eventsForDay = props.events.filter(event => isInDate(event,dayString));
            const dayClass = eventsForDay.length > 0 ? 'event-day' : '';

            const dayElement = document.createElement('div');
            dayElement.className = `calendar-day ${dayClass}`;
            dayElement.innerText = day;
            dayElement.addEventListener('click', () => selectDay(day, dayString));

            calendarDaysElement.appendChild(dayElement);            
        }
    }

    // Funzione per navigare tra i mesi
    function changeMonth(offset) {
        currentDate.setMonth(currentDate.getMonth() + offset);
        generateCalendar(currentDate.getMonth(), currentDate.getFullYear());
    }

    // Funzione per selezionare un giorno
    function selectDay(day, date) {
        // Filtra gli eventi per la data selezionata
        const dayEvents = props.events.filter(event => isInDate(event,date));
        
        // Mostra la data selezionata
        activeDay.value = date;

        // Mostra gli eventi nella finestra sotto il calendario
        if (dayEvents.length > 0) {
            selectedEvents.value = dayEvents;
        } else {
            selectedEvents.value = [];
        }
    }

    // Genera il calendario iniziale con il mese e anno correnti
    onMounted(() => { generateCalendar(currentDate.getMonth(), currentDate.getFullYear()); });
</script>

<template>
    <body class="bg-gray-100">

    <main class="max-w-6xl mx-auto p-6">

        <!-- Calendario -->
        <div class="calendar-container bg-white shadow-xl rounded-lg p-6">
            <div class="flex justify-between items-center mb-4">
                <button @click="changeMonth(-1)" class="btn btn-primary">Precedente</button>
                <h2 id="month-name" class="text-2xl font-bold"></h2> <!-- Nome mese -->
                <button @click="changeMonth(1)" class="btn btn-primary">Successivo</button>
            </div>

            <!-- Nomi dei giorni -->
            <div class="calendar-header">
                <div class="text-center">Lun</div>
                <div class="text-center">Mar</div>
                <div class="text-center">Mer</div>
                <div class="text-center">Gio</div>
                <div class="text-center">Ven</div>
                <div class="text-center">Sab</div>
                <div class="text-center">Dom</div>
            </div>

            <!-- Giorni del calendario -->
            <div id="calendar-days" class="calendar-grid mt-4"></div>
        </div>
        
        <!-- Lista eventi sotto il calendario -->
        <div v-if="selectedEvents.length>0" class="event-list">
            <h3 class="text-xl font-bold">Eventi per {{ activeDay }}</h3>
            <div v-for="event in selectedEvents" :key="event.id" class="mb-4">
                <div @click="getEvent(event.id)" class="text-blue-500 underline">
                    <h3 class="font-bold">{{ event.name }}</h3>
                    <p>{{ event.description }}</p>
                </div>
            </div>
        </div>

        <div v-if="showEvent" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <infoEvento :event="eventToShow" @close="showEvent = false"/>
        </div>

    </main>
    </body>
</template>

<style>
    .calendar-container {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        aspect-ratio: 1;
    }

    .calendar-day {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        position: relative;
        transition: background-color 0.3s ease;
    }

    .calendar-day:hover {
        background-color: rgba(0, 0, 0, 0.1);
    }

    .calendar-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        grid-template-rows: repeat(6, 1fr);
    }

    .calendar-header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        gap: 4px;
        text-align: center;
        font-weight: bold;
    }

    .empty-day {
        visibility: hidden;
    }

    .event-day {
        background-color: #FF6347; /* Colore rosso per giorni con eventi */
        color: white;
    }

    .event-list {
        margin-top: 20px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #fff;
    }

    .event-list.active {
        display: block;
    }
</style>