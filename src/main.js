import { createApp } from 'vue'
import App from './App.vue'

import AntDesign from "./plugins/AntDesign";

import router from "./router";

import store from "./store";

createApp(App).use(store).use(router).use(AntDesign).mount('#app')
