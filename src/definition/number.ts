import { Readable, writable } from '../stores'
import { GuardValue, SchemaDef, Target } from './def'

export function isNumber(value: number) {
    return typeof value === 'number'
}

export interface NumberDef {
    type: 'number'
    minimum?: number
    maximum?: number
    precision?: number
    step?: number
    unit?: string
    nullable?: boolean
}

export function isNumberDef(definition: SchemaDef): definition is NumberDef {
    return definition.type === 'number'
}

export interface NumberOptions {
    min?: number
    max?: number
    precision?: number
    step?: number
    unit?: string
    nullable?: boolean
}

export function number(options: NumberOptions): NumberDef {
    const { min, max, ...props } = options
    return { type: 'number', minimum: min, maximum: max, ...props }
}

export interface NumberAccessor {
    next(value: number): number
    previous(value: number): number
    coerce(value: number): number
    validate(value: number): boolean
    format(value: number): string
}

export function compileNumber({
    minimum = Number.MIN_VALUE,
    maximum = Number.MAX_VALUE,
    step,
    unit,
    precision,
    nullable
}: NumberDef): NumberAccessor {
    return {
        next(value: number) {
            value += step
            return value < maximum ? value : maximum
        },
        previous(value: number) {
            value -= step
            return value > minimum ? value : minimum
        },
        coerce(value: number) {
            if (value === null && nullable) return value
            if (value === null && !nullable) return minimum
            if (value > maximum) return maximum
            if (value < minimum) return nullable ? null : minimum
            return value
        },
        validate(value: number) {
            if (value === null && nullable) return true
            if (value === null && !nullable) return false
            if (value > maximum) return false
            if (value < minimum) return false

            if (typeof precision === 'number') {
                const strValue = value.toString()
                const dotIndex = strValue.indexOf('.')
                const endIndex = strValue.length - 1
                if (dotIndex !== -1 && endIndex - dotIndex > precision) return false
            }

            return true
        },
        format(value: number) {
            if (typeof value !== 'number') return 'unset'
            if (unit) return `${value} ${unit}`
            return `${value}`
        }
    }
}

export interface NumberGuard extends Readable<GuardValue<string>> {
    set: (value: GuardValue<string>) => void
    next: () => void
    previous: () => void
}

export function createNumberGuard(
    value: Target<number>,
    { minimum, maximum, step, precision, nullable }: NumberDef
): NumberGuard {
    // using an object wrapper to force store updates when value doesn't change
    let _guardValue: GuardValue<string>

    const guard = writable<GuardValue<string>>({ value: '' }, (set) => {
        const unsubscribe = value.subscribe(($value) => {
            _guardValue = { value: $value?.toString() ?? '' }
            set({ ..._guardValue })
        })
        return () => unsubscribe()
    })

    function set(guardValue: GuardValue<string>) {
        let result = guardValue.value
        result = match(result, nullable)
        result = trunc(result, precision)
        result = bound(result, minimum, maximum)

        if (result === null) {
            // revert
            guard.set({ ..._guardValue })
        } else {
            value.set(result ? parseFloat(result) : null)
            _guardValue.value = result
            guard.set({ ..._guardValue })
        }
    }

    function next() {
        let result = _guardValue.value
        result = increment(result, step, minimum, precision)
        result = bound(result, minimum, maximum, nullable, true)

        if (result !== null) {
            value.set(result ? parseFloat(result) : null)
            _guardValue.value = result
            guard.set({ ..._guardValue })
        }
    }

    function previous() {
        let result = _guardValue.value
        result = decrement(result, step, precision)
        result = bound(result, minimum, maximum, nullable, true)

        if (result !== null) {
            value.set(result ? parseFloat(result) : null)
            _guardValue.value = result
            guard.set({ ..._guardValue })
        }
    }

    return {
        subscribe: guard.subscribe,
        set,
        next,
        previous
    }
}

function match(value: string, nullable: boolean) {
    if (nullable && value === '') return value
    if (!nullable && value === '') return '0'

    if (!value.match(/^-?\d*(\.\d*)?$/)) return null

    if (value[0] === '0' && value[1] >= '0' && value[1] <= '9') return value.slice(1)
    if (value[0] === '.') return '0' + value
    return value
}

function bound(
    value: string,
    minimum: number,
    maximum: number,
    nullable?: boolean,
    coerce = false
) {
    if (!value) return value

    const number = parseFloat(value)
    if (isNumber(minimum) && number < minimum) {
        if (coerce && nullable) return ''
        if (coerce) return minimum + ''
        return null
    }
    if (isNumber(maximum) && number > maximum) {
        if (coerce) return maximum + ''
        return null
    }
    return value
}

function trunc(value: string, precision: number) {
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

export function increment(value: string, step: number, minimum: number, precision: number) {
    if (!step) return null
    if (!value) return isNumber(minimum) ? minimum + '' : '0'

    const number = parseFloat(value) + step
    return Number.isInteger(number) ? number + '' : number.toFixed(precision)
}

export function decrement(value: string, step: number, precision: number) {
    if (!step) return null
    if (!value) return null

    const number = parseFloat(value) - step
    return Number.isInteger(number) ? number + '' : number.toFixed(precision)
}
