<template>
  <div class="input-group">
    <ul v-show="todos.length" class="list pad">
        <li v-for="(todo, index) in todos" :key="todo.id" class="list input-group">
        <input :id="'todo-' + index" :checked="todo.completed" type="checkbox" @change="toggleCompletion(index)" />
        <label :for="'todo-' + index">{{ todo.contents }}</label>
        <button @click="deleteTodo(index, todo.id)" class="button">Delete 🗑️</button>
        <button @click="editIndex === index ? editIndex = null : editIndex = index" class="button">{{ editIndex === index ? 'Cancel' : 'Edit' }}</button>
        <button v-if="editIndex === index" @click="updateTodo(index, editedTodoText)" class="button">Save</button>
        <input v-if="editIndex === index" v-model="editedTodoText" @keydown.enter="updateTodo(index, editedTodoText)" @keydown.esc="editIndex = null" class="button"/>
        </li>
    </ul>
   </div>

   <div class="grid">

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

</template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { db, todoRef} from '@/firebaseConfig.js';
import { useCollection } from 'vuefire';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore'


//const todos = ref([]);


/*onMounted(async () => {
  const querySnapshot = await getDocs(todoRef);
  todos.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
});
*/

const todos = useCollection(collection(db, 'todos'));

const remaining = computed(() => {
  return todos.value.filter(todo => !todo.completed).length;
});

const complete = computed(() => {
  return todos.value.filter(todo => todo.completed);
});

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
