<template>
    <div class="container" :id="'p'+data.p_number">
        <div class="item1">
            <p class="header-text"> {{ (data.key + 1) }} - {{ data.p_number }} | {{ data.p_name }} | <a v-for="reply in post_reply" :href="reply" class="reply tooltip">@ <span class="tooltiptext">{{ reply }}</span></a></p>
        </div>
        <img :src="data.img_data.file_path" alt="threadImage" class="img-min item2" v-if="data.img_data.has_image">
        <div class="item3">
            <div v-for="com in com_obj">
                <a :href="'#'+com.href" v-if="com.type == 'reply'">{{ com.content }}</a>
                <p v-else :class="com.type">{{ com.content }}</p>
            </div>
            <!--
            <p v-for="line in comment.split('\n')">{{ line }}</p>
            -->
        </div>
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
            comment: "",
            post_reply: [],
            com_obj: []
        }
    },
    mounted(){
        console.log(`${this.data.key} - ${this.data.img_data.has_image}`)
        console.log(this.data.p_com)

        if(this.data.p_com != null){
            let r = /<a(.*?)<\/a>/gs
            let r_href = /href="#(.*?)"/g
            let r_quote = /<span class="quote">(.*?)<\/span>/gs

            let split_com = this.data.p_com.split("<br>")

            for (let i = 0; i < split_com.length; i++) {

                let com_type = "com"
                let com_href = ''
                let com_content = split_com[i]
                if(split_com[i].match(r)) {
                    com_type = "reply"
                    com_href = (split_com[i].replace(/<a href="#(.*?)/g, '')).replace(/" class(.*?)<\/a>/g, '')
                    com_content = `>> ${com_href}`
                } else if(split_com[i].match(r_quote)) {
                    com_type = "quote"
                    com_content = (split_com[i].replace('<span class="quote">&gt;','>')).replace('</span>','')
                }

                let obj = {
                    type: com_type,
                    href: com_href,
                    content: com_content
                }
                this.com_obj.push(obj)  
            }

            //this.com_obj = split_com

            /*
            this.comment = ((this.data.p_com).replace(r, ">>Link to another post<< ")).replaceAll("<br>","\n")

            //href treatment
            let split_com = (this.data.p_com.trim()).split(r)

            console.log(split_com)
            console.log(`Replying to: ${(split_com.length-1)/2}`)

            split_com.forEach(element => {
                if(element.includes('href="#'))
                    this.post_reply.push("#" + element.split(/href="#(.*?)"/g)[1])
            });

            console.log(this.post_reply)
            */
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
    color: black;

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

.com{
    color: black;
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

.quote{
    color: darkolivegreen;
    text-decoration-line: underline;
}

.archived-text{
    float: left;
}
.date-text{
    font-size: 10px;

    margin: 0;

    align-self: center;
}

.reply{
    color: rgb(0, 26, 0);
}

.tooltip{
    position: relative;
    display: inline-block;
    border-bottom: 1px dotted black;
}

.tooltip .tooltiptext{
    visibility: hidden;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    padding: 5px 0;
    border-radius: 6px;

    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;

    opacity: 0;
    transition: opacity 0.3s;
}

.tooltip .tooltiptext::after{
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
}

.tooltip:hover .tooltiptext{
    visibility: visible;
    opacity: 1;
}
</style>