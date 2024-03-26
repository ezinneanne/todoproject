<template>
    <ul v-show="todos.length" class="list pad">
      
    </ul>
  </template>


<script setup>
import { ref, computed, onMounted } from 'vue';
import { db, todoRef} from './firebaseConfig.js';
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
