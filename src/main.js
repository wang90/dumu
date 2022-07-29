import { createApp } from 'vue'
import App from './App.vue'
import Vue3Storage from "vue3-storage";
import VueClipboard from 'vue3-clipboard';
import { createPinia } from 'pinia'
import './style/index.css';

createApp(App)
    .use(Vue3Storage, { namespace: 'pro_' })
    .use(VueClipboard, {
        autoSetContainer: true,
        appendToBody: true,
    })
    .use(createPinia())
    .mount('#app')
