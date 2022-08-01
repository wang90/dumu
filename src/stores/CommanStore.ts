import { defineStore } from 'pinia'
import { CommanList } from '../core/index';


export const CommanStore = defineStore('common', {
    state: () => {
        return { 
            list: [],
            history: [],
        }
    },
    actions: {
        input( comman: string ) {
            this.add( comman, 'common' );
            this.addHistory( comman );
            if ( comman ) {
                const __comman = comman.split(' ').filter( v => v);
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
            let lastComman = '';
            if ( this.history.length > 0 ) {
                const __comman = this.history[this.history.length - 1 ];
                lastComman = __comman['comman'];
            }
            if ( lastComman !== comman) {
                this.history.push({
                    comman: comman,
                    id: 1,
                    index: this.history.length + 1,
                    date: new Date(),
                })
            }
        },
        clear() {
            this.list = [];
        },
    },
})