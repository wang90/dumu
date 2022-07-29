import { CommandType } from '../comman-type';
/**
 * 帮助命令
 */
const openCommand: CommandType = {
    func: 'open',
    name: '打开',
    alias: [''],
    options: [],
    collapsible: true,
    action( options, terminal ): void {
        window.open( options[1],  '_blank' )
    },
};

export default openCommand;