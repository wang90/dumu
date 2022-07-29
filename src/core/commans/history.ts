import { CommandType } from '../comman-type';
import { defineAsyncComponent } from 'vue';
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
        const list = terminal.history;
        console.log( list );
        for ( let i = 0 ; i < list.length ; i ++ ) {
            const { index , comman } = list[i]
            terminal.add(
                `${ index } ${ comman }`,
                'table',
            )
        }
    },
};

export default historyCommand;