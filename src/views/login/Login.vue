<template>
  <div class="login-container">
    <h2 class="login-title">简易聊天室</h2>
    <a-form ref="form" :model="user" class="login-form">
      <h2 class="title">用户登录</h2>
      <a-form-item>
        <a-input v-model:value="user.username" placeholder="用户名">
          <template #prefix>
            <user-outlined type="user"/>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-input-password v-model:value="user.password" placeholder="密码">
          <template #prefix>
            <unlock-outlined type="unlock"/>
          </template>
        </a-input-password>
      </a-form-item>
      <a-form-item>
        <a-button class="submit" type="primary" @click="onSubmit">登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import {message} from "ant-design-vue";
  import {UserOutlined, UnlockOutlined} from "@ant-design/icons-vue";
  import store from "../../store";
  import {reactive, toRefs} from "vue";
  import {login} from "../../api/user";
  import router from "../../router";

  export default {
    name: 'Login',
    setup(){
      const state = reactive({
        user: {
          username: '',
          password: ''
        }
      })

      const onSubmit = async () => {
        if (!state.user.username) {
          message.warn("用户名不能为空")
          return;
        }
        if (!state.user.password) {
          message.warn("密码不能为空")
          return;
        }

        const { data } = await login(state.user)
        store.commit('SET_USERNAME', data)
        store.commit('SET_LOGIN_STATUS')
        await router.push({path: '/home'})
      }

      return {
        ...toRefs(state),
        onSubmit
      }
    },

    components: {
      UserOutlined,
      UnlockOutlined
    }
  }
</script>
<style scoped>
.login-form {
  width: 565px;
  height: 372px;
  margin: 0 auto;
  background: url("../../assets/20200811151623830.png");
  padding: 40px 110px;
}

/* 背景 */
.login-container {
  position: absolute;
  width: 100%;
  height: 100%;
  background: url("../../assets/27524ac7880511ebb6edd017c2d2eca2.jpg") no-repeat;
  background-size: 100% 100%;
}

/* Log */
.login-title {
  color: #fff;
  text-align: center;
  margin: 100px 0 60px 0;
  font-size: 36px;
  font-family: Microsoft Yahei;
}
/* 登陆按钮 */
.submit {
  width: 100%;
  height: 45px;
  font-size: 16px;
}
/* 用户登陆标题 */
.title {
  margin-bottom: 50px;
  color: #fff;
  font-weight: 700;
  font-size: 24px;
  text-align: center;
  font-family: Microsoft Yahei;
}
/* 输入框 */
.inputBox {
  height: 45px;
}
/* 输入框内左边距50px */
.ant-input-affix-wrapper .ant-input:not(:first-child) {
  padding-left: 50px;
}
</style>