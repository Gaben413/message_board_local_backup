<template>
    <div id="error-div" v-if="!autheticated">
      <div id="error-body">
        <h1>Failed to Authenticate</h1>
        <h2>Please login to access site's contents</h2>

        <a href="/login">LOGIN</a>
      </div>
    </div>

  <div id="thread-home" v-else >
    <h1>Thread Lists</h1>

    <div id="org-div">
      <label for="">Organize by: </label>
      <select name="" id="" @change="handle_change" v-model="organize_index">
        <option value="1">Archived/Ongoing</option>
        <option value="2">Date: Oldest</option>
        <option value="3">Date: Newest</option>
        <option value="4">Board</option>
        <option value="5">Thread Number</option>
        <option value="6">Title</option>
        <option value="7">Replies: Ascending</option>
        <option value="8">Replies: Descending</option>
      </select>

      <label for="">NSFW</label>
      <input type="checkbox" name="" id="" @change="handle_change" v-model="nsfw_toggle">

      <label for="">Display Amount</label>
      <select name="" id="" @change="handle_change" v-model="display_amount">
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="40">40</option>
      </select>
    </div>
    
    <div class="threads" v-if="display_threads_data.length" id="threads-grid">

      <ThreadComponent v-for="data in display_threads_data" :key="data.key" class="thread-comp" :data="data" />

    </div>
    <div v-else >
      <h3>No Threads in the Database</h3>
    </div>
    
    <div>
        <!--
        <a :class="(parseInt(page) > 1) ? '' : 'hide-anchor'" href="/threads/1" class="page-anchor">FIRST</a>
        <a :class="(parseInt(page) > 1) ? '' : 'hide-anchor'" :href="`/threads/${parseInt(page)-1}`" class="page-anchor">PREVIOUS</a>
        -->
        
        <button :disabled="page <= 1" @click="go_to_page('first')">FIRST</button>
        <button :disabled="page <= 1" @click="go_to_page('previous')">PREVIOUS</button>

        <label>PAGE: {{ page }}</label>

        <button @click="go_to_page('next')">NEXT</button>
        <button disabled>LAST</button>

        <!--
        <a :href="`/threads/${parseInt(page)+1}`" class="page-anchor">NEXT</a>
        <a class="page-anchor">LAST</a>
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
import { useRouter, useRoute } from 'vue-router'

import settings from '../assets/frontend-settings.json'
import axios from 'axios'

export default {
  name: 'ThreadsListView',
  components: {
    PostComponent,
    ThreadComponent
  },
  props: ['page'],
  data(){
    return{
      router: useRouter(),
      route: useRoute(),
      display_threads_data: [],
      threads_data: [],

      organize_index: 1,
      nsfw_toggle: true,
      display_amount: 5,

      autheticated: true,

      token: localStorage.getItem("board-access-token") || ""
    }
  },
  beforeMount(){
    if(this.route.query.organize == undefined && this.route.query.nsfw == undefined) return;
    this.organize_index = this.route.query.organize;
    this.nsfw_toggle = (this.route.query.nsfw == 'true');
    this.display_amount = (parseInt(this.route.query.amount))

    //console.log(`ORG: ${this.organize_index} | NSFW: ${this.nsfw_toggle} - ${typeof this.nsfw_toggle}`)
    this.organize()
  },
  mounted(){
    this.getThreadData()
  },
  updated(){
    console.log("Update")
    //this.getThreadData()
  },
  beforeUpdate(){
    console.log("Before Update")
  },
  methods: {
    getThreadData(){
        let axios_link = `http://${settings['axios_ip']}:${settings['axios_port']}/`;

        axios.get(`${axios_link}vue/get_threads/${this.page}`,  {headers: {'board-access-token': this.token, 'display-amount': this.display_amount, 'order-organize': this.organize_index}})
        .then((res) => {
            this.autheticated = true;
            let keyNumber = 1;

            this.threads_data = []

            res.data.forEach(data => {
                Object.assign(data, {key: keyNumber})
                this.threads_data.push(data)

                keyNumber++;
            });

            this.display_threads_data = this.threads_data;

            //NSFW TOGGLE
            this.display_threads_data = this.threads_data.filter((element) => {
                if(element.t_board != '/trash/' || (element.t_board == '/trash/' && this.nsfw_toggle)){
                    return element
                }
            })

            //this.organize()

            console.log(this.display_threads_data)
        }).catch(err => {
            this.autheticated = false;
            console.log(`Error: ${err}`)
        })
    },
    organize(){
        console.log(`Organizing Thread: ${this.organize_index} | NSFW: ${this.nsfw_toggle} - ${typeof this.nsfw_toggle} | AMOUNT: ${this.display_amount}`)
        this.getThreadData();
    },
    handle_change(){
      router.push({
        query: {
          organize: this.organize_index,
          nsfw: this.nsfw_toggle,
          amount: this.display_amount
        }
      });
      this.organize()
    },
    go_to_page(page_key){
        let target_page = 0;

        if(page_key == 'first'){
            target_page = 1;
        }else if(page_key == 'previous'){
            target_page = (parseInt(this.page)-1)
        }
        else if(page_key == 'next'){
            target_page = (parseInt(this.page)+1)
        }

        console.log(`${page_key} | Going to Page ${target_page}`);

        router.push({
                name: 'threads',
                params: {
                    page: target_page
                },
                query: {
                    organize: this.organize_index,
                    nsfw: this.nsfw_toggle,
                    amount: this.display_amount
                }
            }).then(()=>{
                this.getThreadData()
            })

        //this.getThreadData();
    }
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

.hide-anchor{
    visibility: hidden;
}
.page-anchor{
    margin: 5px;
    padding: 10px;

    color: white;
    background-color: darkgreen;

    border-radius: 15px;
}

#thread-home{
  padding: 5px;
  padding-bottom: 25px;
  display: fixed;

  top: 0;
  left: 0;

  background: rgb(255,255,255);
  background: linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(221,255,218,1) 100%); 
  min-height: 100%;
}

#org-div{
  padding: 10px;

  border-width: 0px 0px 2px 0px;
  border-style: double;
  border-color: black;
}
#org-div > label{
  margin-left: 20px;
}

#threads-grid{
  display: grid;
  
  grid-template-columns: auto auto auto auto;
  
  gap: 5px;
}
.thread-comp{
  margin: auto;
}

@media only screen and (max-width: 600px) {
  #threads-grid{
    display: block;
  }
  #org-div{
    margin: 0px 15px;
  }

  #error-body{
    width: 75%;
  }
}
</style>