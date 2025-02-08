<script setup>
    import {getTransitionRawChildren, ref} from 'vue';
    import explorePage from './explorePage.vue';
    import loginPage from './login.vue';
    import reservedPage from './reservedPage.vue';
    let role = ref('unknown');
    const PAGE = {
        login:'login',
        explore:'explore',
        reserved:'reserved'
    }
    let page = ref(PAGE.explore);
    function changePage(newP){
        console.log('Changing to '+newP);
        page.value = newP;
    }
    function logout(){
        role.value='unknown';
        document.role = '';
        document.AuthNToken = '';
        document.userId = '';
        changePage(PAGE.login);
    }
    function oklogin(){
        changePage(PAGE.reserved);
        role.value = document.role;
    }
    function getRole(){
        return role.value;
    }

</script>

<template>
<body class="bg-gray-100">
    <header class="flex justify-between items-center p-4 bg-blue-400 shadow-md">
        <h1 class="text-3xl font-bold text-white">EvenTN</h1>
        <div class="flex items-center space-x-4">
            <div class="dropdown dropdown-end">
                <label tabindex="0" class="btn btn-outline">🌐 Cambia Lingua</label>
                <ul tabindex="0" class="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li>
                        <a>
                            <img src="../../StaticFrontend/italian_flag.jpeg" alt="Italiano" class="inline w-6 h-4 mr-2">
                            Italiano
                        </a>
                    </li>
                </ul>
            </div>
            <button class="btn btn-outline" @click="changePage(PAGE.explore)">🔍 Esplora Eventi</button>
            <button v-if="role !== 'unknown'" class="btn btn-outline" @click="changePage(PAGE.reserved)">Area riservata</button>
            <button v-else class="btn btn-outline" @click="changePage(PAGE.login)">Login</button>
            <button v-if="role !== 'unknown'" class="btn btn-outline" @click="logout()">Logout</button>
        </div>
    </header>
    <main class="max-w-6xl mx-auto p-6">
            <explorePage v-if="page===PAGE.explore" :role="getRole()"/>
            <loginPage v-else-if="page===PAGE.login" @close="()=>{oklogin()}"/>
            <reservedPage v-else :role="getRole()"/>
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