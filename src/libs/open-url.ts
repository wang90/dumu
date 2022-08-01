const url_type = {
    'baidu': 'https://www.baidu.com/s?wd=',
    'google': 'https://www.google.com/search?q=',
    'github': 'https://github.com/search?q=',
    'bilibili': 'https://search.bilibili.com/all?keyword=',
    'youdao': 'https://www.youdao.com/result?word=',
}

export function openURL( value:string , type:string = 'baidu' ) {
    const url = url_type[type] || url_type['baidu'];
    console.log( url );
    console.log( value)
    window.open( url + value);
}