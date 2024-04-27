<template>
  <div id="nav-div">
    <nav>
      <router-link to="/">Home</router-link>
      <!--|    
      <router-link to="/about">About</router-link>
      <router-link to="/thread">Thread</router-link>
      -->
  </nav>
  </div>
  
  <router-view/>
  <button id="fetchbutton" v-on:click="manual_fetch">Manual Fetch</button>
  <button id="scrollbutton" v-on:click="topFunction">Top</button>
  <FooterComponent/>
</template>

<script>
  import FooterComponent from '@/components/FooterComponent.vue'
  import axios from 'axios'
  import settings from '@/assets/frontend-settings.json'
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
      },
      manual_fetch(){
        let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
    
        axios.get(`${axios_link}manual_fetch/`)
        .then((res) => {

          console.log(res.data.status)
        })
      }
    },
    watch: {
      $route: {
            immediate: true,
            handler(to, from) {
                document.title = to.meta.title || 'Some Default Title';
            }
        },
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
body{
  background-color: white;
  margin: 0;

  display: flex;
  flex-direction: column;
}
h1{
  color: darkgreen;
  background: #39c439;
}
nav {
  padding: 15px;
  margin: 0px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}

#nav-div{
  /*background-color: red;*/
  background: rgb(255,255,255);
  background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(221,255,218,1) 100%); 
  height: 50px;
  margin-bottom: 0px;
}

#fetchbutton {

  position: fixed;

  opacity: 50%;

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

  opacity: 50%;

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
</style>
