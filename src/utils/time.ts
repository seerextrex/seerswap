export function getCountdownTime(time: number, now: number) {
    const timestamp = (time * 1000 - now) / 1000
    const days = Math.floor(timestamp / (24 * 60 * 60))
    const hours = Math.floor(timestamp / (60 * 60)) % 24
    const minutes = Math.floor(timestamp / 60) % 60
    const seconds = Math.floor(timestamp) % 60

    function format(digit: number) {
        return digit < 10 ? `0${digit}` : digit
    }

    return `${days > 0 ? `${days}d ` : ''}${format(hours)}:${format(minutes)}:${format(seconds)}`
}
