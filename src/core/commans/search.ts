import { CommandType } from '../comman-type';
import { openURL } from '../../libs/open-url';
/**
 * 帮助命令
 */
const searchCommand: CommandType = {
    func: 'search',
    name: '搜索',
    options: [
        {
            key: 'word',
            desc: '搜索内容',
        },
    ],
    collapsible: true,
    action( options, terminal ): void {
        console.log( options[1]);
        if ( options[1] ) {
            openURL( options[1], options[2] || '')
        } else {
            terminal.add('Hint: Search terms?','text');
        }
    },
};

export default searchCommand;