import { isArray, isObject } from './misc'

export function copy<T>(value: T): T {
    if (isObject(value)) return { ...value }
    if (isArray(value)) return [...value] as T
    return value
}
