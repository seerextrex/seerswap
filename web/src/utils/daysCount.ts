export function daysCount(month: number, year: number) {
    switch (month) {
        case 3:
        case 10:
        case 8:
        case 5:
            return 30
        case 0:
        case 2:
        case 4:
        case 6:
        case 7:
        case 9:
        case 11:
            return 31
        case 1:
            return (year - 2000) % 4 === 0 ? 29 : 28
        default:
            return 31
    }
}
