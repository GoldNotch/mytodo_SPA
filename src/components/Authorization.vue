<template lang="html">
  <div class="enter">
    <h2>Вход</h2>
    <p>Логин: <input type="text" maxlength="64" v-model="login"></p>
    <p>Пароль: <input type="password" maxlength="64" v-model="password"></p>
    <button v-on:click="authorize">Войти</button>
    <button v-on:click="to_registration_window">Зарегистрироваться</button>
  </div>
</template>

<script>

  import axios from "axios";

  export default {
    data() {
      return {
        login: "",
        password: "",
        json_server: "http://localhost:3000/users/"
      }
    },

    methods:{
      authorize()
      {
        axios.get(this.json_server)
                .then(response => {
                  const users = response.data.filter(x => x.login === this.login && x.password === this.password);
                  if (users.length === 0)
                  {
                    alert('Нет такого пользователя');
                  }
                  else
                    this.$emit("onAuthorize", users[0]);
                })
                .catch(error => {
                  alert(error);
                })
      },

      to_registration_window()
      {
        this.$emit("toRegistrationWindow");
      }
    },
  }
</script>

<style lang="scss">
  .enter {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    flex-direction: column;
  }

  button{
    margin: 5px 5px;
  }
</style>
