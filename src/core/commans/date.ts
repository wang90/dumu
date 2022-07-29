import { CommandType } from '../comman-type';
/**
 * 帮助命令
 */
const dateCommand: CommandType = {
    func: 'date',
    name: '当前时间',
    alias: ['time'],
    options: [],
    collapsible: true,
    action( options, terminal ): void {
        terminal.add( '当前时间为：' + new Date, 'text');
    },
};

export default dateCommand;