export function convertDate(date: Date) {
    const yyyy = date.getUTCFullYear().toString()
    const mm = (date.getUTCMonth() + 1).toString()
    const dd = date.getUTCDate().toString()
    const mmChars = mm.split('')
    const ddChars = dd.split('')

    return yyyy + '-' + (mmChars[1] ? mm : '0' + mmChars[0]) + '-' + (ddChars[1] ? dd : '0' + ddChars[0])
}
