<template>
  <div id="main-thread">
    <div id="utilities">
      <div>
        <label for="search">Search: </label>
        <input type="text" name="search" @keyup="organize" v-model="search_text">
        <label for="" v-if="search_total != 0"> Posts Found: {{ search_total }}</label>
      </div>

      <div hidden>
        <input type="checkbox" name="raw-content" id="" v-model="raw_model">
        <label for="raw-content">Raw Content</label>
      </div>

      <div id="dp-div">
        <label for="search">Comm Type: </label>
        <select name="" id="com-dropdown" v-model="com_mode" @change="organize">
          <option value="1">RAW</option>
          <option value="2">Plain Text</option>
        </select>
      </div>

      <button id="thread-download" @click="download_thread"><img src="../assets/download.svg" alt="Download" id="download-svg"></button>

    </div>

    <h1 id="TopMain">
      Thread - {{ this.thread_data['t_number'] }} - {{ this.thread_data['t_sub'] }} - {{ this.thread_data['t_board'] }} |

      <a :href="this.thread_data['t_link']" target="_blank">
        <span v-if="this.thread_data['t_archived']">Archived</span>
        <span v-else>On Going</span>
      </a>

    </h1>

    <PostComponent class="post-comp" v-for="data in post_data" :key="data.key"
      :data="data" :test_prop="raw_model"
      :colors="{
        'border_color': border_color,
        'body_color': body_color,
        'bottom_color': bottom_color,
        'text_color': text_color
        }"
      :com_mode="com_mode"
    />
  </div>

  <div id="notification-div" :hidden="!showing_noti" :class="showing_noti ? 'show-notification' : ''">
    <h3>{{ notification_text }}</h3>
  </div>

  <div id="utilities-div" :class="show_utils ? 'show-utils' : 'hide-utils'">
    <button id="tab-button" @click="toggle_tab"><img id="right-arrow-svg" src="../assets/right-arrow.svg" alt=""></button>
    <div>
      <button id="scrollbutton" v-on:click="topFunction">Top</button>
      <button id="scroll-bottom-button" v-on:click="bottomFunction">bottom</button>
      <button id="fetchbutton" class="system-button" v-on:click="manual_fetch">Manual Fetch</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import PostComponent from '@/components/PostComponent.vue'
import ThreadComponent from '@/components/ThreadComponent.vue'
import router from '@/router'
import { useRouter, useRoute } from 'vue-router'

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
      fetching: false,

      show_utils: false,
      util_posX: '-125px',
      util_posY: '50px',

      arrow_invert: 1,

      noti_class: "",
      notification_text: "NOTIFICATION",
      showing_noti: false,

      router: useRouter(),
      route: useRoute(),
      
      thread_data: 'empty',
      post_data: [],
      post_data_raw: [],
      raw_model: true,
      search_text: "",
      search_total: 0,

      com_mode: 2,

      border_color: "#008a22",
      body_color: "#90ee90",
      bottom_color: "#e2ffe2",
      text_color: "black",
      bg_color: "#ddffda",

      button_color: "#006400",
      button_color_hover: "#003600",
      button_text_color: "white",
      
      token: localStorage.getItem("board-access-token") || ""
    }
  },
  beforeMount(){
    document.title = `Thread - ${this.t_number}`
    if(this.route.query.com_mode == undefined) return;

    this.com_mode = this.route.query.com_mode;
  },
  mounted(){
    let scroll_top = document.getElementById("scrollbutton");
    window.onscroll = function() {scrollFunction()};
    function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scroll_top.style.display = "block";
      } else {
        scroll_top.style.display = "none";
      }
    }

    this.get_thread_data()
  },
  methods: {
    get_thread_data(){
      axios.get(`${this.$store.state.axios_link}vue/get_thread_data/${this.t_number}`, {headers: {'board-access-token': this.$store.state.token}})
      .then((res) => {
        this.thread_data = res.data.thread
        this.post_data_raw = res.data.posts

        this.post_data = this.post_data_raw;
        
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
      })
    },
    // When the user clicks on the button, scroll to the top of the document
    topFunction() {
      document.body.scrollTop = 0; // For Safari
      document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    },
    bottomFunction(){
      document.body.scrollTop = document.body.scrollHeight; // For Safari
      document.documentElement.scrollTop = document.body.scrollHeight; // For Chrome, Firefox, IE and Opera
    },
    manual_fetch(){
      if(this.fetching) return;

      this.notification("Fetching Data");

      this.fetching = true;

      //this.token = localStorage.getItem("board-access-token") || "";
      //let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
      
      console.log("Now manually Fetching Thread Data");

      axios.get(`${this.$store.state.axios_link}manual_fetch/`, {headers: {'board-access-token': this.$store.state.token}})
      .then((res) => {
        this.fetching = false;
        console.log(res.data)
        this.notification("Fetch Completed", true);
        this.get_thread_data()
      }).catch(err => console.log(`Error: ${err}`));
    },
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
        //console.log(target_tag)
      }else{
        target_tag = "p_com"
      }
      
      this.post_data = this.post_data_raw.filter(post => {
        //console.log(`POST: ${post[target_tag]}`);
        if(post[target_tag] == null) return;

        if(this.search_text.trim() == "" || !tags.includes(target_tag)){
          return post;
        }else{
          if(post[target_tag].toString().includes(search_content.trim())){
            return post;
          }
        }
      })
      
      if(!this.search_text.match(main_regex))
        this.search_total = 0;
      else
        this.search_total = this.post_data.length;

      //console.log(this.post_data_raw[0]);
    },
    async delay(timeDelay){
      return new Promise(resolve => {
        setTimeout(resolve, timeDelay)
      })
    },
    toggle_tab(){
      console.log("TAB");

      this.show_utils = !this.show_utils;

      if(this.show_utils){
        this.util_posX = 0;
        this.arrow_invert = -1
      }else{
        this.util_posX = '-125px';
        this.arrow_invert = 1
        
      }
    },
    async notification(text, override = false){

      this.notification_text = text;

      if(this.showing_noti && !override) return;
      else if(override) this.showing_noti = false;
      this.showing_noti = true;
      await this.delay(3000);
      this.showing_noti = false;
    },
    organize(){
      router.push({
        query: {
          com_mode: this.com_mode
        }
      });

      this.search()
    }
  }
}
</script>

<style>
#main-thread{
  background-color: v-bind(bg_color);
  padding-bottom: 10px;
}
h1{
  color: v-bind(text_color);
  background: v-bind(border_color);
}

#utilities{
  display: flex;

  margin: 20px 0px 0px 0px;
  padding: 0px 0px;

  height: fit-content;
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
  height: fit-content;
  width: fit-content;
  margin: 5px auto;

  color: v-bind(button_text_color);
  background-color: v-bind(button_color);

  border-width: 0;
  border-radius: 25%;
}
#thread-download:hover{
  background-color: v-bind(button_color_hover);
  cursor: pointer;
}
#download-svg{
  margin: 5px;

  width: 25px;
  height: 25px;
}

#notification-div{
  position: fixed;

  width: 70%;

  left: 25px;
  bottom: 25px;

  border-radius: 15px;

  background-color: green;

  opacity: 0%;

}
#notification-div > h3{
  color: black;
}

.show-notification{
  opacity: 100%;

  animation-duration: 3s;
  animation-name: fadinout;
}
@keyframes fadinout{
  from{
    opacity: 0%;
  }
  10%{
    opacity: 100%;
  }
  90%{
    opacity: 100%;
  }
  to{
    opacity: 0%;
  }
}

#tab-button{
  display: none;
}
#right-arrow-svg{
  width: 50px;
  transform: scaleX(v-bind(arrow_invert));
}

#fetchbutton {

  position: fixed;

  opacity: 75%;

  bottom: 50px;
  right: 120px;
  z-index: 99;
  border: none;
  outline: none;
  background-color: green;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 10px;
  font-size: 18px;

  font-size: 15px;
  font-weight: 250;
}
#fetchbutton:hover {
  background-color: rgb(0, 37, 0);
}

#scrollbutton {
  display: none;
  position: fixed;

  opacity: 75%;

  bottom: 50px;
  right: 30px;
  z-index: 99;
  border: none;
  outline: none;
  background-color: green;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 10px;
  font-size: 18px;

  font-size: 15px;
  font-weight: 250;
}
#scrollbutton:hover {
  background-color: rgb(0, 37, 0);
}
#scrollbutton {
  display: none;
  position: fixed;

  opacity: 75%;

  bottom: 100px;
  right: 30px;
  z-index: 99;
  border: none;
  outline: none;
  background-color: green;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 10px;
  font-size: 18px;

  font-size: 15px;
  font-weight: 250;
}
#scrollbutton:hover {
  background-color: rgb(0, 37, 0);
}
#scroll-bottom-button {
  display: block;
  position: fixed;

  opacity: 75%;

  bottom: 50px;
  right: 30px;
  z-index: 99;
  border: none;
  outline: none;
  background-color: green;
  color: white;
  cursor: pointer;
  padding: 15px;
  border-radius: 10px;
  font-size: 18px;

  font-size: 15px;
  font-weight: 250;
}
#scroll-bottom-button:hover {
  background-color: rgb(0, 37, 0);
}

@media only screen and (max-width: 600px){
  #utilities{
    padding: 10px 0px;
  }
  #main-thread{
    padding-bottom: 35px;
  }
  #notification-div{
    left: 5px;
    bottom: 100px;
  }

  #utilities-div{
    position: fixed;

    bottom: v-bind(util_posY);

    padding: 0px 5px 0px 20px;

    height: max-content;
    width: fit-content;

    background-color: rgba(70, 202, 70, 0.788);

    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
  }
  .show-utils{
    right: 0px;

    transition: right 0.5s;
  }
  .hide-utils{
    right: -125px;

    transition: right 0.5s;
  }

  #tab-button{
    display: block;
    position: absolute;

    left: -65px;

    background-color: darkgreen;

    border-style: none;
    border-radius: 15px;
  }
  
  #fetchbutton{
    display: block;
  }
  #fetchbutton,#scrollbutton,#scroll-bottom-button{
    position: relative;
    bottom: inherit;
    right: inherit;

    margin: 5px auto;
  }
}
</style>