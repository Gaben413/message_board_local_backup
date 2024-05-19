<template>
    <div class="fav-entry-body" v-if="!show_delete_div">
        <div v-if="!show_edit_div">
            <h3>ENTRY {{ entry.f_id }}</h3>

            <p>{{ entry.f_name }}</p>
            <p>{{ entry.f_description }}</p>

            <button class="fav-view-buttons" @click="to_favourite_page(entry.f_id)">GO</button>
            <button class="fav-view-buttons" @click="toggle_edit_div">EDIT</button>
            <button class="fav-view-buttons" @click="toggle_delete_div">DELETE</button>
        </div>
        <div v-else>
            <h3>EDIT {{ entry.f_id }}</h3>

            <h4 class="label-headers">Name</h4>
            <input type="text" v-model="update_form_name">
            
            <h4 class="label-headers">Description</h4>
            <textarea name="" id="" cols="60" rows="10" v-model="update_form_desc"></textarea>

            <br>

            <button class="fav-view-buttons" @click="update_entry(entry.f_id)">UPDATE</button>
            <button class="fav-view-buttons" @click="toggle_edit_div">CANCEL</button>
        </div>
        
    </div>
    <div v-else>
        <h3>Do you want to delete Fav Entry "{{ entry.f_name }}"</h3>

        <button class="fav-view-buttons" @click="delete_entry(entry.f_id)">YES</button>
        <button class="fav-view-buttons" @click="toggle_delete_div">NO</button>
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
                update_form_name: "",
                update_form_desc: "",

                show_delete_div: false,
                show_edit_div: false
            }
        },
        methods: {
            to_favourite_page(id){
                router.push({name: 'content', params: {id: id}})
            },
            toggle_delete_div(){
                this.show_delete_div = !this.show_delete_div;
            },
            toggle_edit_div(){
                this.update_form_name = this.entry.f_name
                this.update_form_desc = this.entry.f_description

                this.show_edit_div = !this.show_edit_div;
            },
            async update_entry(id){

                let body = {
                    f_name: this.update_form_name,
                    f_description: this.update_form_desc,
                    f_id: id
                }

                axios.put(`${this.$store.state.axios_link}favourites/stock/update_entry`, body, {headers: {'board-access-token': this.$store.state.token}, data: body}).then(res => {
                    console.log(res.data)

                    this.toggle_edit_div()
                    this.$emit('refresh')
                })
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

<style>
.fav-entry-body{
    margin: 5px auto;

    width: 50%;

    border-width: 2px 0px 2px 0px;
    border-style: solid;
}
</style>