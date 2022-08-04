import { useStorage } from "vue3-storage";
const storage = useStorage();
const key = 'dumi-history';

export default class HistoryList {

    public add = ( common:string ) => {
        const __list = this.list;
        if ( !this.checkLastEqual( common ) ) {
            __list.push( common );
            this.list = this.checklength(__list as []);
            storage.setStorageSync( key , this.list);
        }
        return this.list;
    }
    public clear = () => {
        this.list = [];
    }
    public length = () => {
        return this.list.length;
    }
    private checklength = ( list:[]) => {
        return  list.slice(-20);
    }
    private checkLastEqual = ( common ) => {
        if ( this.length() === 0 ) {
            return true;
        }
        const __last = this.list[this.length() -1 ];
        return __last === common;
    }
    private __list = storage.getStorageSync(key);
    public list: string[] = this.checklength(this.__list);
    
}