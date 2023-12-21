<template>
    <div class="container">
        <div class="item1">
            <p class="header-text">{{ data.t_number }} | {{ data.t_sub }} - {{ data.t_board }}</p>
        </div>
        <img :src="data.filepath" alt="threadImage" class="img-min item2">
        <p class="item3">{{ data.p_com }}</p>
        <div class="item4">
            <p v-if="data.t_archived" class="archived-text">archived</p>
            <p v-else class="archived-text">on going</p>

            <p class="date-text">{{ data.t_date }}</p>
        </div>
    </div>
    
</template>

<script>
export default{
    name: 'ThreadComponent',
    props: ['data'],
    data(){
        return{
            
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
/*
.content{
    position: relative;
    margin: 15px;

    background: lightgreen;

    border-style: solid;
    border-radius: 10px;
    border-color: rgb(0, 138, 34);

    min-width: 450px;
    min-height: 200px;

    width: fit-content;    

    max-height: 750px;
    max-width: 75%;
}


.header-div{
    background: rgb(0, 138, 34);
}
.header-div > p{
    margin: 0;
    padding-left: 15px;

    color: white;
    text-align: left;
}



.bottom-div{
    position: absolute;
    bottom: 0;

    width: 100%;
    height: 18px;

    background: rgb(226, 255, 226);
    border-radius: 0 0 6px 6px;
}
.bottom-div > p{
    margin: 0;
    padding-right: 15px;

    text-align: right;
}
*/
</style>