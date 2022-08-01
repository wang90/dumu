import { CommandType } from '../comman-type';
import { defineAsyncComponent } from 'vue';
import { UseInfoStore } from '../../stores/UserInfoStore';
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
        const name = UseInfoStore().host;
        terminal.add( '欢迎观临 dumu terminal: ' + name, 'text');
    },
};

export default welcomCommand;