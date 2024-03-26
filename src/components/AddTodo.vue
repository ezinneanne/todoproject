<template>
    <form @submit.prevent="addTodo" class="addTodo input-group" >
      <input autofocus placeholder="Add new todo..." name="newTodoText" v-model="newTodoText" class="addTodobtn" />
      <button class="btn">+</button>
    </form>
</template>

<script setup>

  import { ref } from 'vue';

  const newTodoText = ref('');

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

</script>