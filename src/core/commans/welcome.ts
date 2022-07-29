import { CommandType } from '../comman-type';
import { defineAsyncComponent } from 'vue';
/**
 * 帮助命令
 */
const welcomCommand: CommandType = {
    func: 'welcome',
    name: '欢迎',
    alias: ['hello'],
    params: [
        {
            key: 'commandName',
            desc: '命令英文名称',
        },
    ],
    options: [],
    collapsible: true,
    action( options, terminal, parentCommand ): void {
        terminal.add( '欢迎观临 dumu terminal', 'text');
    },
};

export default welcomCommand;