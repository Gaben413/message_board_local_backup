import { createStore } from "vuex";

export default createStore({
    state: {
        count: 5,
        token: "",
        axios_link: ""
    },
    getters: {
        total(state){
            return state.count
        }
    },
    mutations: {
        storeCountIncrement(state){
            state.count++;
        },
        storageSetToken(state, token){
            state.token = token;
        },
        storageSetAxiosLink(state, link){
            state.axios_link = link;
        }
    },
    actions: {
        storeCount(context, data){
            context.state.count = data
        }
    },
    modules: {

    }
})