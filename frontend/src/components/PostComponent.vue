<template>
    <div class="post-container" :id="'p'+data.p_number">

        <p id="post-header-text">
             {{ (data.key + 1) }} - {{ data.p_number }} | {{ data.p_name }} | <a v-if="com_mode != 3" v-for="reply in post_reply" :href="reply" class="reply">{{ reply }}<!--<span class="tooltiptext">{{ reply }}</span>--></a>
        </p>

        <div id="post-contents">
            <img :src="data.img_data.file_path" alt="threadImage" :id="'img_'+data.p_number" class="img-min_p img-max_p post-image" v-if="data.img_data.has_image" v-on:click="ChangeImageZoom(data.p_number)">

            <p class="regular-com" v-if="com_mode == 1" v-for="line in comment.split('\n')" id="raw_content">{{ line }}</p>

            <p class="regular-com" v-else-if="com_mode == 2" v-for="text in plaintext_com.split('\n')">{{ text }}</p>

            <div v-else-if="com_mode == 3">
                <div v-for="com in com_obj">
                    <a v-if="com.type == 'Anchor' && com.split.length == 1" class="anchor-com" :href="com.url">{{ com.contents }}</a>
                    <p v-else-if="com.type == 'Anchor' && com.split.length > 1" class="regular-com">
                        <span v-for="row in com.split">
                            <a v-if="row.anchor" :href="row.url">{{ row.content }}</a>
                            <span v-else>{{ row.content }}</span>
                        </span>
                    </p>
                    <p v-else :class="com.class">{{ com.contents }}</p>
                </div>
            </div>
        </div>

        <p id="date-text">{{ display_date }}</p>
        
    </div>
    
</template>

<script>
export default{
    name: 'PostComponent',
    props: ['data', 'test_prop', 'colors', 'com_mode'],
    data(){
        return{
            comment: "",

            post_reply: [], //Don't remove yet, might be some use later

            plaintext_com: "", //PLAINTEXT

            com_obj: [], //Processed Comment

            display_date: "",

            border_color: "#008a22",
            body_color: "#90ee90",
            bottom_color: "#e2ffe2",
            text_color: "black"
        }
    },
    mounted(){
        let date = new Date(this.data.p_date);
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
        //console.log(`${this.data.key} - ${this.data.img_data.has_image}`)
        //console.log(this.data.p_com)

        //console.log(this.data)

        if(this.data.p_com != null){
            /*
            //PROCESSED
            let r_href = /href="#(.*?)"/g
            let r_quote = /<span class="quote">(.*?)<\/span>/gs

            let split_com = this.data.p_com.split("<br>")

            for (let i = 0; i < split_com.length; i++) {

                let com_type = "com p-com"
                let com_href = ''
                let com_content = split_com[i]
                if(split_com[i].match(r)) {
                    com_type = "reply"
                    com_href = (split_com[i].replace(/<a href="#(.*?)/g, '')).replace(/" class(.*?)<\/a>/g, '')
                    com_content = `>> ${com_href}`
                } else if(split_com[i].match(r_quote)) {
                    com_type = "quote p-com"
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
            */

            let regex_anchor = /<a(.*?)<\/a>/gs
            const regex_greentext = '<span class="quote">&gt;'
            
            //RAW
            this.comment = this.data.p_com.replaceAll("<br>","\n")

            //PLAINTEXT
            this.plaintext_com = (this.comment.replaceAll(/<a [^>]+>|<\/a>|<span [^>]+>|<\/span>/g, '')).replaceAll("&gt;", ">")

            
            //this.comment = ((this.data.p_com).replace(r, ">>Link to another post<< ")).replaceAll("<br>","\n")
            this.comment = (this.data.p_com).replaceAll("<br>","\n")

            //href treatment
            let pt_split_com = (this.data.p_com.trim()).split(regex_anchor)

            //console.log(pt_split_com)
            //console.log(`Replying to: ${(pt_split_com.length-1)/2}`)

            pt_split_com.forEach(element => {
                if(element.includes('href="#'))
                    this.post_reply.push("#" + element.split(/href="#(.*?)"/g)[1])
            });

            //console.log(this.post_reply)

            /*
            const regex_greentext = '<span class="quote">&gt;'
            const regex_anchor = /<a href="#(.*?)/;

            let text_array = raw_text.split('<br>');

            console.log(text_array)

            for (let i = 0; i < text_array.length; i++) {
                if(text_array[i].match(regex_greentext)){
                    console.log(`ID: ${i} | Green Text`)
                }else if(text_array[i].match(regex_anchor)){
                    console.log(`ID: ${i} | Anchor`)
                }else{
                    console.log(`ID: ${i} | Regular Text`)
                }
            }
            */
            let processed_com = this.data.p_com.split("<br>")

            for (let i = 0; i < processed_com.length; i++) {
                let obj;
                if(processed_com[i].match(regex_greentext)){
                    //console.log(`ID: ${i} | Green Text`)
                    obj = {
                        id: i,
                        type: 'Green Text',
                        class: 'green-text',
                        contents: (processed_com[i].replaceAll('<span class="quote">&gt;','>')).replaceAll('</span>','')
                    }
                }else if(processed_com[i].match(regex_anchor)){
                    //console.log(`ID: ${i} | Anchor`)
                    let split_raw = processed_com[i].replaceAll('a>','a>|~|');
                    split_raw = split_raw.replaceAll('<a','|~|<a');
                    split_raw = split_raw.split('|~|');

                    let split = [];

                    split_raw.forEach(element => {
                        if(element != "")
                            split.push({
                                content: element.match(regex_anchor) ? `>>${(element.replaceAll(/<a href="#p(.*?)/g, '')).replaceAll(/" class(.*?)<\/a>/g, '')}` : element,
                                url: `#${(element.split(/href="#(.*?)"/g)[1])}`,
                                anchor: element.match(regex_anchor) ? true : false
                            })
                    })

                    obj = {
                        id: i,
                        type: 'Anchor',
                        url: `#${(processed_com[i].split(/href="#(.*?)"/g)[1])}`,
                        split: split,
                        contents: `>>${(processed_com[i].replaceAll(/<a href="#p(.*?)/g, '')).replaceAll(/" class(.*?)<\/a>/g, '')}`
                    }
                }else{
                    //console.log(`ID: ${i} | Regular Text`)
                    obj = {
                        id: i,
                        type: 'Regular Text',
                        class: 'regular-com',
                        contents: processed_com[i]
                    }
                }

                if(obj.contents != "")
                    this.com_obj.push(obj)
            }
            if(this.data.key == 291)
                console.log(this.com_obj)
        }

        this.border_color = this.colors['border_color'];
        this.body_color = this.colors['body_color'];
        this.bottom_color = this.colors['bottom_color'];
        this.text_color = this.colors['text_color'];
    },
    methods:{
        ChangeImageZoom(target_id){
            let target_img = document.getElementById('img_'+target_id)

            //console.log(target_img)

            target_img.classList.toggle("img-min_p")
        }
    }
}
</script>

<style>
.post-container{
    margin: 15px;

    background-color: v-bind(body_color);

    border-style: solid;
    border-width: 0px 0px 2px 0px;
    border-radius: 10px 10px 0px 0px;
    border-color: v-bind(border_color);    

    width: fit-content;

    overflow: hidden;
}

#post-header-text{
    color: v-bind(text_color);

    margin: 0;
    padding: 3px 0px 2px 15px;

    text-align: left;

    background-color: v-bind(border_color);
}

#post-contents{
    display: flow-root;
    height: fit-content;
    margin: 5px;
}
.post-image{
    float: left;

    margin-right: 15px;
    margin-bottom: 5px;
}
.regular-com{
    margin: 5px;
    text-align: left;
}

#date-text{
    margin: 0px;

    background-color: v-bind(bottom_color);

    font-size: 12px;
    padding-right: 15px;
    text-align: right;

    bottom: 0px;
}

.reply{
    color: rgb(0, 26, 0);

    margin: 0px 5px 3px 0px;

    text-decoration: none;
    font-size: 10px;
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

.img-min_p{
    width: 150px;
}
.img-max_p{
    max-width: 750px;
}

.green-text{
    color: green;
    text-align: left;
}
.anchor-com{
    display: block;
    width: 100%;
    text-align: left;
}
</style>