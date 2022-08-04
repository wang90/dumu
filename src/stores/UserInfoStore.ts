import { defineStore } from 'pinia';
import { useStorage } from "vue3-storage";
const storage = useStorage();
const key = 'dumi-name';

export const UseInfoStore = defineStore('user',{
    state: () => {
        return { 
            host: storage.getStorageSync(key) || 'local',
        }
    },
    actions: {
        setname( name:string ) {
            this.host = name;
            storage.setStorageSync( key , name);
        },
    },
})