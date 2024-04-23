<template>
    <div class="footerContainer">
        <label>API Status: <span v-if="api_data.api_running">🟢</span><span v-else>🔴</span></label>
        <label>{{ api_data.total_threads }} <span v-if="api_data.total_threads == 1">Thread</span> <span v-else>Threads</span></label>
        <label>Space in use: {{ api_data.used_space }}</label>
        <label class="timerLabel">Running for: {{ time }}</label>
    </div>
</template>

<script>
    import axios from 'axios'
    import settings from '../assets/frontend-settings.json'

    export default{
        name: 'FooterComponent',
        data(){
            return{
                api_data: {
                    "api_running": false,
                },
                time: "00:00:00"
            }
        },
        mounted(){
            /*
            setInterval(() => {
                axios.get(`http://localhost:3000/status`)
                .then((res) => {
                    this.api_data = res.data
                }).catch((err) => {
                    console.log(err)
                })
            }, 1000);
            */
            let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
            //console.log(axios_link)

            axios.get(`${axios_link}status`)
            .then((res) => {
                this.api_data = res.data
            }).catch((err) => {
                console.log(err)
            })

            setInterval(() => {
                let timestamp = new Date().getTime() - this.api_data.api_start_timestamp

                let seconds = Math.floor(timestamp/1000)
                let minutes = Math.floor(seconds/60)
                let hours = Math.floor(minutes/60)

                this.time = `${hours}:${(minutes%60).toString().padStart(2,"0")}:${(seconds%60).toString().padStart(2, "0")}`
            }, 1000);
        }
    }
</script>

<style>
.footerContainer{
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: green;

    width: 100%;
    height: 20px;

    border-top-right-radius: 25px;
    border-top-left-radius: 25px;

    display: flex;
    padding-left: 15px;
    padding-right: 15px;

    justify-content: space-between;
}
.footerContainer > label{
    color: white;
}
.timerLabel{
    padding-right: 25px;
}
</style>