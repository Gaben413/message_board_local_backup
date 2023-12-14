<template>
  <div class="home">
    <h1>Thread Lists</h1>
    <div class="threads">
      <div v-for="data in dummy_data" :key="data.key" class="thread-comp">
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

export default {
  name: 'HomeView',
  components: {
    PostComponent,
    ThreadComponent
  },
  data(){
    return{
      dummy_data: [
        {name: "name1", num: "10", archived: 1, key: 1},
        {name: "name2", num: "20", archived: 0, key: 2},
        {name: "name3", num: "30", archived: 1, key: 3},
      ]
    }
  },
  mounted(){
    fetch('http://localhost:3000/db/get_all_threads').then(res => {
      console.log(res.json())
    })
  },
  methods: {
    test(input){
      console.log(`Test ${input}`);
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