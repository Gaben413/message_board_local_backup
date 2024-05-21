<template>
    <div class="storage-cell">
        <div class="tooltip">
            <span class="tooltiptext">{{ status.number }} {{ percentage.toFixed(2) }}% {{ (status.data.size*1e-6).toFixed(3) }}MB</span>
        </div> 
    </div>
</template>

<script>
export default{
    props: ['status', 'fullsize'],
    name: 'StorageBarComponent',
    data(){
        return{
            percentage: 0,
            percentage_div_dize: '50%'
        }
    },
    beforeMount(){
        let total = this.fullsize;
        let current = this.status.data.size;
        this.percentage = (current/total)*100

        this.percentage_div_dize = `${this.percentage}%`
    }
}
</script>

<style>
.storage-cell{
    height: 50px;
    width: v-bind(percentage_div_dize);

    background-color: pink;

    border-color: black;
    border-width: 0px 0px 0px 0px;
    border-style: solid;
    
    transition: all 0.125s;
}
.storage-cell:hover{
    transform: scale(1.125);
    background-color: red;
    border-width: 0px;

}

/* Tooltip container */
.tooltip {
    height: 100%;
    width: 100%;
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black; /* If you want dots under the hoverable text */
}

/* Tooltip text */
.tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: black;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;
 
    /* Position the tooltip text - see examples below! */
    position: absolute;
    z-index: 1;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltiptext {
    visibility: visible;
}
</style>