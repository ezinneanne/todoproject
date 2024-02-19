import { createApp } from 'vue'
import { VueFire, useFirestore } from 'vuefire'
import App from './App.vue'
import router from './router.js'

const app = createApp(App)

import { firestorePlugin } from 'vuefire'
Vue.use(firestorePlugin);

app.use(router)

app.use(VueFire, {
    
  })

app.mount('#app')
