<template>
  <div class="container">
    <div class="home-container">
      <div class="top">
        <div class="status">
          <span class="left">用户: {{ username }}</span>
          <span class="right" @click="logout" v-html="loginStatus"></span>
        </div>
        <div class="title">
          <span v-show="toName !== ''">正在和 {{ toName }} 聊天</span>
        </div>
      </div>
      <div class="content">
        <div class="left">
          <div class="show">
            <ul v-show="toName !== ''" style="padding: 0; height: 100%">
              <li v-for="item in chatMessageList" >
                <span :class="{sender: item.status === 0, receiver: item.status === 1}">
                  <a-avatar src="https://joeschmoe.io/api/v1/random" />
                </span>
                <p :class="{sender: item.status === 0, receiver: item.status === 1}">{{ item.message }}</p>
                <b style="clear:both;"></b>
              </li>
            </ul>
          </div>
          <div class="edit">
            <a-input v-model:value="editMessage" @keydown.enter="sendToUser" style="height: 100%; border: none; background-color: rgba(255, 255, 255, 0.1)" :bordered="false" placeholder="再次输入文字信息..." />
            <a-button class="sendMessage" @click="sendToUser" type="primary" size="large">发送</a-button>
          </div>
        </div>
        <div class="right">
          <div class="list">
            <p>
              <span>好友列表</span>
            </p>
            <ul v-for="item in userList">
              <li  @click="showChat(item)" v-if="item != username">{{ item }}</li>
            </ul>
          </div>
          <div class="fano">
            <p>
              <span>系统广播</span>
            </p>
            <ul v-for="item in userList">
              <li v-if="item != username">您的好友 {{ item }} 上线了</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {computed, onMounted, reactive, toRefs} from "vue";
import store from "../../store";
import router from "../../router";
import {message} from "ant-design-vue";
import {getUsername} from "../../api/user";
export default {
  name: "Home",
  setup(){
    const state = reactive({
      editMessage: '',
      toName: '',
      userList: [],
      chatMessageList: [],
    })

    onMounted(() => {
      const { data } = getUsername();
      if (data){
        store.commit('SET_USERNAME', data)
      }
    })

    //创建webSocket对象
    const ws = new WebSocket("ws://localhost:8080/chat")
    //给ws绑定事件
    ws.onopen = function () {
      //在建立连接需要做的事
      //1.显示在线信息
      store.commit('SET_LOGIN_STATUS')
    }

    //接收到服务端推送的消息后触发
    ws.onmessage = function (evt) {
      //获取服务端推送过来的消息
      let dataStr = evt.data;
      //解析 dataStr
      let res = JSON.parse(dataStr);
      //判断是否是系统消息
      if (res.system){
        //系统消息

        state.userList = res.message

      }else {
        //不是系统消息
        //将服务端推送的数据进行展示
        if (state.toName === res.fromName){
          state.chatMessageList.push({'status': 1, 'message': res.message})
        }

        let chatData = sessionStorage.getItem(state.toName)
        if (chatData != null && chatData){
          chatData = JSON.parse(chatData)
          chatData.push({'status': 1, 'message': res.message})
          sessionStorage.setItem(res.fromName, JSON.stringify(chatData))
        }else {
          //
          chatData = [{'status': 1, 'message': res.message}]
          sessionStorage.setItem(res.fromName, JSON.stringify(chatData))
        }
      }
    }
    
    ws.onclose = function () {
      //显示离线信息//
      store.commit('SET_LOGOUT_STATUS')
    }

    const username = computed(() => {
      return store.state.username
    })

    const loginStatus = computed(() => {
      return store.state.loginStatus === 0 ? '<span style="color: greenyellow">在线</span>' : '<span style="color: red">离线</span>'
    })

    const sendToUser = () => {
      let json = {'toName': state.toName, 'message': state.editMessage}

      state.chatMessageList.push({'status': 0, 'message': state.editMessage})
      state.editMessage = ''

      sessionStorage.setItem(state.toName, JSON.stringify(state.chatMessageList))

      //发送数据给服务券
      ws.send(JSON.stringify(json))
    }

    const logout = async () => {
      message.warn("登出登录")

      await store.commit('REMOVE_USERNAME')
      await store.commit('SET_LOGOUT_STATUS')

      router.push({path: '/user'})
    }

    const showChat = (toName) => {
      state.toName = toName
      let chatData = sessionStorage.getItem(toName)
      if(chatData != null){
        chatData = JSON.parse(chatData)
        state.chatMessageList = chatData
      }
    }

    return {
      ...toRefs(state),
      username,
      loginStatus,
      showChat,
      logout,
      sendToUser
    }
  }
}
</script>

<style lang="less" scoped>
  * {
    font-family: "Microsoft Yahei";
    list-style-type: none;
    scrollbar-width: none;
    -ms-overflow-style: none;
    ::-webkit-scrollbar {
      display: none; /* Chrome Safari */
    }
  }

  .container {
    position: relative;
    width: 100vw;
    height: 100vh;
    background: url("../../assets/27524ac7880511ebb6edd017c2d2eca2.jpg") no-repeat;
    background-size: 100% 100%;

  }

  .home-container {
    position: absolute;
    width: 70%;
    height: 80%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, .6);
  }

  .top {
    height: 125px;
    border-radius: 20px 20px 0 0 ;
    background-color: rgba();
  }

  .top .status {
    height: 75px;
    line-height: 75px;
    padding-left: 30px;
    padding-right: 30px;
    font-size: 20px;
  }

  .top .status .left {
    float: left;
    color: white;
  }

  .top .status .right {
    float: right;
    cursor: pointer;
  }

  .top .title {
    height: 55px;
    font-size: 18px;
    text-align: center;
    color: #4f80ad;
  }

  .content {
    height: 655px;
  }

  .content .left {
    width: 75%;
    height: 100%;
    float: left;
  }

  .content .right {
    width: 25%;
    height: 100%;
    float: right;
  }

  .content .left .show {
    width: 100%;
    height: 70%;
    padding: 20px;

    ul {
      overflow-y: scroll;
      border: none;
    }

    ul li {
      margin-top: 10px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      font-size: 16px;
      display: inline-block;
      width: 100%;

      span {
        margin: 0 10px 0 10px;
      }

      p {
        display: inline-block;
        padding: 5px 10px 5px 10px;
        background-color: #cccccc;
        border-radius: 10px;
      }
    }
  }

  .content .left .edit {
    width: 100%;
    height: 30%;
    position: relative;
  }

  .content .right .list {
    width: 100%;
    height: 50%;

    p {
      border: 1px solid #ccc;
      span {
        font-size: 18px;
        font-weight: bold;
        border-bottom: 5px solid #68b4dc;
      }
    }

    ul {
      overflow-y: scroll;
    }

    ul li {
      cursor: pointer;
      margin-top: 5px;
      font-size: 20px;
    }
  }

  .content .right .fano {
    width: 100%;
    height: 50%;

    p {
      border: 1px solid #ccc;
      span {
        font-size: 18px;
        font-weight: bold;
        border-bottom: 5px solid #68b4dc;
      }
    }

    ul {
      overflow-y: scroll;

      li {
        margin-top: 5px;
        font-size: 16px;
      }
    }
  }

  .sender {
    float: right;
  }

  .receiver {
    float: left;
  }

  .sendMessage {
    position: absolute;
    bottom: 0;
    right: 0;
  }
</style>