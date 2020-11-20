<template lang="html">
  <div class="registration">
    <h2>Регистрация</h2>
    <p>Логин: <input type="text" maxlength="64" v-model="login"></p>
    <p>Пароль: <input type="password" maxlength="64" v-model="password"></p>
    <p>Подтверждение пароля: <input type="password" maxlength="64" v-model="password_confirm"></p>
    <button v-on:click="validate">Зарегистрироваться</button>
    <button v-on:click="to_authorization_window">Войти</button>
  </div>
</template>

<script>

  import axios from "axios";

  export default {
    data() {
      return {
        login: "",
        password: "",
        password_confirm: "",
        json_server: "http://localhost:3000/users/"
      }
    },

    methods:{
      //Валидация данных пользователя
      validate()
      {
        this.login = this.login.trim();
        this.password = this.password.trim();
        this.password_confirm = this.password_confirm.trim();
        if (this.password.length === 0 || this.login.length === 0)
        {
          alert('Пустой логин или пароль');
          return;
        }
        if (this.password !== this.password_confirm)
        {
          alert('Пароли не совпадают');
          return;
        }
        axios.get(this.json_server)
                .then(response => {
                  if (response.status === 200)
                  {
                    const users = response.data;
                    if (users.filter(x => x.login === this.login).length > 0)
                    {
                      alert('Пользователь с таким логином уже существует');
                      return;
                    }
                    else this.register();
                  }
                })
                .catch(error => {
                  alert(error);
                });
      },

      //Регистрация пользователя(без валидации)
      register()
      {
        const new_user = {login: this.login, password: this.password};
        axios.post(this.json_server, new_user)
                .then(response => {
                  if (response.status === 201)
                    this.$emit("onAuthorize", new_user);
                })
                .catch(error => {
                  alert(error);
                })
      },

      to_authorization_window()
      {
        this.$emit("toAuthorizationWindow");
      }
    }
  }
</script>

<style lang="scss">
  .registration {
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
