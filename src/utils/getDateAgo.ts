export function getDateAgo(date, days) {
    const dateCopy = new Date(date)

    dateCopy.setDate(date.getDate() - days)
    return dateCopy.getTime()
}