// 此文件是 @/store/index.js

import { createStore } from 'vuex'

export default createStore({
    state: {
        username: '',
        loginStatus: 1
    },
    mutations: {
        SET_USERNAME(state, username){
            state.username = username;
        },
        REMOVE_USERNAME(state){
            state.username = ''
        },
        SET_LOGIN_STATUS(state) {
            state.loginStatus = 0;
        },
        SET_LOGOUT_STATUS(state){
            state.loginStatus = 1;
        }
    }
})
