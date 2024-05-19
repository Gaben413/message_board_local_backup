<template>
    <h1>Favourite List</h1>

    <div v-if="logged">
        <div id="new-entry-div" :hidden="hide_entry_div">
            <h2>New Entry</h2>
            <h4 class="label-headers">Name</h4>
            <input type="text" v-model="form_name">
            
            <h4 class="label-headers">Description</h4>
            <textarea name="" id="" cols="60" rows="10" v-model="form_desc"></textarea>

            <br>
            <button class="fav-view-buttons" @click="submit">Save</button>
            <button class="fav-view-buttons" @click="toggle_entry_div">Discard</button>
        </div>

        <button class="fav-view-buttons" @click="toggle_entry_div" :hidden="!hide_entry_div">New Entry</button>

        <FavouriteEntryComponent v-for="entry in favourites_entry_array" :entry="entry" @refresh="refresh" />
    </div>

    <div v-else>
        <h2>You are not logged in</h2>
    </div>

</template>

<script>
    import FavouriteEntryComponent from './FavouriteEntryComponent.vue';

    import axios from 'axios';

    export default{
        components: {
            FavouriteEntryComponent
        },
        data(){
            return{
                hide_entry_div: true,
                logged: false,

                form_name: "",
                form_desc: "",

                favourites_entry_array: [],
            }
        },
        beforeMount(){
            axios.get(`${this.$store.state.axios_link}is_logged`, {headers: {'board-access-token': this.$store.state.token}}).then(res => {
                this.logged = true;
            }).catch(err => {
                this.logged = false;
                console.error(err)
            })

            this.refresh()
        },
        methods:{
            toggle_entry_div(){
                this.hide_entry_div = !this.hide_entry_div
            },
            async submit(){
                let body = {
                    entry_name: this.form_name,
                    entry_desc: this.form_desc
                }
                axios.post(`${this.$store.state.axios_link}favourites/stock/create`, body, {headers: {'board-access-token': this.$store.state.token}})
                .then(res => {
                    console.log(res)

                    this.form_name = ""
                    this.form_desc = ""

                    this.toggle_entry_div()
                    this.refresh()
                })
                //console.log(`NAME: ${this.form_name}\nDESC: ${this.form_desc}`)
            },
            async refresh(){
                console.log("REFRESH")
                axios.get(`${this.$store.state.axios_link}favourites/stock/get_all_entries`, {headers: {'board-access-token': this.$store.state.token}})
                .then(res => {
                    console.log(res.data)
                    this.favourites_entry_array = res.data.data;
                })
            }
        }
    }
</script>

<style>
#new-entry-div{
    margin: auto;

    width: 50%;

    border-style: groove;
    border-width: 3px;
    border-color: grey;
}
.label-headers{
    margin-bottom: 0px;
}

.fav-view-buttons{
    padding: 5px 10px;
    margin:5px;

    background-color: #008a22;
    color: white;
    font-size: 13px;

    border-style: none;
    border-radius: 15px;
}
.fav-view-buttons:hover{
    background-color: #004912;
}
.fav-view-buttons:active{
    background-color: #00290a;
    font-size: 12px;
    transform: scale(0.90);
}
</style>