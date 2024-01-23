<template>
  <nav>
    <router-link to="/">Home</router-link>
    <!--|    
    <router-link to="/about">About</router-link>
    <router-link to="/thread">Thread</router-link>
    -->
  </nav>
  <router-view/>
  <button id="scrollbutton" v-on:click="topFunction">Top</button>
  <FooterComponent/>
</template>

<script>
  import FooterComponent from '@/components/FooterComponent.vue'
  export default{
    components: {
      FooterComponent,
    },
    mounted(){
      let mybutton = document.getElementById("scrollbutton");
      // When the user scrolls down 20px from the top of the document, show the button
      window.onscroll = function() {scrollFunction()};

      function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      }
    },
    methods: {
      // When the user clicks on the button, scroll to the top of the document
      topFunction() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
      } 
    }
  }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-bottom: 20px;
}

nav {
  padding: 5px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

#scrollbutton {
  display: none;
  position: fixed;
  bottom: 20px;
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
}
#scrollbutton:hover {
  background-color: #555;
}
</style>
