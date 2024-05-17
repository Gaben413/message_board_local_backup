<template>
    <div v-if="!logged">
        <h1>Login</h1>
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
        <h1>Welcome {{ display_user_data.username }}</h1>

        <h3>Admin: {{ display_user_data.admin }} | Verified: {{ display_user_data.verified }}</h3>
        
        <p>Creation: {{ display_user_data.createdAt }} | Update: {{ display_user_data.updatedAt }}</p>
        <button @click="logout">Logout</button>
    </div>
</template>

<script>
    import axios from 'axios'
    import router from '@/router'

    //import settings from '../assets/frontend-settings.json'

    export default{
        data(){
            return{
                username: "",
                password: "",
                logged: true,

                display_user_data: {
                    username: "",
                    admin: false,
                    verified: false,
                    createdAt: "",
                    updatedAt: ""
                }
                //axios_link: `http://${settings['axios_ip']}:${settings['axios_port']}/`,
                //token: localStorage.getItem("board-access-token") || ""
            }
        },
        mounted(){
            //console.log(`Token: ${this.token}`)
            axios.get(`${this.$store.state.axios_link}is_logged`, {headers: {'board-access-token': this.$store.state.token}}).then(res => {
                this.display_user_data = res.data.user_data
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

                console.log(this.$store.state.axios_link)

                axios.post(`${this.$store.state.axios_link}login`, login).then(res => {
                    localStorage.setItem("board-access-token", res.data.token)
                    this.$store.commit('storageSetToken', res.data.token);
                    console.log(res.data);

                    router.push({path: '/'})
                })

                console.log(login);
            },
            async check(){
                axios.get(`${this.$store.state.axios_link}test`, {headers: {'board-access-token': this.$store.state.token}}).then(res => {
                    console.log(res)
                })
            },
            async logout(){
                console.log(`Logging out token: ${this.$store.state.token}`)
                axios.post(`${this.$store.state.axios_link}logout`, {body: "Test body"}, {headers: {'board-access-token': this.$store.state.token}}).then(res => {
                    console.log(res);
                    localStorage.setItem("board-access-token", "")
                    //this.token = ""
                    this.$store.commit('storageSetToken', "");
                    this.logged = false;
                })

            }
        }
    }
</script>