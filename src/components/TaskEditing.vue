<template lang="html">
  <div class="task-editing" v-if="task">
    <p>Название: <input v-model="task.name" type="text" maxlength="64"></p>
    <p>Описание: <textarea maxlength="512" v-model="task.description"/></p>
    <p>Статус выполнения: <input type="checkbox" v-model="task.done"></p>
    <p><button v-on:click="saveEdit()">Сохранить изменения</button></p>
    <p><button v-on:click="cancelEdit()">Отмена</button></p>
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
      getTask(id) {
        axios(this.endpoint + id)
          .then(response => {
            this.task = response.data
          })
          .catch( error => {
            alert(error);
          })
      },

      cancelEdit()
      {
        this.$router.push({name: "task", params: {id: this.task.id}});
      },

      saveEdit()
      {
        this.$emit("saveEdit", this.task);
      }
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
