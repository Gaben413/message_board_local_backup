<template>
    <div>
        <div v-if="!edit" id="display-cell-grid" class="cell">
            <button class="cell-button" @click="$emit('del', cell_data['bwl_id'])">X</button>
            <label for="">{{ cell_data['bwl_id'] }} - Number: {{ edit_tp_number }} | {{ edit_comm }}</label>
            <button class="cell-button" @click="toggle_edit">EDIT</button>
        </div>
        <div v-else id="edit-cell-grid" class="cell">
            <div>
                <label for="">Number: </label>
                <input type="number" name="" id="" v-model="edit_tp_number">
            </div>
            <div>
                <label for="">Comment: </label>
                <input type="text" name="" id="" v-model="edit_comm">
            </div>
            <div>
                <button class="cell-button" @click="save">Save</button>
                <button class="cell-button" @click="toggle_edit">Cancel</button>
            </div>
            
        </div>
    </div>

</template>

<script>
    //import settings from '@/assets/frontend-settings.json'
    import axios from 'axios'
    export default{
        name: "BW_CellComponent",
        props: ['cell_data'],
        data(){
            return{
                edit: false,
                edit_tp_number: 0,
                edit_comm: "",

                //axios_link: `http://${settings['axios_ip']}:${settings['axios_port']}/`,

                //token: localStorage.getItem("board-access-token") || ""
            }
        },
        mounted(){
            this.edit_tp_number = this.cell_data['tp_number']
            this.edit_comm = this.cell_data['comm']
        },
        methods:{
            toggle_edit(){
                this.edit_tp_number = this.cell_data['tp_number'];
                this.edit_comm = this.cell_data['comm'];
                this.edit = !this.edit;
            },
            async save(){
                this.edit = false;
                //SUBMIT THE CHANGE

                let request_obj = {
                    id: this.cell_data['bwl_id'],
                    tp_number: this.edit_tp_number,
                    comm: this.edit_comm
                }
                
                axios.put(`${this.$store.state.axios_link}bw_lists/update_blacklist`, request_obj, {headers: {'board-access-token': this.$store.state.token}}).then((res) => {
                    console.log(res)
                    this.refresh()
                })
            },
        }
    }
</script>

<style>
    #display-cell-grid{
        display: grid;
        grid-template-columns: auto 500px auto;

        justify-content: center;

        margin: 10px 15px;
    }
    #edit-cell-grid{
        display: grid;
        grid-template-columns: auto auto 200px;
        margin: 10px 25px;
    }
    .cell{
        padding: 5px;

        background: rgb(221,255,218);
        background: radial-gradient(circle, rgba(221,255,218,1) 0%, rgba(255,255,255,0) 100%); 
    }

    .cell-button{
        margin: 0px 5px;
        padding: 5px 10px;

        background-color: rgb(0, 180, 0);

        border-radius: 5px;
        border-style: none;
    }
    .cell-button:hover{
        background-color: darkgreen;
    }
    .cell-button:active{
        background-color: #003a00;
    }
    @media only screen and (max-width: 600px){
        #display-cell-grid{
            grid-template-columns: auto;
        }
        .cell-button{
            width: 50px;
            margin: 5px auto;
        }

        #edit-cell-grid{
            grid-template-columns: auto;
            gap: 5px;
        }
        #edit-cell-grid > div{
            grid-template-columns: auto;
            gap: 5px;
        }
        #edit-cell-grid .cell-button{
            margin: 0px 5px;
            width: 75px;
        }
    }
</style>