import { CommandType } from '../comman-type';
/**
 * 帮助命令
 */
const lsCommand: CommandType = {
    func: 'ls',
    name: '当前目录下文件',
    alias: [''],
    options: [],
    collapsible: true,
    action( options, terminal ): void {
        
    },
};

export default lsCommand;