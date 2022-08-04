import { CommandType } from '../comman-type';

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
        for ( let i = 0 ; i < list.length ; i ++ ) {
            terminal.add(
                `${ i + 1 } ${ list[i] }`,
                'table',
            )
        }
    },
};

export default historyCommand;