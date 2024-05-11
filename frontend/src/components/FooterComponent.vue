<template>
    <div class="footerContainer">
        <label class="footer-labels">API Status: <span v-if="api_data.api_running">🟢</span><span v-else>🔴</span></label>
        <label class="footer-labels">{{ api_data.total_threads }} <span v-if="api_data.total_threads == 1">Thread</span> <span v-else>Threads</span></label>
        <label class="footer-labels">Space in use: {{ api_data.used_space }}</label>
        <label class="timerLabel footer-labels">Running for: {{ time }}</label>
    </div>
</template>

<script>
    import axios from 'axios'
    //import settings from '../assets/frontend-settings.json'

    export default{
        name: 'FooterComponent',
        data(){
            return{
                api_data: {
                    "api_running": false,
                },
                time: "0 days - 00:00:00",
                
                //token: localStorage.getItem("board-access-token") || ""
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
            //let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
            //console.log(axios_link)

            axios.get(`${this.$store.state.axios_link}status`, {headers: {'board-access-token': this.$store.state.token}})
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
                let days = Math.floor(hours/24);

                this.time = `${days} days - ${hours%24}:${(minutes%60).toString().padStart(2,"0")}:${(seconds%60).toString().padStart(2, "0")}`
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
.footer-labels{
    font-size: inherit;
}

@media only screen and (max-width: 600px) {
    .footerContainer{
        border-top-right-radius: 15px;
        border-top-left-radius: 15px;

        width: auto;
        height: 40px;
    }
    .footerContainer > label{
        overflow-wrap: break-word;
    }
    .footer-labels{
        margin-top: 5px;
        font-size: 10px;
    }
    .timerLabel{
        padding-right: 0px;
    }
}

</style>