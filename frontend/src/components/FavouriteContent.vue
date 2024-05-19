<template>
    <h1>Favourite Content</h1>
    <p>{{ id }}</p>

    <div v-if="display_threads_data.length" id="threads-grid">
        <ThreadComponent class="thread-comp" v-for="data in display_threads_data" :key="data.key" :data="data" :current_f_id="parseInt(id)" />
    </div>

</template>

<script>
    import ThreadComponent from './ThreadComponent.vue';

    import axios from 'axios';

    export default{
        components:{
            ThreadComponent
        },
        props: ['id'],
        data(){
            return{
                thread_data: [],
                display_threads_data: []
            }
        },
        beforeMount(){
            axios.get(`${this.$store.state.axios_link}favourites/stock/get_thread_in_favourite/${this.id}`,  {headers: {'board-access-token': this.$store.state.token}}).then(res => {
                //this.thread_data = res.data.data

                let keyNumber = 1;

                this.threads_data = []

                res.data.data.forEach(data => {
                    Object.assign(data, {key: keyNumber})
                    this.threads_data.push(data)

                    keyNumber++;
                });

                this.display_threads_data = this.threads_data;

                console.log(res.data.data)
            })
        }
    }
</script>

<style>
#threads-grid{
  display: grid;
  
  grid-template-columns: auto auto auto auto;
  
  gap: 5px;
}
.thread-comp{
  margin: auto;
}
</style>