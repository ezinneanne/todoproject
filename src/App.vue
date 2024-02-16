<script setup>
import { ref, computed, onMounted } from 'vue';
import { db } from './firebaseConfig.js';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore'

const todos = ref([]);


onMounted(async () => {
  const querySnapshot = await getDocs(collection(db, 'todos'));
  todos.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});

const newTodoText = ref('');

const remaining = computed(() => {
  return todos.value.filter(todo => !todo.completed).length;
});

const complete = computed(() => {
  return todos.value.filter(todo => todo.completed);
});


const addTodo = async () => {
  if (newTodoText.value) {
    const newTodo = {
      contents: newTodoText.value,
      completed: false
    };

    try {
      const docRef = await addDoc(collection(db, 'todos'), newTodo);
      todos.value.push({ id: docRef.id, ...newTodo });
      newTodoText.value = '';
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }
};


const removeTodo = index => {
  todos.value.splice(index, 1);
};

const toggleCompletion = index => {
  todos.value[index].completed = !todos.value[index].completed;
}; 

const editIndex = ref(null);
const editedTodoText = ref('');


const updateTodo = async (index, newContents) => {
  if (newContents) {
    try {
      const todoToUpdate = todos.value[index];
      todoToUpdate.contents = newContents;

      const todoDocRef = doc(db, `todos/${todoToUpdate.id}`);
      await updateDoc(todoDocRef, { contents: newContents });

      todos.value.splice(index, 1, todoToUpdate);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }
};

</script>


<template>
  <div id="app" v-cloak>
    <h1>Todo app with Vue.js</h1>

    <form @submit.prevent="addTodo">
      <input autofocus placeholder="Add new todo" name="newTodoText" v-model="newTodoText" />
      <button>Add</button>
    </form>

    <ul v-show="todos.length">
      <li v-for="(todo, index) in todos" :key="todo.id">
        <input :id="'todo-' + index" :checked="todo.completed" type="checkbox" @change="toggleCompletion(index)" />
        <label :for="'todo-' + index">{{ todo.contents }}</label>
        <button @click="removeTodo(index)">Remove 🗑️</button>
        <button @click="editIndex === index ? editIndex = null : editIndex = index">{{ editIndex === index ? 'Cancel' : 'Edit' }}</button>
        <button v-if="editIndex === index" @click="updateTodo(index, editedTodoText)">Save</button>
        <input v-if="editIndex === index" v-model="editedTodoText" @keydown.enter="updateTodo(index, editedTodoText)" @keydown.esc="editIndex = null" />
      </li>
    </ul>

    <p v-show="todos.length">
      <span>You have </span>
      <strong>{{ remaining }}</strong>
      <span>{{ remaining === 1 ? ' item' : ' items' }} remaining</span>
    </p>

    <div>
      <p>Completed todos:</p>
      <ul>
        <li v-for="(todo, index) in complete" :key="todo.id">{{ todo.contents }}</li>
      </ul>
    </div>

  </div>
</template>

