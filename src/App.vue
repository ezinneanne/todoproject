<template>
  <div id="app" v-cloak class="wrapper">
    <h1>Todo List App</h1>
    <add-todo />
    <todo-list />
  </div>
</template>


<script setup>
import AddTodo from './components/AddTodo.vue';
import TodoList from './components/TodoList.vue';
</script>

<style>
.wrapper {
  max-height: 100vh;
  background-color: #fff;
  color: #333;
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  margin: 10px;
}

.grid {
  padding: 15px 19px;
  margin: 15px 2px;
  background-color: aquamarine;
  border-radius: 10px;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.addTodo {
  width: 100%;
  padding: 10px 16px;
  margin: 5px 0;
  background-color: aquamarine;
  border-radius: 10px;
}

.addTodobtn {
  width: 85%;
  flex: 1; 
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn {
  padding: 8px 15px;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  background-color: burlywood;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.list {
  list-style-type: none;
}

.pad {
  padding: 0;
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.button {
  padding: 3px;
  background-color: burlywood;
  color: #fff;
  font-weight: bold;
  border: none;
  border-radius: 4px;
}

h1 {
  color: burlywood;
}
</style>