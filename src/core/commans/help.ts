import { CommandType } from '../comman-type';
import { defineAsyncComponent } from 'vue';
import { CommanList } from '../index';
/**
 * 帮助命令
 */
const helpCommand: CommandType = {
    func: 'help',
    name: '查看帮助',
    alias: ['man'],
    params: [
        {
            key: 'commandName',
            desc: '命令英文名称',
        },
    ],
    options: [],
    collapsible: true,
    action( options, terminal, parentCommand ): void {

        if ( options[1] ) {
            const commam =  CommanList[ options[1]];
            if ( commam ) {
                console.log( commam );
                terminal.add( commam['name'], 'text');
            } else {
                terminal.add( 'Hint: 未找到改命令', 'text');
            }
        } else {
            terminal.add( 'Hint: What manual page do you want?', 'text');
        }

    },
};

export default helpCommand;