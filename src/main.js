import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import { VueFire } from 'vuefire';
import { firebaseApp } from './firebaseConfig.js';

const app = createApp(App)


app.use(router)

app.use(VueFire, {
  firebaseApp,
});

app.mount('#app')
