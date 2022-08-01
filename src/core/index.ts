import historyCommand from './commans/history';
import clearCommand from './commans/clear';
import helpCommand from './commans/help';
import welcomCommand from './commans/welcome';
import dateCommand from './commans/date';
import openCommand from './commans/open';
import backgroundCommand from './commans/background';
import lsCommand from './commans/ls';
import userCommand from './commans/user';
import searchCommand from './commans/search';

export const CommanList   = {};

setCommon( helpCommand )
setCommon( clearCommand )
setCommon( historyCommand )
setCommon( welcomCommand )
setCommon( dateCommand )
setCommon( openCommand )
setCommon( backgroundCommand )
setCommon( lsCommand )
setCommon( userCommand )
setCommon( searchCommand )

function setCommon ( comman ) {
    const { alias = [], func = ''} =  comman;
    CommanList[func] = comman;
    if ( alias.length > 0 ) {
        alias.map( v => {
            CommanList[v] = comman;
        })
    }
}



