import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem("token"),
    userName: sessionStorage.getItem("userName"),
    name:sessionStorage.getItem("name"),

    examInfo:JSON.parse(sessionStorage.getItem("examInfo")),
    paperInfo:JSON.parse(sessionStorage.getItem("paperInfo")),

    islogin:true   //是否为登录页
  },
  mutations: {
    //set
    SET_TOKEN: (state,token) =>{
      state.token=token;
      localStorage.setItem("token",token)
    },
    SET_USERNAME:(state,userName)=>{
      state.userName=userName
      sessionStorage.setItem("userName",userName)
    },
    SET_NAME:(state,name)=>{
      state.name=name
      sessionStorage.setItem("name",name)
    },
    SET_EXAM:(state,examInfo)=>{
      state.examInfo=examInfo
      sessionStorage.setItem("examInfo",JSON.stringify(examInfo))
    },
    SET_PAPER:(state,paperInfo)=>{
      state.paperInfo=paperInfo
      sessionStorage.setItem("paperInfo",JSON.stringify(paperInfo))
    },

    SET_ISLOGIN:(state,islogin)=>{
      state.islogin=islogin
    },
    REMOVE_INFO: (state,token) =>{
      state.token=''
      state.userName=''
      state.name=''
      localStorage.setItem("token",'')
      sessionStorage.setItem("userName",'')
      sessionStorage.setItem("name",'')
    },
    REMOVE_EXAM:(state,examInfo)=>{
      state.examInfo={}
      state.paperInfo={}
      sessionStorage.setItem("examInfo",JSON.stringify(''))
      sessionStorage.setItem("paperInfo",JSON.stringify(''))
    }
  },
  getters: {
    //get
    getUserName:state => {
      return state.userName
    },
    getName:state=>{
      return state.name
    },
    getToken:state => {
      return state.token
    },

    getExamInfo:state => {
      return state.examInfo
    },
    getPaperInfo:state => {
      return state.paperInfo
    },
    getIsLogin:state => {
      return state.islogin
    }
  },
  actions: {
  },
  modules: {
  }
})
