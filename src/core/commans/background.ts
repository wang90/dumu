import { CommandType } from '../comman-type';
/**
 * 帮助命令
 */
const backgroundCommand: CommandType = {
    func: 'background',
    name: '背景',
    alias: ['bg'],
    options: [
        {
            key: 'URL｜RGBA',
            desc: '链接或RGBA',
        },
    ],
    collapsible: true,
    action( options, terminal ): void {
        console.log( options[1]);
        if ( options[1] ) {
            const bodyDOM = document.getElementById('app') as HTMLBodyElement;
            bodyDOM.setAttribute('style', `background-image: url( ${ options[1] } ) `);
            // bodyDOM.setAttribute('style', `background: ${ options[1] }`);
        } else {
            terminal.add('Hint: 参数错误','text');
        }
    },
};

export default backgroundCommand;