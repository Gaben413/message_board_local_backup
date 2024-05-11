<template>
    <div id="error-div" v-if="!autheticated">
      <div id="error-body">
        <h1>Failed to Authenticate</h1>
        <h2>Please login to access site's contents</h2>

        <a href="/login">LOGIN</a>
      </div>
    </div>
    <div v-else>
      <h2>HOME</h2>
      <p>Welcome to Message Board Backup Library</p>
      <p>Soon youll be able to read some extra data in this page, but for now, please go to Threads to see all of the data</p>
    </div>
</template>

<script>
// @ is an alias to /src
import settings from '../assets/frontend-settings.json'
import axios from 'axios'

export default {
  name: 'HomeView',
  data(){
    return{
      autheticated: true,

      //token: localStorage.getItem("board-access-token") || ""
    }
  },
  beforeMount(){
    //let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;
    axios.get(`${this.$store.state.axios_link}is_logged`, {headers: {'board-access-token': this.$store.state.token}}).then((res) => {
      this.autheticated = true;
    }).catch((error) => {
      console.log(error)
      this.autheticated = false;
    })
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

@media only screen and (max-width: 600px) {
  #error-body{
    width: 75%;
  }
}
</style>