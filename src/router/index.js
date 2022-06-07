import store from "../store";

//历史记录模式，除了hash外，还有html5的history
import { createRouter, createWebHashHistory } from 'vue-router'
import Login from "../views/login/Login.vue";
import {message} from "ant-design-vue";

//懒加载
const Home = () => import('../views/home/Home.vue')

const routes = [
    //重定向
    {
        path : '/',
        redirect : '/login'
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/login',
        component: Login
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

router.beforeEach((to, from) => {
    if (to.path === '/home' && store.state.loginStatus === 1){
        message.warn("清先登录")
        return {path: '/login'}
    }
})

export default router