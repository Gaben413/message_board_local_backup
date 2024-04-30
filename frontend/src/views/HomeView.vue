<template>

    <div id="error-div" v-if="!autheticated">
      <div id="error-body">
        <h1>Failed to Authenticate</h1>
        <h2>Please login to access site's contents</h2>

        <a href="/login">LOGIN</a>
      </div>
    </div>

  <div id="home">
    <h1>Thread Lists</h1>

    <label for="">Organize: </label>
    <select name="" id="" @change="organize" v-model="organize_index">
      <option value="1">Archived/Ongoing</option>
      <option value="2">Date: Oldest</option>
      <option value="3">Date: Newest</option>
      <option value="4">By Board</option>
      <option value="5">By Thread Number</option>
      <option value="6">By Title</option>
      <option value="7">Replies: Ascending</option>
      <option value="8">Replies: Descending</option>
    </select>

    <div class="threads" v-if="threads_data.length" id="threads-grid">

      <ThreadComponent v-for="data in threads_data" :key="data.key" class="thread-comp" :data="data"/>

    </div>
    
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import PostComponent from '@/components/PostComponent.vue'
import ThreadComponent from '@/components/ThreadComponent.vue'
import router from '@/router'

import settings from '../assets/frontend-settings.json'
import axios from 'axios'

export default {
  name: 'HomeView',
  components: {
    PostComponent,
    ThreadComponent
  },
  data(){
    return{
      threads_data: [],
      organize_index: 1,
      dummy_data: [
        {name: "name1", t_number: "10", t_archived: 1, key: 1},
        {name: "name2", t_number: "20", t_archived: 0, key: 2},
        {name: "name3", t_number: "30", t_archived: 1, key: 3},
      ],

      autheticated: false,

      token: localStorage.getItem("board-access-token") || ""
    }
  },
  mounted(){
    let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
    
    axios.get(`${axios_link}vue/get_threads/`,  {headers: {'board-access-token': this.token}})
    .then((res) => {
      this.autheticated = true;
      let keyNumber = 1;

      res.data.forEach(data => {
        Object.assign(data, {key: keyNumber})
        this.threads_data.push(data)

        keyNumber++;
      });

      this.organize()

      console.log(this.threads_data)
    }).catch(err => {
      this.autheticated = false;
      console.log(`Error: ${err}`)
    })
    
  },
  methods: {
    organize(){
      console.log(`Organizing Thread: ${this.organize_index}`)

      this.threads_data.sort((a,b) => {
        //Later replace with a switch
        if(this.organize_index == 1){
          //Archived
          return a["t_archived"] - b["t_archived"]
        }else if(this.organize_index == 2){
          //Oldest
          return parseFloat(new Date(a["t_date"]).getTime()) - parseFloat(new Date(b["t_date"]).getTime())
        }else if(this.organize_index == 3){
          //Newest
          return parseFloat(new Date(b["t_date"]).getTime()) - parseFloat(new Date(a["t_date"]).getTime())
        }else if(this.organize_index == 4){
          //Board
          let text_a = a["t_board"].toLowerCase();
          let text_b = b["t_board"].toLowerCase();
          return (text_a < text_b) ? -1 : (text_a > text_b) ? 1 : 0;
        }else if(this.organize_index == 5){
          //Number
          return parseFloat(a["t_number"]) - parseFloat(b["t_number"])
        }else if(this.organize_index == 6){
          //Title
          let text_a = a["t_sub"].toLowerCase();
          let text_b = b["t_sub"].toLowerCase();
          return (text_a < text_b) ? -1 : (text_a > text_b) ? 1 : 0;
        }else if(this.organize_index == 7){
          return parseFloat(a["t_replies_amount"]) - parseFloat(b["t_replies_amount"])
        }else if(this.organize_index == 8){
          return parseFloat(b["t_replies_amount"]) - parseFloat(a["t_replies_amount"])
        }
      })
    }
  }
}
</script>

<style>
#error-div{
  position: absolute;

  width: 100%;
  height: 100%;

  background-color: #0000005d;
}
#error-body{
  margin: 100px auto auto auto;

  width: 25%;

  padding: 25px;

  border-radius: 15px;
  
  background-color: #90ee90;
}

#home{
  padding: 5px;
  display: fixed;

  top: 0;
  left: 0;

  background: rgb(255,255,255);
  background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(221,255,218,1) 100%); 
  min-height: 100%;
}

#threads-grid{
  display: grid;
  
  grid-template-columns: auto auto auto auto;
  
  gap: 5px;


}
.thread-comp{
  margin: auto;
}
</style>