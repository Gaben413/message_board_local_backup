<template>
    <div v-if="!show_delete_div">
        <h3>ENTRY {{ entry.f_id }}</h3>
        <p>{{ entry.f_name }}</p>
        <p>{{ entry.f_description }}</p>
        <button @click="to_favourite_page(entry.f_id)">GO</button>
        <button @click="toggle_delete_div">DELETE</button>
    </div>
    <div v-else>
        <h3>Do you want to delete Fav Entry "{{ entry.f_name }}"</h3>
        <button @click="delete_entry(entry.f_id)">YES</button>
        <button @click="toggle_delete_div">NO</button>
    </div>

</template>

<script>
    import router from '@/router'

    import axios from 'axios';

    export default{
        name: 'FavouriteEntryComponent',
        props: ['entry'],
        data(){
            return{
                show_delete_div: false
            }
        },
        methods: {
            to_favourite_page(id){
                router.push({name: 'content', params: {id: id}})
            },
            toggle_delete_div(){
                this.show_delete_div = !this.show_delete_div;
            },
            async delete_entry(id){

                let body = {
                    f_id: id
                }
                
                axios.delete(`${this.$store.state.axios_link}favourites/stock/delete_entry`, {headers: {'board-access-token': this.$store.state.token}, data: body})
                .then(res => {
                    console.log(res.data)
                    this.$emit('refresh')
                }).catch(err => {
                    console.error(err)
                })
                
            }
        }
    }
</script>