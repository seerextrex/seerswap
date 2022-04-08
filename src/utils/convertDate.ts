import { t } from "@lingui/macro"

export function convertDate(date: Date) {
    const yyyy = date.getUTCFullYear().toString()
    const mm = (date.getUTCMonth() + 1).toString()
    const dd = date.getUTCDate().toString()
    const mmChars = mm.split('')
    const ddChars = dd.split('')

    return yyyy + '-' + (mmChars[1] ? mm : '0' + mmChars[0]) + '-' + (ddChars[1] ? dd : '0' + ddChars[0])
}

export function convertLocalDate(date: Date) {

    const months = [
        t`January`,
        t`February`,
        t`March`,
        t`April`,
        t`May`,
        t`June`,
        t`July`,
        t`August`,
        t`September`,
        t`October`,
         t`November`,
         t`December`
    ]

    const month = months[date.getMonth()]
    const day = date.getDate().toString()

    return `${month} ${day}`
}
