<template>
    <div>
        <div id="container" @click="to_thread" v-if="!show_fav">
            <p id="header-text">{{ data.t_number }} | {{ data.t_sub }} - {{ data.t_board }}</p>

            <div id="content">
                <img :src="data.filepath" alt="threadImage" class="img-min image-item">
                <p v-for="line in remove_anchor(data.p_com).split('<br>')" class="content-p">{{ line }}</p>
            </div>
            

            <p id="bottom-content">
                <span v-if="data.t_archived" >Archived</span>
                <span v-else>On Going</span>
                - Posts: {{ data.t_replies_amount }}
            </p>
        </div>

        <div v-else>
            <h4>Add to favourites</h4>
            <select name="" id="" @change="check_fav" v-model="fav_index">
                <option v-for="fav in fav_array" :value="fav.f_id">{{ fav.f_name }}</option>
            </select>

            <br>

            <button v-if="!thread_in_fav" @click="add_to_fav">Add</button>
            <button v-else @click="remove_from_fav">Remove</button>

            <button @click="toggle_fav_div">Cancel</button>
        </div>

        <button @click="toggle_fav_div" :hidden="show_fav">FAV</button>

        <p>{{ display_date }}</p>
    </div>
</template>

<script>
import style_sheet from '@/assets/style-sheet.json'
import router from '@/router'

import axios from 'axios'

export default{
    name: 'ThreadComponent',
    props: ['data','fav_array'],
    data(){
        return{
            show_fav: false,
            thread_in_fav: false,
            fav_index: 1,

            fav_list: [0],

            display_date: "",
            border_color: "#008a22",
            body_color: "#90ee90",
            bottom_color: "#e2ffe2",
            text_color: "black"
        }
    },
    mounted(){
        this.check_fav()
        
        this.update_visual_data()
    },
    updated(){
        this.update_visual_data()
    },
    methods:{
        update_visual_data(){
            let date = new Date(this.data.t_date);

            let week_day = (() => {
                if(date.getDay() == 0)
                    return "Sunday";
                else if(date.getDay() == 1)
                    return "Monday";
                else if(date.getDay() == 2)
                    return "Tuesday";
                else if(date.getDay() == 3)
                    return "Wednesday";
                else if(date.getDay() == 4)
                    return "Thursday";
                else if(date.getDay() == 5)
                    return "Friday";
                else if(date.getDay() == 6)
                    return "Sartuday";
                else return "Error"
            })();

            this.display_date = `(${week_day}) ${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes().toString().padStart(2,'0')}:${date.getSeconds().toString().padStart(2,'0')}`

            for(const key in style_sheet){
                if(style_sheet[key]["boards"].includes(this.data.t_board)){
                    this.border_color = style_sheet[key]["style"]['border_color'];
                    this.body_color = style_sheet[key]["style"]['body_color'];
                    this.bottom_color = style_sheet[key]["style"]['bottom_color'];
                    this.text_color = style_sheet[key]["style"]['text_color'];
                }
            }
        },
        remove_anchor(str){            
            let output = (str.replaceAll(/<a [^>]+>|<\/a>/g, '')).replaceAll('&gt;&gt;', '>>');

            return output;
        },
        to_thread(){
            router.push({name: 'thread', params: {t_number: this.data.t_number}})
            console.log(`Moving to Thread Nº ${this.data.t_number}`);
        },
        toggle_fav_div(){
            this.check_fav()
            this.show_fav = !this.show_fav;
        },
        check_fav(){
            axios.get(`${this.$store.state.axios_link}favourites/stock/get_favourites_with_thread/${this.data.t_number}`, {headers: {'board-access-token': this.$store.state.token}})
            .then(res => {
                this.fav_list = []
                for (let i = 0; i < res.data.favs.length; i++) {
                    this.fav_list.push(res.data.favs[i]['f_id'])
                    
                }

                if(this.fav_list.includes(this.fav_index)){
                    this.thread_in_fav = true
                }else{
                    this.thread_in_fav = false
                }
            }).catch(err => {
                console.error(err)
            })
        },
        remove_from_fav(){
            let body = {
                f_id: this.fav_index,
	            t_number: this.data.t_number
            }
            axios.delete(`${this.$store.state.axios_link}favourites/stock/delete_thread_in_favourite`, {headers: {'board-access-token': this.$store.state.token}, data: body})
                .then(res => {
                    console.log(res.data)
                }).catch(err => {
                    console.error(err)
                })
                
            this.toggle_fav_div()
        },
        add_to_fav(){
            let body = {
                f_id: this.fav_index,
	            t_number: this.data.t_number
            }
            axios.post(`${this.$store.state.axios_link}favourites/stock/add_thread`, body, {headers: {'board-access-token': this.$store.state.token}})
            .then(res => {
                console.log(res.data)
            }).catch(err => {
                console.error(err)
            })
            this.toggle_fav_div()
        }
    }
}
</script>

<style>
#container{

    /*padding: 5px;*/

    overflow: hidden;

    margin: 15px;

    background: v-bind(body_color);

    border-style: solid;
    border-radius: 10px;
    border-color: v-bind(border_color);    

    width: fit-content;    
    max-width: 500px;

    transition: all 0.25s;
}
#container:hover{
    cursor: pointer;

    transform:translate(-5px, -5px) ;

    box-shadow: 10px 10px 5px rgba(0, 100, 0, 0.5);
}

#header-text{
    margin: 0px;

    text-align: center;

    color: v-bind(text_color);
    background-color: v-bind(border_color);
}

#content{
    min-height: 150px;
    padding: 5px;
}

.content-p{
    margin: 5px;
    text-align: left;
}

#bottom-content{
    margin: 0px;
    background-color: v-bind(bottom_color);
}

.image-item{
    float: left;
    margin-right: 15px;
}

.img-min{
    height: 150px;
}
.img-max{
    height: 350px;
}

</style>