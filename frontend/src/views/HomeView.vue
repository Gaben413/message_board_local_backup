<template>
  <div class="home">
    <h1>Thread Lists</h1>
    <div class="threads">
      <ThreadComponent />
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