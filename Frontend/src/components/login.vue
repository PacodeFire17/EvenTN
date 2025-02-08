<script setup>

    import {ref} from 'vue';

    let success = ref(false);
    let message = ref('');

    async function login(Uusername,Upassword) {
        const url = new URL("https://eventn-83ey.onrender.com/api/v1/users/authenticate");

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({username:Uusername,password:Upassword}),
            headers: { "Content-Type": "application/json" }
        });

        const data = await response.json();

        if ( response.status == 200 ){
            document.role = data.role;
            document.AuthNToken = data.AuthNToken;
            document.userId = data.id;
            console.log(data.id);
            success.value = true;
        }

        console.log(data.message);
    }

</script>

<template>
    <body class="logi">
    <main class="max-w-6xl mx-auto p-6 h-screen flex flex-col items-center justify-center">
        <div class="max-w-md content-box">
            <h2 class="text-3xl font-bold text-center mb-6">Benvenuto!</h2>
            <form @submit.prevent="">
                <div class="mb-4">
                    <label class="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            class="h-4 w-4 opacity-70">
                            <path
                                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                            <path
                                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                        </svg>
                        <input v-model="username" type="text" class="grow" placeholder="username"/>
                    </label>
                </div>
                <div class="mb-4">
                    <label class="input input-bordered flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor"
                            class="h-4 w-4 opacity-70">
                            <path fill-rule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clip-rule="evenodd"/>
                        </svg>
                        <input v-model="password" type="password" class="grow" placeholder="Password"/>
                    </label>
                </div>
                <div class="mb-4">
                    <button class="btn btn-info w-full" @click="login(username,password)">Accedi</button>
                </div>
                <div class="text-center mb-4">
                    <p class="text-lg">oppure</p>
                </div>
                <div>
                    <button class="btn btn-secondary w-full">Registrati</button>
                </div>
            </form>
        </div>
        <div v-if="success" class="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
            <div class="bg-white p-6 rounded shadow-lg">
                <h3 class="text-xl font-semibold mb-4">Bentornato</h3>
                <div class="flex justify-end">
                    <button class="btn btn-primary" @click="$emit('close')">OK</button>
                </div>
            </div>
        </div>
    </main>
    </body>
</template>

<style>
    .logi {
        background-image: url('../../StaticFrontend/Wallpaper.webp');
        background-size: cover;
        background-position: center;
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
        background-color: rgba(255, 255, 255, 0.3); 
        padding: 2rem;
        border-radius: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
</style>