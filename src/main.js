import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'

// import 'element-plus/dist/index.css'
import '@/theme/index.css' // element 自定义主题

// 引入全局css
import '@/assets/scss/style.scss';



console.log(router,store,'init')
const app = createApp(App)
app.use(router)
app.use(store)
app.mount('#app')
