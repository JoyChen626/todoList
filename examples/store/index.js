import Vue from 'vue'
import Vuex from 'vuex'
import Router from '../router/index'
import VueCookies from 'vue-cookies'

Vue.use(Vuex)

let default_userid;
try{
  if(sessionStorage.userid){
    default_userid = sessionStorage.userid;
  } else {
    default_userid = '';
  }
}catch (e) {
  default_userid = '';
}
let default_token;
try{
  if(VueCookies.get('todoCode')){
    default_token = VueCookies.get('todoCode');
  } else {
    default_token = '';
  }
}catch (e) {
  default_token = '';
}
let default_nav;
try{
  if(sessionStorage.activeNav){
    default_nav = sessionStorage.activeNav;
  } else {
    default_nav = '1';
  }
}catch (e) {
  default_userid = '1';
}
let default_theme;
try{
  if(sessionStorage.activeTheme){
    default_theme = JSON.parse(sessionStorage.activeTheme);
  } else {
    default_theme = {color:'#409eff',type:'primary'};
  }
}catch (e) {
  default_theme = {color:'#409eff',type:'primary'};
}

export default new Vuex.Store({
  state: {
    token: default_token,
    userid: default_userid,
    shownav: false,
    activeNav: default_nav,
    activeTheme: default_theme
  },
  getters: {

  },
  mutations: {
    SET_TOKEN (state,token) {
      state.token = token;
      VueCookies.set('todoCode', state.token, '3d');
    },
    SAVE_USER (state, id) {
      sessionStorage.userid = id;
      state.userid = id;
    },
    CHANGE_LOADING (state, status) {
      state.loading = status;
    },
    CHANGE_NAV (state,status){
      state.shownav = status;
    },
    ACTIVE_THEME (state,data){
      sessionStorage.activeTheme = JSON.stringify(data);
      state.activeTheme = data;
    },
    ACTIVE_NAV (state,id){
      sessionStorage.activeNav = id;
      state.activeNav = id;
    }
  },
  actions: {

  }
})
