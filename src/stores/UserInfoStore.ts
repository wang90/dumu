import { defineStore } from 'pinia';
import { useStorage } from "vue3-storage";
const storage = useStorage();
const key = 'dumi-name';

storage.getStorageInfo().then( res => {
    console.log( res);
})

export const UseInfoStore = defineStore('user',{
    state: () => {
        return { 
            host: 'local'
        }
    },
    actions: {
        setname( name:string ) {
            this.host = name;
            storage.setStorageSync( key , name);
        },
    },
})