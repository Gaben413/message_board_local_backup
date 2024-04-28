<template>
    <div class="container" @click="to_thread">
        <div class="item1">
            <p class="header-text">{{ data.t_number }} | {{ data.t_sub }} - {{ data.t_board }}</p>
        </div>
        <img :src="data.filepath" alt="threadImage" class="img-min item2">
        <div class="item3">
            <p v-for="line in remove_anchor(data.p_com).split('<br>')">{{ line }}</p>
        </div>
        <div class="item4">
            <p v-if="data.t_archived" class="archived-text">archived</p>
            <p v-else class="archived-text">on going</p>
        </div>
    </div>

    <p>{{ display_date }}</p>
    
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
    methods:{
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
.container{
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 0px 0px;

    margin: 15px;

    background: v-bind(body_color);

    border-style: solid;
    border-radius: 10px;
    border-color: v-bind(border_color);    

    width: fit-content;    
    max-width: 500px;
    /*
    max-height: 750px;
    max-width: 75%;
    */
}
/*
.container:hover{
    border-color: rgb(63, 255, 111);
}
*/
.img-min{
    height: 150px;
}
.img-max{
    height: 350px;
}

.header-text{
    margin: 0;

    text-align: left;

    color: v-bind(text_color);
}

.item1{
    margin: 0;

    padding-left: 15px;

    height: fit-content;

    grid-column: 1/5;

    background: v-bind(border_color);
    border-radius: 6px 6px 0 0;
}

.item2{
    margin: 0;
    padding: 0;
}

.item3{
    margin: 0px 0px 0px 10px;
    padding: 0;

    grid-column: 2/5;

    min-width: 250px;

    text-align: left;
}
.item3 > p{
    margin-top: 2px;
    margin-bottom: 5px;
}

.item4{
    margin: 0;
    padding-left: 15px;
    padding-right: 10px;
    background: v-bind(bottom_color);

    height: fit-content;

    grid-column: 1/5;

    align-content: center;

    border-radius: 0 0 6px 6px;
}
.item4 > p{
    width: 100%;
    text-align: center;
    margin: 0;
}

.archived-text{
    float: left;
}
.date-text{
    font-size: 10px;

    margin: 0;

    align-self: center;
}
@media only screen and (max-width: 600px) {
    .container{ 
        margin: 5px;
        max-width: 95%;

    }
    .item1{
        padding-left: 2px;

        width: 100%;

    }
    .item3{
        min-width: 50px;

        text-align: left;
    }
    .item3 > p{
        margin-top: 2px;
        margin-bottom: 5px;

        width: 200px;
        overflow-wrap: break-word;
    }
    .header-text{
        overflow-wrap: break-word;
    }
}
</style>