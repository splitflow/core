export function isNumber(value: number) {
    return typeof value === 'number'
}

export function addDigit(value: string, digit: string) {
    if (digit === '.') {
        if (!value) return '0.'
        if (value.indexOf('.') >= 0) return value
        return value + digit
    }

    if (!digit) return value
    if (!value) return digit
    if (value === '0') return digit
    return value + digit
}

export function removeDigit(value: string) {
    if (!value) return value
    if (value === '0') return null
    if (value.length === 1) return '0'
    return value.slice(0, -1)
}

export function increment(value: string, step: number, precision: number) {
    if (!step) return value
    if (!value) return '0'

    const number = parseFloat(value) + step
    return Number.isInteger(number) ? number + '' : number.toFixed(precision)
}

export function decrement(value: string, step: number, precision: number) {
    if (!step) return value
    if (!value) return value
    if (value === '0') return null

    const number = parseFloat(value) - step
    return Number.isInteger(number) ? number + '' : number.toFixed(precision)
}

export function bound(value: string, min: number, max: number) {
    if (!value) return value

    const number = parseFloat(value)
    if (isNumber(min) && number < min) return min + ''
    if (isNumber(max) && number > max) return max + ''
    return value
}

export function trunc(value: string, precision: number) {
    if (!value) return value

    const dotIndex = value.indexOf('.')
    const endIndex = value.length - 1
    if (dotIndex === -1) {
        return value
    }
    if (!precision && endIndex - dotIndex >= 0) {
        return value.slice(0, dotIndex)
    }
    if (endIndex - dotIndex > precision) {
        return value.slice(0, dotIndex + precision + 1)
    }
    return value
}

export function format(value: string, unit?: string) {
    if (!value) return 'unset'
    if (unit) return `${value} ${unit}`
    return value
}

export function bounded([precision, min, max, step, unit]: any[]) {
    return {
        addDigit(value: string, digit: string): any {
            return bound(trunc(addDigit(value, digit), precision), min, max)
        },
        removeDigit(value: string) {
            return bound(trunc(removeDigit(value), precision), min, max)
        },
        increment(value: string) {
            return bound(trunc(increment(value, step, precision), precision), min, max)
        },
        decrement(value: string) {
            return bound(trunc(decrement(value, step, precision), precision), min, max)
        },
        format(value: string) {
            return format(value, unit)
        }
    }
}
