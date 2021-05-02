import axios from "axios"
import ElementUI from 'element-ui'
import router from "./router";
import store from './store'


axios.defaults.baseURL="/api"

//前置拦截
axios.interceptors.request.use(config=>{
    if (store.state.token){
        config.headers.Authorization = `${store.state.token}`
    }
        return config
},
    error => {
        return Promise.reject(err);
    })

//后置拦截
axios.interceptors.response.use(response=>{
    let res=response.data

    if(res.code==='200'){
        return response
    }else {
        ElementUI.Message.error(response.data.message,{duration: 3*1000})

        return Promise.reject(response.data.message)
    }
    },
    error => {
        if(error.response.data){
            error.message=error.response.data.message
        }
        if(error.response.status===401){
            store.commit('REMOVE_INFO')
            router.push('/login')
        }else {
            ElementUI.Message.error(error.message,{duration: 3*1000})
            return Promise.reject(error)
        }
    return response
})
