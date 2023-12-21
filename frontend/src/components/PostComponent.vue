<template>
    <div class="container" :id="data.p_number">
        <div class="item1">
            <p class="header-text">{{ data.p_number }} | {{ data.p_name }}</p>
        </div>
        <img :src="data.img_data.file_path" alt="threadImage" class="img-min item2" v-if="data.img_data.has_image">
        <p class="item3">{{ data.p_com }}</p>
        <!--
        <a href="#141291547">Go Top</a>
        -->
        <div class="item4">
            <p class="date-text">{{ data.p_date }}</p>
        </div>
        
    </div>
    
</template>

<script>
export default{
    name: 'PostComponent',
    props: ['data'],
    data(){
        return{
            
        }
    },
    mounted(){
        console.log(`${this.data.key} - ${this.data.img_data.has_image}`)
    }
}
</script>

<style>
.container{
    display: grid;
    grid-template-columns: auto auto auto auto;
    gap: 0px 0px;

    margin: 15px;

    background: lightgreen;

    border-style: solid;
    border-radius: 10px;
    border-color: rgb(0, 138, 34);    

    width: fit-content;    

    max-height: 750px;
    max-width: 75%;
}
.container:hover{
    border-color: rgb(63, 255, 111);
}

.img-min{
    height: 150px;
}
.img-max{
    height: 350px;
}

.header-text{
    margin: 0;

    text-align: left;
}

.item1{
    margin: 0;

    padding-left: 15px;

    height: fit-content;

    grid-column: 1/5;

    background: rgb(0, 138, 34);
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

.item4{
    display: flex;
    align-content: center;
    justify-content: space-between;

    margin: 0;
    padding-left: 15px;
    padding-right: 10px;
    background: rgb(226, 255, 226);

    height: fit-content;

    grid-column: 1/5;

    align-content: center;

    border-radius: 0 0 6px 6px;
}
.item4 > p{
    text-align: right;
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
</style>