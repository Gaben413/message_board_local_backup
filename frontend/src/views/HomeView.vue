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

      console.log(this.threads_data)
    }).catch(err => {
      this.autheticated = false;
      console.log(`Error: ${err}`)
    })
    
  },
  methods: {

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