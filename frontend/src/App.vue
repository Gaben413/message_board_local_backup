<template>
  <div id="nav-div">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/threads/1">Threads</router-link>
      <router-link to="/settings">Settings</router-link>
      <!--|    
      <router-link to="/about">About</router-link>
      <router-link to="/thread">Thread</router-link>
      -->
  </nav>
  </div>
  
  <router-view/>

  <div id="notification-div" :class="showing_noti ? 'show-notification' : ''">
    <h3>{{ notification_text }}</h3>
  </div>

  <!--
  <button @click="notification">trigger notification</button>
  -->
  <button id="fetchbutton" class="system-button" v-on:click="manual_fetch">Manual Fetch</button>
  <button id="scrollbutton" v-on:click="topFunction">Top</button>
  <button id="scroll-bottom-button" v-on:click="bottomFunction">bottom</button>
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
    data(){
      return{
        token: localStorage.getItem("board-access-token") || "",
        fetching: false,
        noti_class: "",
        notification_text: "NOTIFICATION",
        showing_noti: false
      }
    },
    mounted(){
      let scroll_top = document.getElementById("scrollbutton");
      let scroll_bottom = document.getElementById("scroll-bottom-button");
      // When the user scrolls down 20px from the top of the document, show the button
      window.onscroll = function() {scrollFunction()};

      function scrollFunction() {
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          scroll_top.style.display = "block";
        } else {
          scroll_top.style.display = "none";
        }
      }
      function scrollBottomFunction() {
        const CAP = document.documentElement.scrollTop - 1106;

        if (document.body.scrollTop > CAP || document.documentElement.scrollTop > CAP) {
          scroll_bottom.style.display = "none";
        } else {
          scroll_bottom.style.display = "block";
        }
      }
    },
    methods: {
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

        this.notification("Fetching Notification");

        this.fetching = true;

        this.token = localStorage.getItem("board-access-token") || "";
        let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
        
        console.log("Now manually Fetching Thread Data");

        axios.get(`${axios_link}manual_fetch/`, {headers: {'board-access-token': this.token}})
        .then((res) => {
          this.fetching = false;
          console.log(res.data)
          this.notification("Data Fetch Completed", true);
        }).catch(err => console.log(`Error: ${err}`));
      },
      async delay(timeDelay){
        return new Promise(resolve => {
          setTimeout(resolve, timeDelay)
        })
      },
      async notification(text, override = false){

        this.notification_text = text;

        if(this.showing_noti && !override) return;
        else if(override) this.showing_noti = false;
        this.showing_noti = true;
        await this.delay(3000);
        this.showing_noti = false;
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
  margin: 0px 10px;
}

nav a.router-link-exact-active {
  color: #42b983;
}

#nav-div{
  background: rgb(255,255,255);
  background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(221,255,218,1) 100%); 
  height: 50px;
  margin-bottom: 0px;
}

#notification-div{
  display: none;
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
  display: block;
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
  #notification-div{
    left: 5px;
    bottom: 100px;
  }
}
</style>
