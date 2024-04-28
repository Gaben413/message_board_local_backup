<template>
  <div id="main-thread">

    <div id="utilities">
      <!--
      <div>
        <select name="" id="">
          <option value="1">1</option>
          <option value="2">2</option>
        </select>
        <label for="">Sort By:</label>
      </div>
      -->

      <div>
        <label for="search">Search: </label>
        <input type="text" name="search" @keyup="search" v-model="search_text">
        <label for="" v-if="search_total != 0"> Posts Found: {{ search_total }}</label>
      </div>

      <div hidden>
        <input type="checkbox" name="raw-content" id="" v-model="raw_model">
        <label for="raw-content">Raw Content</label>
      </div>

      <div id="dp-div">
        <label for="search">Comm Type: </label>
        <select name="" id="com-dropdown" v-model="com_mode">
          <option value="1">RAW</option>
          <option value="2">Plain Text</option>
          <option value="3">Processed (WIP)</option>
        </select>
      </div>

      <button id="thread-download" @click="download_thread">Download</button>

    </div>

    <h1 id="TopMain">
      Thread - {{ this.thread_data['t_number'] }} - {{ this.thread_data['t_sub'] }} - {{ this.thread_data['t_board'] }} |
       <a v-if="this.thread_data['t_archived']" :href="this.thread_data['t_link']" target="_blank">Archived</a> <a :href="this.thread_data['t_link']"  target="_blank" v-else>On Going</a>
    </h1>

    <div v-for="data in post_data" :key="data.key" class="thread-comp">
      <PostComponent :data="data" :test_prop="raw_model" :colors="{'border_color': border_color,'body_color': body_color,'bottom_color': bottom_color,'text_color': text_color}" :com_mode="com_mode"/>
    </div>
    <!--
    <div class="threads" v-if="threads_data.length">
      <div v-for="data in threads_data" :key="data.key" class="thread-comp">
        <ThreadComponent :data="data" @click="test(data.key)"/>
      </div>
      
      
      <PostComponent />
      <PostComponent />
      <PostComponent />
      
    </div>
    -->
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import PostComponent from '@/components/PostComponent.vue'
import ThreadComponent from '@/components/ThreadComponent.vue'
import router from '@/router'

import settings from '../assets/frontend-settings.json'
import style_sheet from '@/assets/style-sheet.json'
import axios from 'axios'

import fileDownload from'js-file-download'

export default {
  name: 'HomeView',
  components: {
    PostComponent,
    ThreadComponent
  },
  props: ['t_number'],
  data(){
    return{
      thread_data: 'empty',
      post_data: [],
      post_data_raw: [],
      raw_model: true,
      search_text: "",
      search_total: 0,

      com_mode: 1,

      border_color: "#008a22",
      body_color: "#90ee90",
      bottom_color: "#e2ffe2",
      text_color: "black",
      bg_color: "#ddffda",

      button_color: "#006400",
      button_color_hover: "#003600",
      button_text_color: "white"
    }
  },
  mounted(){
    
    let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
    axios.get(`${axios_link}vue/get_thread_data/${this.t_number}`)
    .then((res) => {
      this.thread_data = res.data.thread
      this.post_data_raw = res.data.posts

      this.post_data = this.post_data_raw;

      //console.log(res.data.thread)
      console.log(this.thread_data)
      console.log(this.post_data)

      console.log(this.thread_data)
      
      for(const key in style_sheet){
        if(style_sheet[key]["boards"].includes(this.thread_data['t_board'])){
          this.border_color = style_sheet[key]["style"]['border_color'];
          this.body_color = style_sheet[key]["style"]['body_color'];
          this.bottom_color = style_sheet[key]["style"]['bottom_color'];
          this.text_color = style_sheet[key]["style"]['text_color'];
          this.bg_color = style_sheet[key]["style"]['bg_color'];

          this.button_color = style_sheet[key]["style"]['button_color'];
          this.button_color_hover = style_sheet[key]["style"]['button_color_hover'];
          this.button_text_color = style_sheet[key]["style"]['button_text_color'];

        }
      }

      console.log(this.border_color)
      console.log(this.body_color)
      console.log(this.bottom_color)
      console.log(this.text_color)
      console.log(this.bg_color)
    })
    
    console.log(this.t_number)
  },
  methods: {
    async download_thread(){
      axios.get(`http://${settings['axios_ip']}:${settings['axios_port']}/file/${this.t_number}`, {
        headers: {
          "get-comments": "true"
        },
        responseType: "arraybuffer"
      }).then((res) => {
        fileDownload(res.data, `thread_${this.t_number}_backup.zip`)
      })
    },
    search(){
      const tags = [
        "p_number",
        "p_name",
        "p_com"
      ]

      let target_tag = "p_com";
      let search_content = "";

      const main_regex = /[a-z]:[\s\S]/g
      const tag_regex = /(.*):/g
      if(this.search_text.match(main_regex)){
        let search_array = this.search_text.split(tag_regex);
        //console.log(search_array[1]);
        //console.log(search_array[2]);

        target_tag = tags.find(tag => tag === search_array[1]);
        search_content = search_array[2];
        console.log(target_tag)
      }else{
        target_tag = "p_com"
      }
      
      this.post_data = this.post_data_raw.filter(post => {
        if(this.search_text.trim() == "" || !tags.includes(target_tag)){
          return post;
        }else{
          if(post[target_tag].includes(search_content.trim())){
            return post;
          }
        }
      })
      
      if(!this.search_text.match(main_regex))
        this.search_total = 0;
      else
        this.search_total = this.post_data.length;

      console.log(this.post_data_raw[0]);
    }
  }
}
</script>

<style>
#main-thread{
  background-color: v-bind(bg_color);

}
h1{
  color: v-bind(text_color);
  background: v-bind(border_color);
}

#utilities{
  display: flex;

  margin: 20px 0px 0px 0px;
  padding: 0px 0px;

  height: 40px;
  width: 100%;

  background-color: v-bind(body_color);

  justify-content: space-around;
}
#utilities > div{
  margin: auto;
}
#utilities > div > label{
  color: black;
}
#TopMain{
  margin-top: 0px;
}

#thread-download{
  /*height: 37px;*/

  margin: 5px 0px;

  color: v-bind(button_text_color);
  background-color: v-bind(button_color);

  border-width: 0;
  border-radius: 25%;
}
#thread-download:hover{
  background-color: v-bind(button_color_hover);
  cursor: pointer;
}
#dp-div{
    margin: auto;
  }
@media only screen and (max-width: 600px) {
  #utilities{
    height: 80px;
  }
  #utilities > div > input{
    width: 125px;
  }
  #thread-download{
    margin: auto;
    height: 50px;
  }
}
</style>