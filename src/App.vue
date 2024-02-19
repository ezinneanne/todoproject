<script setup>
import { ref, computed, onMounted } from 'vue';
import { db, todoRef} from './firebaseConfig.js';
import { useCollection } from 'vuefire';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'


const todos = ref([]);


onMounted(async () => {
  const querySnapshot = await getDocs(todoRef);
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
      const docRef = await addDoc(todoRef, newTodo);
      todos.value.push({ id: docRef.id, ...newTodo });
      newTodoText.value = '';
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  }
};


const deleteTodo = async (index, todoId) => {
  try {
    const todoDocRef = doc(db, `todos/${todoId}`);
    await deleteDoc(todoDocRef);
    todos.value.splice(index, 1);
  } catch (error) {
    console.error('Error removing todo:', error);
  }
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

      // Clear the editedTodoText and reset the editIndex
      editedTodoText.value = '';
      editIndex.value = null;
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  }
};

</script>


<template>
  <div id="app" v-cloak class="wrapper">
  <h1>Todo List App</h1>
  <div class="input-group">
    <form @submit.prevent="addTodo" class="addTodo input-group" >
      <input autofocus placeholder="Add new todo..." name="newTodoText" v-model="newTodoText" class="addTodobtn" />
      <button class="btn">+</button>
    </form>
  </div>
    
    <div class="grid">
    <ul v-show="todos.length" class="list pad" >
      <li v-for="(todo, index) in todos" :key="todo.id" class="list input-group">
        <input :id="'todo-' + index" :checked="todo.completed" type="checkbox" @change="toggleCompletion(index)" />
        <label :for="'todo-' + index">{{ todo.contents }}</label>
        <button @click="deleteTodo(index, todo.id)" class="button">Delete 🗑️</button>
        <button @click="editIndex === index ? editIndex = null : editIndex = index" class="button">{{ editIndex === index ? 'Cancel' : 'Edit' }}</button>
        <button v-if="editIndex === index" @click="updateTodo(index, editedTodoText)" class="button">Save</button>
        <input v-if="editIndex === index" v-model="editedTodoText" @keydown.enter="updateTodo(index, editedTodoText)" @keydown.esc="editIndex = null" class="button"/>
      </li>
    </ul>

    <p v-show="todos.length">
      <span>You have </span>
      <strong>{{ remaining }}</strong>
      <span>{{ remaining === 1 ? ' item' : ' items' }} remaining</span>
    </p>
    </div>

    <div class="grid">
      <p>Completed todos:</p>
      <ol>
        <li v-for="(todo, index) in complete" :key="todo.id">{{ todo.contents }}</li>
      </ol>
    </div>

  </div>
</template>

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