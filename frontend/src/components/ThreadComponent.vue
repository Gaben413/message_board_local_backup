<template>
    <div>
        <div id="container" @click="to_thread">
            <!--
            <div class="item1">
                <p class="header-text">{{ data.t_number }} | {{ data.t_sub }} - {{ data.t_board }}</p>
            </div>
            -->

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

        <p>{{ display_date }}</p>
    </div>
</template>

<script>
import style_sheet from '@/assets/style-sheet.json'
import router from '@/router'
export default{
    name: 'ThreadComponent',
    props: ['data'],
    data(){
        return{
            display_date: "",
            border_color: "#008a22",
            body_color: "#90ee90",
            bottom_color: "#e2ffe2",
            text_color: "black"
        }
    },
    mounted(){
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