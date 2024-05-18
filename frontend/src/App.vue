<template>
  <div id="nav-div">
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/login">Login</router-link>
      <router-link to="/favourites">Favourites</router-link>
      <router-link to="/threads/1">Threads</router-link>
      <router-link to="/settings">Settings</router-link>
    </nav>
  </div>
  
  <router-view/>

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
        //token: localStorage.getItem("board-access-token") || "",

        fetching: false,

        show_utils: false,
        util_posX: '-125px',
        util_posY: '50px',

        arrow_invert: 1,

        noti_class: "",
        notification_text: "NOTIFICATION",
        showing_noti: false
      }
    },
    beforeMount(){
      //console.log(`TOKEN: ${this.$store.state.token}`);

      this.$store.commit('storageSetToken', (localStorage.getItem("board-access-token") || ""))
      //console.log(`Token: ${this.$store.state.token}`)
      this.$store.commit('storageSetAxiosLink', `http://${settings['axios_ip']}:${settings['axios_port']}/`);
      //console.log(this.$store.state.axios_link)

      //console.log(`AFTER TOKEN: ${this.$store.state.token}`);
    },
    mounted(){
      /*
      this.$store.commit('storeCountIncrement')
      this.$store.dispatch('storeCount', 9)
      console.log(this.$store.state.count)
      */
     
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

        //this.token = localStorage.getItem("board-access-token") || "";
        //let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
        
        console.log("Now manually Fetching Thread Data");

        axios.get(`${this.$store.state.axios_link}manual_fetch/`, {headers: {'board-access-token': this.$store.state.token}})
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
      toggle_tab(){
        console.log("TAB");

        this.show_utils = !this.show_utils;

        if(this.show_utils){
          this.util_posX = 0;
          this.arrow_invert = -1
        }else{
          this.util_posX = '-125px';
          this.arrow_invert = 1
          
        }
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
</style>
