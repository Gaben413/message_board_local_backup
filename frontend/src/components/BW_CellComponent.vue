<template>
    <div>
        <div v-if="!edit">
            <button @click="$emit('del', cell_data['bwl_id'])">X</button>
            <label for="">{{ cell_data['bwl_id'] }} - Number: {{ edit_tp_number }} | {{ edit_comm }}</label>
            <button @click="toggle_edit">EDIT</button>
        </div>
        <div v-else>
            <label for="">Number: </label> <input type="text" name="" id="" v-model="edit_tp_number">
            <label for="">Comment</label> <input type="text" name="" id="" v-model="edit_comm">
            <button @click="save">Save</button>
        </div>
    </div>

</template>

<script>
    import settings from '@/assets/frontend-settings.json'
    import axios from 'axios'
    export default{
        name: "BW_CellComponent",
        props: ['cell_data'],
        data(){
            return{
                edit: false,
                edit_tp_number: 0,
                edit_comm: "",
                axios_link: `http://${settings['axios_ip']}:${settings['axios_port']}/`

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
                this.edit = true;
            },
            async save(){
                this.edit = false;
                //SUBMIT THE CHANGE

                let request_obj = {
                    id: this.cell_data['bwl_id'],
                    tp_number: this.edit_tp_number,
                    comm: this.edit_comm
                }
                
                axios.put(`${this.axios_link}bw_lists/update_blacklist`, request_obj).then((res) => {
                    console.log(res)
                    this.refresh()
                })
            },
        }
    }
</script>