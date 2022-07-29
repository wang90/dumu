import { defineStore } from 'pinia';

export const UseInfoStore = defineStore('user',{
    state: () => {
        return { 
            host: 'local' 
        }
    },
    actions: {
        setname( name:string ) {
            this.host = name;
        },
    },
})