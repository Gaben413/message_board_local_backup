<template>
  <div id="home">
    <h1>Thread Lists</h1>
    <div class="threads" v-if="threads_data.length" id="threads-grid">
      <div v-for="data in threads_data" :key="data.key" class="thread-comp">
        <ThreadComponent :data="data"/>
      </div>
      
      <!--
      <PostComponent />
      <PostComponent />
      <PostComponent />
      -->
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
      ]
    }
  },
  mounted(){
    let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
    
    axios.get(`${axios_link}vue/get_threads/`)
    .then((res) => {

      let keyNumber = 1;

      res.data.forEach(data => {
        Object.assign(data, {key: keyNumber})
        this.threads_data.push(data)

        keyNumber++;
      });

      console.log(this.threads_data)
    })
    
  },
  methods: {

  }
}
</script>

<style>
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

  /*min-height: 87vh;*/
}
.thread-comp{
  margin: auto;
}
</style>