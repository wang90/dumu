export const readFile = (file) => {
    return new Promise(resolve => {
        let reader = new FileReader()
        reader.readAsText(file)
        reader.onload = ev => {
            resolve( ev.target.result )
        }
    })
}