<template>
    <h1>SETTINGS</h1>
    <div id="bw-div">
        <h2>Black and White LIST</h2>
        <div id="bw-grid" v-if="authenticated">
            <div id="black-list">
                <h4>Blacklist</h4>
                <BW_CellComponent v-for="entry in blacklist" :cell_data="entry" @del="delete_entry" />
                <button @click="create_entry('black')" v-if="!new_black_entry">NEW ENTRY</button>
                <div v-else>
                    <label for="">Number: </label> <input type="text" name="" id="" v-model="new_black_tp_number">
                    <label for="">Comment</label> <input type="text" name="" id="" v-model="new_black_comm">
                    <button @click="save('black')">Save</button>
                    <button @click="cancel('black')">Cancel</button>
                </div>
            </div>
            <div id="devider"></div>
            <div id="white-list">
                <h4>Whitelist</h4>
                <BW_CellComponent v-for="entry in whitelist" :cell_data="entry" @del="delete_entry" />
                <button @click="create_entry('white')" v-if="!new_white_entry">NEW ENTRY</button>
                <div v-else>
                    <label for="">Number: </label> <input type="text" name="" id="" v-model="new_white_tp_number">
                    <label for="">Comment</label> <input type="text" name="" id="" v-model="new_white_comm">
                    <button @click="save('white')">Save</button>
                    <button @click="cancel('white')">Cancel</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import settings from '@/assets/frontend-settings.json'

    import BW_CellComponent from '@/components/BW_CellComponent.vue'
    import axios from 'axios'

    export default{
        components:{
            BW_CellComponent
        },
        data(){
            return{
                blacklist: [],
                whitelist: [],

                new_black_entry: false,
                new_white_entry: false,

                new_black_tp_number: "",
                new_black_comm: "",

                new_white_tp_number: "",
                new_white_comm: "",

                authenticated: false,

                axios_link: `http://${settings['axios_ip']}:${settings['axios_port']}/`,

                token: localStorage.getItem("board-access-token") || ""
            }
        },
        mounted() {
            this.get_list_data()

        },
        methods:{
            async get_list_data(){
                console.log("Reload")
                axios.get(`${this.axios_link}bw_lists/get_all_blacklist`, {headers: {'board-access-token': this.token}})
                .then((res) => {
                    this.authenticated = true;

                    this.blacklist = res.data
                    console.log(this.blacklist)
                }).catch(err => {
                    this.authenticated = false;

                    console.log(`Error: ${err}`)
                })
                
                axios.get(`${this.axios_link}bw_lists/get_all_whitelist`, {headers: {'board-access-token': this.token}})
                .then((res) => {
                    this.authenticated = true;

                    this.whitelist = res.data
                    console.log(this.whitelist)
                }).catch(err => {
                    this.authenticated = false;
                    console.log(`Error: ${err}`)
                })
            },

            async create_entry(type){
                if(type == "black"){
                    this.new_black_entry = true
                } else if(type == "white"){
                    this.new_white_entry = true
                }
            },
            async save(type){
                if((this.new_black_tp_number.trim() == "") && type == "black" || (this.new_white_tp_number.trim() == "" && type == "white")) return;
                
                let tp_number;
                let comm;

                if(type == "black"){
                    tp_number = this.new_black_tp_number
                    comm = this.new_black_comm
                }else if(type == 'white'){
                    tp_number = this.new_white_tp_number
                    comm = this.new_white_comm
                }

                let post_obj = {
                    list_type: type,
                    tp_number: Number(tp_number),
                    comm: comm
                }

                axios.post(`${this.axios_link}bw_lists/create_bw_entry`, post_obj, {headers: {'board-access-token': this.token}}).then((res) => {
                    console.log(res)
                    this.cancel(type)
                    this.get_list_data()

                })

            },
            async cancel(type){
                if(type == "black"){
                    this.new_black_tp_number = ""
                    this.new_black_comm = ""
                    this.new_black_entry = false
                }else if(type == "white"){
                    this.new_white_tp_number = ""
                    this.new_white_comm = ""
                    this.new_white_entry = false
                }
            },
            async delete_entry(id){
                axios.delete(`${this.axios_link}bw_lists/delete_entry/${id}`, {headers: {'board-access-token': this.token}}).then((res) => {
                    console.log(res)
                    this.get_list_data()
                })
                console.log(`Delete Entry ${id}`);
            },
        }
    }
</script>

<style>

    #bw-grid{
        display: grid;
        grid-template-columns: 49% 1px 49%;
    }
    #devider{
        background-color: black;
    }

    @media only screen and (max-width: 600px){
        #bw-div{
            padding-bottom: 200px;
        }
        #bw-grid{
            display: block
        }
        #devider{
            margin-top: 10px;
            height: 2px;
            width: 100%;
        }
    }
    
</style>