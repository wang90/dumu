import { defineStore } from 'pinia'
import { CommanList } from '../core/index';
import HistoryList from '../libs/history-list';
const history = new HistoryList();

export const CommanStore = defineStore('common', {
    state: () => {
        return { 
            list: [],
            history: history.list,
        }
    },
    actions: {
        input( comman: string ) {
            const __comman = comman.split(' ').filter( v => v);
            console.log(__comman)
            this.add( comman, 'common' );
            this.addHistory( comman );
            if ( comman ) {
                if ( CommanList[__comman[0]]) {
                    const { action } = CommanList[__comman[0]];
                    action( __comman, this )
                } else {
                    this.add( 'Hint: command not found:' + comman, 'text');
                }
            } else {
                this.add( '', 'text');
            }
        },
        add( comman: string, type: string ) {
            this.list.push( {
                comman: comman,
                id: 1,
                date: new Date(),
                type: type,
            });
        },
        addHistory( comman: string ) {
            this.history = history.add( comman )
        },
        clear() {
            this.list = [];
        },
    },
})