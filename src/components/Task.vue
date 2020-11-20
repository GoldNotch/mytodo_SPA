<template lang="html">
  <div class="task" v-if="task">
    <h1 class="task__name">{{ task.name }}</h1>
    <p class="task__body">{{ task.description }}</p>
    <p class="task__done">{{ task.done ? "Выполнена" : "Не выполнена" }}</p>
    <p><button v-on:click="editTask">Изменить</button></p>
    <p><button v-on:click="deleteTask">Удалить</button></p>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    props: ['id'],

    data() {
      return {
        task: null,
        endpoint: 'http://localhost:3000/tasks/',
      }
    },

    methods: {
      deleteTask(){
        this.$emit('deleteTask', this.task.id);
      },

      editTask()
      {
        this.$emit('startEdit', this.task.id);
      },

      getTask(id) {
        axios(this.endpoint + id)
          .then(response => {
            this.task = response.data
          })
          .catch( error => {
            alert(error);
          })
      },
    },
    
    created() {
      this.getTask(this.id);
    },

    watch: {
      '$route'() {
        this.getTask(this.id);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .task {
    position: relative;
    max-width: 500px;
    margin: 0 auto;
    padding: 50px 20px 70px;
    &__name {
      position: relative;
      text-transform: uppercase;
      z-index: 1;
    }
    &__body {
      position: relative;
      z-index: 1;
    }
    &__id {
      position: absolute;
      font-size: 280px;
      bottom: -50px;
      margin: 0;
      color: #eeeeee;
      right: -20px;
      line-height: 1;
      font-weight: 900;
      z-index: 0;
    }
  }
</style>
