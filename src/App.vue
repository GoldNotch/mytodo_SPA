<template>
  <div id="app">
    <header>
      <div class="header-content">
        <h1>My ToDo</h1>
        <nav class="control-panel" v-if="active_user">
          <button v-on:click="addNewTask">Новая задача</button>
          <button v-on:click="forget_user">Выйти</button>
        </nav>
      </div>
    </header>
    <main>
      <aside class="filter-panel" v-if="active_user">
        <p>Панель фильтрации</p>
        <p>Имя задачи: <input type="text" maxlength="64" v-model="filter_name"></p>
        <p>Учитывать статус выполнения: <input type="checkbox" v-model="is_filter_complete_status"></p>
        <p v-if="is_filter_complete_status">Статус выполнения: <input type="checkbox" v-model="filter_done"></p>
        <button v-on:click="filter">Принять</button>
        <button v-on:click="getAllTasks">Сбросить</button>
      </aside>
      <aside class="sidebar" v-if="active_user">
        <router-link
            v-for="task in tasks"
            active-class="is-active"
            class="link"
            :to="{ name: 'task', params: { id: task.id } }">
          {{task.name}}
        </router-link>
      </aside>
      <div class="content">
        <router-view v-on:deleteTask="deleteTask"
                     v-on:startEdit="setup_task_editing"
                     v-on:saveEdit="updateTask"
                      v-on:toAuthorizationWindow="setup_authorization"
                      v-on:toRegistrationWindow="setup_registration"
                     v-on:onAuthorize="on_authorize"
        >
        </router-view>
      </div>
    </main>

  </div>
</template>

<script>
  import axios from 'axios';
  import Task from "./components/Task.vue";
  import Registration from "./components/Registration.vue";
  import Authorization from "./components/Authorization.vue";
  const uuidv4 = require('uuid');

  export default {

    data () {
      return {
        //данные о сервере
        json_server: 'http://localhost:3000/',
        tasks_table: 'tasks/',
        //данные о задачах
        unfiltered_tasks: [],
        tasks: [],
        filter_name: "",
        is_filter_complete_status: false,
        filter_done: false,
        //данные об авторизации
        active_user: undefined
      }
    },

    created() {
      this.setup_authorization();
    },

    components: {
      Task,
      Registration,
      Authorization
    },

    methods: {
      setup_authorization()
      {
        this.$router.push({name: "authorization"});
      },

      setup_registration()
      {
        this.$router.push({name: "registration"});
      },

      setup_task_editing(id)
      {
        this.$router.push({name: "edit_task", params: {id: id}});
      },

      on_authorize(user)
      {
        this.active_user = user;
        this.getAllTasks();
        this.to_home();
      },

      forget_user()
      {
        this.active_user = undefined;
        this.setup_authorization();
      },

      to_home()
      {
        this.$router.push({name: "home"});
      },

      addNewTask()
      {
        const task = {
          id: uuidv4(),
          name: 'noname',
          description: 'no description',
          done: false,
          owner: this.active_user.login
        };
        axios.post(this.json_server + this.tasks_table, task).
          then(response => {
            this.getAllTasks();
          })
          .catch(error => {
            alert(error);
          })
      },

      deleteTask(id)
      {
        axios.delete(this.json_server + this.tasks_table + id)
                .then(response => {
                  this.getAllTasks();
                })
                .catch( error => {
                  alert(error);
                });
        this.to_home();
      },

      updateTask(task)
      {
        axios.put(this.json_server + this.tasks_table + task.id, task)
                .then(response => {
                  this.getAllTasks();
                })
                .catch(error => {
                  alert(error);
                });
        this.to_home();
      },

      getAllTasks() {
        axios.get(this.json_server + this.tasks_table)
          .then(response => {
            this.unfiltered_tasks = response.data.filter(x => x.owner === this.active_user.login);
            this.tasks = this.unfiltered_tasks.slice();
            this.filter_done = false;
            this.filter_name = "";
            this.is_filter_complete_status = false;
          })
          .catch(error => {
            alert(error);
          })
      },

      filter()
      {
        this.tasks = this.unfiltered_tasks.filter(
                                            x => x.name.match(this.filter_name + ".") &&
                                              (!this.is_filter_complete_status || x.done === this.filter_done));
        this.$router.push({name: "home"});
      }
    }
  }
</script>

<style lang="scss">

  body {
    margin: 0;
    padding: 0;
  }
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }

  h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  header {
    position: fixed;
    top: 0;
    width: 100%;
    min-height: 90px;
    border-bottom: 1px solid blue;
    display: flex;
    flex-direction: row;
    align-items: center;
    background: #ffffff;
  }

  .control-panel
  {
    display: flex;
    flex-direction:row;
  }

  .filter-panel
  {
    border: 1px solid blue;
    flex: 0 0 32%;
  }

  .header-content
  {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  main {
    display: flex;
    height: calc(100vh - 90px);
    max-width: 1200px;
    margin-top: 90px;
    overflow: hidden;
  }

  aside {
    height: 100%;
    overflow-y: auto;
    width: 30%;
    padding: 50px 30px;
    border-right: 1px solid blue;
  }

  .filter-panel
  {
    max-width: 20%;
  }

  .content {
    flex: 1 1 70%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .link {
    display: block;
    text-decoration: none;
    margin-bottom: 10px;
    color: #2c3e50;

    &--home {
      text-transform: uppercase;
      margin-bottom: 30px;
    }

    &.is-active {
      color: #42b983;
    }
  }
</style>
