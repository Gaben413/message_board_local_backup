<template>
    <h1>Login</h1>

    <div>
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
    <p>{{ token }}</p>
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
                axios_link: `http://${settings['axios_ip']}:${settings['axios_port']}/`,
                token: localStorage.getItem("board-access-token") || ""
            }
        },
        mounted(){
            //console.log(`Token: ${this.token}`)
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
            }
        }
    }
</script>