<template>
  <div class="home">
    <h1>Thread Lists</h1>
    <div class="threads" v-if="threads_data.length">
      <div v-for="data in threads_data" :key="data.key" class="thread-comp">
        <ThreadComponent :data="data" @click="test(data.key)"/>
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
    test(input){
      //router.push('/about')
      
      router.push({name: 'thread', params: this.threads_data[input-1]})

      //console.log(input-1)
      //console.log(this.threads_data[input-1].t_number);
    }
  }
}
</script>

<style>
body{
  background: rgb(221, 255, 218);
  margin: 0;

  display: flex;
  flex-direction: column;
}
h1{
  color: darkgreen;
  background: rgb(57, 196, 57);
}
</style>