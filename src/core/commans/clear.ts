import { CommandType } from '../comman-type';
/**
 * 帮助命令
 */
const clearCommand: CommandType = {
    func: 'clear',
    name: '清除屏幕全部内容',
    alias: [''],
    options: [],
    collapsible: true,
    action( options, terminal ): void {
        terminal.clear()
    },
};

export default clearCommand;