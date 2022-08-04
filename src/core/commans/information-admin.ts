import { CommandType } from '../comman-type';
import { useStorage } from "vue3-storage";
const storage = useStorage();
const key = 'note_key';

class InformationAdmin { 
    public list = storage.getStorageSync(key) || [];
    public add = () => {

    }
    public delete = () => {

    }
    public search = () => {

    }
}

const info = new InformationAdmin();


/**
 * 信息管理命令
 */
const informationAdminCommand: CommandType = {
    func: 'information admin',
    name: '信息管理',
    alias: ['info'],
    options: [],
    collapsible: true,
    action( options, terminal ): void {
        console.log( options );
        const __list = info.list;
        if ( options.length === 1 ) {
            for ( let i = 0 ; i < __list.length ; i ++ ) {
                const { descript, title, type, value } = __list[i];
                terminal.add(
                    `${ i + 1 }. titile: ${ title };`,
                    'table',
                )
                terminal.add(
                    `value: ${ value };`,
                    'table',
                )
                if ( descript ) {
                    terminal.add(
                        `descript: ${ descript }`,
                        'table',
                    )
                }
            }
        } else if ( options[1] === 'edit') {
            const index = options[2];
            if ( !index || index > ( __list.length -1) ||!__list[index-1]) {
                terminal.add(
                    `index  is error or null`,
                    'text',
                )
            } else {
                const cur  = __list[ index ];
                console.log( cur );
            }
        }
    },
};





export default informationAdminCommand;