import { CommandType } from '../comman-type';
import { CommanList } from '../index';

/**
 * 查看历史命令
 */
const historyCommand: CommandType = {
    func: 'history',
    name: '查看执行历史',
    alias: ['h'],
    options: [],
    collapsible: true,
    action( options, terminal ): void {
        if ( options.length === 1 ) {
            const list = terminal.history;
            for ( let i = 0 ; i < list.length ; i ++ ) {
                terminal.add(
                    `${ i + 1 } ${ list[i] }`,
                    'table',
                )
            }
        } else if ( options[1] ) {
            const list = terminal.history;
            const index = options[1];
            if ( list[index-1]) {
                const __comman = list[index-1];
                const { action } = CommanList[__comman];
                action( __comman, this )
            } else {
                terminal.add(
                    `history index error`,
                    'text',
                )
            }
            
        
        }
    },
};

export default historyCommand;