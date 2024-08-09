
function encodeDataURIText(data) {
    //參考實現 :https://stackoverflow.com/q/44570636
    return encodeURI(data).replace(/#|%20/g, s => s == '#' ? '%23' : ' ');
}


export function ball(size:number,color:string):string{
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="${color}"/></svg>`

    return (`data:image/svg+xml,${encodeDataURIText(svg)}`)
}


export function bucket(color:string):string{
    let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-5 -10 110 135"><path stroke="#000" stroke-width="8" fill="${color}" d="M21.875 25A21.903 21.903 0 0143.75 3.125h12.5A21.903 21.903 0 0178.125 25a3.124 3.124 0 11-6.25 0c0-4.144-1.648-8.117-4.578-11.047S60.395 9.375 56.25 9.375h-12.5c-4.144 0-8.117 1.648-11.047 4.578S28.125 20.855 28.125 25a3.124 3.124 0 11-6.25 0zM87.5 31.25h-75a3.124 3.124 0 100 6.25h3.438l5.374 50.969a9.355 9.355 0 009.313 8.406h38.75a9.355 9.355 0 009.313-8.406L84.061 37.5H87.5a3.124 3.124 0 100-6.25z"/></svg>`

    return (`data:image/svg+xml,${encodeDataURIText(svg)}`)
}
