<template>
  <div class="home">
    <h1 id="TopMain">
      Thread - {{ this.thread_data['t_number'] }} - {{ this.thread_data['t_sub'] }} - {{ this.thread_data['t_board'] }} |
       <a v-if="this.thread_data['t_archived']" :href="this.thread_data['t_link']" target="_blank">Archived</a> <a :href="this.thread_data['t_link']"  target="_blank" v-else>On Going</a>
    </h1>

    <div v-for="data in post_data" :key="data.key" class="thread-comp">
      <PostComponent :data="data"/>
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
import axios from 'axios'


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
      test: 'testing'
    }
  },
  mounted(){
    
    let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
    axios.get(`${axios_link}vue/get_thread_data/${this.t_number}`)
    .then((res) => {
      this.thread_data = res.data.thread
      this.post_data = res.data.posts
      //console.log(res.data.thread)
      console.log(this.thread_data)
      console.log(this.post_data)
    })
    
    console.log(this.t_number)
  },
  methods: {

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