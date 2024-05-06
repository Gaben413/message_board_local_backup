<template>
    <h1>Login</h1>

    <div v-if="!logged">
        <h4>USERNAME</h4>
        <input type="text" name="" id="" v-model="username">
        <h4>PASSWORD</h4>
        <input type="password" name="" id="" v-model="password">
        <br><br>
        <button @click="submit">Login</button>
        <!--
        <button @click="check">CHECK</button>
        -->
    </div>
    <div v-else>
        <h3>You are already logged</h3>
        <button @click="logout">Logout</button>
    </div>
    <!--
    <p>{{ logged }}</p>
    -->
</template>

<script>
    import axios from 'axios'
    import router from '@/router'

    import settings from '../assets/frontend-settings.json'

    export default{
        data(){
            return{
                username: "",
                password: "",
                logged: true,
                axios_link: `http://${settings['axios_ip']}:${settings['axios_port']}/`,
                token: localStorage.getItem("board-access-token") || ""
            }
        },
        mounted(){
            //console.log(`Token: ${this.token}`)
            axios.get(`${this.axios_link}is_logged`, {headers: {'board-access-token': this.token}}).then(res => {
                this.logged = true;
            }).catch(err => {
                this.logged = false;
            })
        },
        methods:{
            async submit(){
                if(this.username.trim() == "" || this.password.trim() == "") return;

                let login = {
                    username: this.username,
                    password: this.password
                }

                console.log(this.axios_link)

                axios.post(`${this.axios_link}login`, login).then(res => {
                    localStorage.setItem("board-access-token", res.data.token)
                    console.log(res.data);

                    router.push({path: '/'})
                })

                console.log(login);
            },
            async check(){
                axios.get(`${this.axios_link}test`, {headers: {'board-access-token': this.token}}).then(res => {
                    console.log(res)
                })
            },
            async logout(){
                console.log(`Logging out token: ${this.token}`)
                axios.post(`${this.axios_link}logout`, {body: "Test body"}, {headers: {'board-access-token': this.token}}).then(res => {
                    console.log(res);
                    localStorage.setItem("board-access-token", "")
                    this.token = ""
                    this.logged = false;
                })

            }
        }
    }
</script>