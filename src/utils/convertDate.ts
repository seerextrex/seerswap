export function convertDate(date: Date) {
    const yyyy = date.getUTCFullYear().toString()
    const mm = (date.getUTCMonth() + 1).toString()
    const dd = date.getUTCDate().toString()
    const mmChars = mm.split('')
    const ddChars = dd.split('')

    return yyyy + '-' + (mmChars[1] ? mm : '0' + mmChars[0]) + '-' + (ddChars[1] ? dd : '0' + ddChars[0])
}

export function convertLocalDate(date: Date) {
    const yyyy = date.getFullYear().toString()
    const mm = (date.getMonth() + 1).toString()
    const dd = date.getDate().toString()
    const mmChars = mm.split('')
    const ddChars = dd.split('')

    return yyyy + '.' + (mmChars[1] ? mm : '0' + mmChars[0]) + '.' + (ddChars[1] ? dd : '0' + ddChars[0])
}
