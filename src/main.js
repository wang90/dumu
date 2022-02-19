import { createApp } from 'vue'
import App from './App.vue'
import Vue3Storage from "vue3-storage";
import VueClipboard from 'vue3-clipboard'

createApp(App)
    .use(Vue3Storage, { namespace: 'pro_'})
    .use(VueClipboard, {
        autoSetContainer: true,
        appendToBody: true,
    })
    .mount('#app')
