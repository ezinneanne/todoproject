import { createApp } from 'vue'
import { VueFire, useFirestore } from 'vuefire'
import App from './App.vue'
import router from './router.js'

const app = createApp(App)


app.use(router)

app.use(VueFire, {
    // imported above but could also just be created here
    modules: [
      // we will see other modules later on
      useFirestore(),
    ],
  })

app.mount('#app')
