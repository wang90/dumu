import { CommandType } from '../comman-type';
import { UseInfoStore } from '../../stores/UserInfoStore';
/**
 * 用户命令
 */
const userCommand: CommandType = {
    func: 'user',
    name: '用户管理',
    alias: [''],
    options: [],
    collapsible: true,
    action( options, terminal ): void {
        console.log( options );
        if ( options.length === 1 ) {
            terminal.add('Hint: Current User is :' + UseInfoStore().host, 'text');
            terminal.add(' if user set user?', 'text');
        } else if ( options[1] === 'set') {
            if ( options [2] ) {
                UseInfoStore().setname( options[2] );
                terminal.add('Set username is success', 'text');
            } else {
                terminal.add('Set username is failed', 'text');
            }
        }
    },
};

export default userCommand;