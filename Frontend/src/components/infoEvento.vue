<script setup>
    import {ref} from 'vue';
    const props = defineProps({
        event: Object,
    });

    let showBookingBanner = ref(false);
    let role = ref(document.role);
    let bookingSeats = ref(1);
    let showConfirmationBanner = ref(false);
    let confirmationMessage = ref('');

    async function confirmBooking(howMany){
        const url = new URL('https://eventn-83ey.onrender.com/api/v1/events/'+props.event.id+'/bookings');

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({AuthNToken: document.AuthNToken, howMany: howMany}), // non c'è bisogno di controlli perchè c'è bisogno di esssere autenticati come cittadino per vedere il bottone
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if ( response.status == 201 ){
            confirmationMessage.value = 'La prenotazione è andata a buon fine';
            showBookingBanner.value = false;
        } else {
            console.log(response.status);
            console.log(data.message);
            confirmationMessage.value = data.message;
        }

        showConfirmationBanner.value = true;
    }

    async function deleteEvent() {
        const url = new URL('https://eventn-83ey.onrender.com/api/v1/events/'+props.event._id);
        url.searchParams.append('AuthNToken',document.AuthNToken);

        const response = await fetch(url, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if ( response.status == 200 ){
            confirmationMessage.value = 'Evento cancellato';
        } else {
            console.log(response.status);
            console.log(data.message);
            confirmationMessage.value = data.message;
        }

        showConfirmationBanner.value = true;
    }

    async function approveEvent() {
        const url = new URL('https://eventn-83ey.onrender.com/api/v1/events/'+props.event._id);

        const response = await fetch(url, {
            method: "PUT",
            body: JSON.stringify({AuthNToken: document.AuthNToken}), // non c'è bisogno di controlli perchè c'è bisogno di esssere autenticati per vedere il bottone
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if ( response.status == 200 ){
            confirmationMessage.value = 'Evento approvato';
        } else {
            console.log(response.status);
            console.log(data.message);
            confirmationMessage.value = data.message;
        }

        showConfirmationBanner.value = true;
    }

</script>

<template>
    <div class="max-w-4xl mx-auto p-6 max-h-[90vh] overflow-auto">
        <div class="card lg:card-side bg-base-100 shadow-xl">
            <figure><img :src="'data:image/jpeg;base64,'+ props.event.image" alt="Evento" /></figure>
            <div class="card-body">
                <h2 class="card-title text-2xl font-semibold">{{ props.event.name }}</h2>
                <div v-if="role==='townhall'">
                    <button v-if="props.event.approved" class="btn btn-outline btn-success btn-xs">APPROVATO</button>
                    <button v-else class="btn btn-outline btn-error btn-xs">NON APPROVATO</button>
                </div>
                <p class="text-lg text-gray-700">{{ props.event.description }}</p>
                <div class="divider"></div>
                <p><strong>Data:</strong> Da {{ props.event.startDate.day }}/{{ props.event.startDate.month }}/{{ props.event.startDate.year }} fino a {{ props.event.endDate.day }}/{{ props.event.endDate.month }}/{{ props.event.endDate.year }} alle {{ props.event.endDate.hour }}:{{ props.event.endDate.minutes }}</p>
                <p><strong>Orario:</strong> {{ props.event.startDate.hour }}:{{ props.event.startDate.minutes }}</p>
                <p><strong>Luogo:</strong> {{ props.event.location.address }}</p>
                <p v-if="props.event.needBooking">La prenotazione è <strong>necessaria</strong></p>
                <div class="divider"></div>
                <div v-if="role==='townhall'">
                    <p><strong>Posti massimi:</strong> {{ props.event.maxSeats }}</p>
                    <p><strong>Postin prenotati:</strong> {{ props.event.bookedSeats }}</p>
                    <p><strong>Risorse necessarie:</strong> {{ props.event.resources }}</p>
                </div>
                <div class="card-actions justify-end">
                    <button v-if="role === 'citizen' && props.event.needBooking" class="btn btn-primary" @click="showBookingBanner = true">Prenota posto</button>
                    <div v-else-if="role === 'townhall'">
                        <button class="btn btn-secondary" @click="approveEvent()">Approva Evento</button>
                        <button class="btn btn-error" @click="deleteEvent()">Elimina evento</button>
                    </div>
                    <button class="btn btn-accent btn-outline" @click="$emit('close')">Chiudi</button>
                </div>
            </div>
        </div>

        <!-- Banner per la prenotazione -->
        <div v-if="showBookingBanner" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Quanti posti vuoi prenotare?</h3>
                <input type="number" v-model="bookingSeats" class="input input-bordered w-full mb-4" min="1">
                <div class="flex justify-end space-x-2">
                    <button class="btn btn-secondary" @click="showBookingBanner = false">Annulla</button>
                    <button class="btn btn-primary" @click="confirmBooking(bookingSeats)">Conferma</button>
                </div>
            </div>
        </div>

        <!-- Banner di conferma -->
        <div v-if="showConfirmationBanner" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-lg">
                <h3 class="text-xl font-semibold mb-4">{{ confirmationMessage }}</h3>
                <div class="flex justify-end">
                    <button class="btn btn-primary" @click="showConfirmationBanner = false">OK</button>
                </div>
            </div>
        </div>
    </div>
</template>