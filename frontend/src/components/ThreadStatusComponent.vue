<template>
    <div class="status-body">
        <h3>{{ status.sub }}</h3>
        <p>Info: {{ status.number }} | {{ status.board }} - {{ status.archived ? "Archived" : "On going" }} | Replies: {{ status.replies }}</p>

        <p>File Name: "/{{ status.data.filename }}" | Size: {{ (status.data.size*1e-6).toFixed(3) }} M ({{ status.data.size }}B)</p>

        <div class="percentage-div">
            <div class="percentage-bg">
                <div class="percentage-body"></div>
                <p class="percentage-text">{{ percentage.toFixed(2) }}%</p>
            </div>
        </div>
    </div>
    
</template>

<script>
export default{
    props: ['status', 'fullsize'],
    name: 'ThreadStatusComponent',
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
.status-body{
    margin: 5px auto;
    padding: 5px;

    border-width: 2px 0px 2px 0px;
    border-style: solid;
    border-color: black;

}
.percentage-div{
    margin: auto;
    width: 100px;
}
.percentage-div > div{
    height: 25px;
}
.percentage-body{
    position: inherit;
    background-color: green;
    height: 25px;
    width: v-bind(percentage_div_dize);
}
.percentage-bg{
    background-color: red;
    width: 100px;
}
.percentage-text{
    transform: translateY(-21px);

    margin: 0px;

    position: inherit;

    align-self: center;

    color: white;
}
</style>