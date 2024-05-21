<template>
    <h1>Status</h1>

    <h4>{{ (fullsize*1e-6).toFixed(3) }} M ({{ fullsize }} B)</h4>

    <div id="status-grid">
        <ThreadStatusComponent v-for="status in status_data" :status="status" :fullsize="fullsize" />
    </div>
</template>

<script>
import ThreadStatusComponent from "@/components/ThreadStatusComponent.vue";
import axios from 'axios';
export default{
    components:{
        ThreadStatusComponent
    },
    data(){
        return{
            fullsize: 0,
            status_data: []
        }
    },
    beforeMount(){
        axios.get(`${this.$store.state.axios_link}status/individual`).then(res => {
            console.log(res.data)
            this.fullsize = res.data.individual_data.fullsize

            let threads = res.data.threads;

            for (let i = 0; i < threads.length; i++) {
                let data = res.data.individual_data.individual_size.find(element => element.thread_num == threads[i].t_number)
                console.log(data)
                this.status_data.push({
                    number: threads[i].t_number,
                    board: threads[i].t_board,
                    date: threads[i].t_date,
                    archived: threads[i].t_archived,
                    sub: threads[i].t_sub,
                    replies: threads[i].t_replies,

                    data: data
                })   
            }
        })
    }
}
</script>

<style>
#status-grid{
    display: grid;
    grid-template-columns: 25% 25% 25% 25%;
}
</style>