export function formatReward(earned: number) {
    if (earned === 0) {
        return '0'
    }

    if (earned < 0.001 && earned > 0) {
        return '< 0.001'
    }

    const _earned = String(earned).split('.')
    return `${_earned[0].length > 8 ? `${_earned[0].slice(0, 8)}..` : _earned[0]}${
        !_earned[1].split('').every((el) => el === '0') ? `.${_earned[1].slice(0, 2)}` : ``
    }`
}
