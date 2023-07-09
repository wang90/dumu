import { CommandType } from '../comman-type';
import { useStorage } from "vue3-storage";
const storage = useStorage();
const key = 'note_key';

type InfoHistoryType = {
    descript:string;
    title:string;
    type: string;
    value: string;
}


class InformationAdmin { 
    public list = storage.getStorageSync(key) || [];
    public add = ( item: InfoHistoryType) => {
        this.list.push( item );
        storage.setStorageSync( key , this.list);
    }
    public delete = ( index:number ) => {
        this.list.splice( index, 1 );
        console.log(this.list);
        console.log(index)
        storage.setStorageSync( key , this.list);
    }
    public search = ( index:number ) => {
        return this.list( index );
    }
}

const info = new InformationAdmin();

console.log(info)

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
        } else if ( options[1] === 'rm') {
            const index = options[2];
            console.log(__list[index-1 ])
            if ( !index || !__list[index-1 ]) {
                terminal.add(
                    `index  is error or null`,
                    'text',
                )
            } else {
                info.delete( index - 1  );
                terminal.add(
                    `remove ${ index } success`,
                    'text',
                )
            }
        } else if ( options[1] === 'add') {
            console.log(options.slice(2));
            const arr = options.slice(2);
            if ( arr.length === 3 ) {
                const data:InfoHistoryType = {
                    title: options[2],
                    value: options[3],
                    descript:options[4],
                    type: 'text',
                }
                info.add( data );
                terminal.add(
                    `title: ${ options[2] };\nvalue:${ options[3] };\ndescript:${options[3]}; add success`,
                    'text',
                )
            } else {
                terminal.add(
                    `Info add example: \n info add title value descrption`,
                    'text',
                )
            }
        }
    },
};





export default informationAdminCommand;