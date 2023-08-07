/**
 * Compares only primitives for equality
 */
export function safeEqual(a: any, b: any) {
    return a === b && (!a || typeof a !== 'object')
}

export function isObject(value: any): value is object {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function isArray(value: any): value is any[] {
    return Array.isArray(value)
}

export function clean(object: Object) {
    for (let key of Object.keys(object)) {
        if (object[key] === undefined) delete object[key]
    }
    return object
}

/**
 * @deprecated
 */
export function print(object: object) {
    const result = []
    for (let key of Object.keys(object)) {
        if (object[key] === true) {
            result.push(key)
        }
    }
    return result.join(' ')
}

/**
 * @deprecated
 */
export function find<T>(object: object, predicate: (value: T) => boolean) {
    for (let [, property] of Object.entries(object)) {
        if (predicate(property)) return property
    }
}

/**
 * @deprecated
 */
export function iterate(object: object) {
    if (object) return Object.entries(object).map(([, p]) => p)
    return []
}

/**
 * @deprecated
 */
export function setLeafs(object: object, value: any) {
    for (let [key, property] of Object.entries(object)) {
        if (isObject(property)) {
            setLeafs(property, value)
        } else {
            object[key] = value
        }
    }
    return object
}

/**
 * @deprecated
 */
export function filter(object: object, predicate: string | string[]) {
    if (typeof predicate === 'string') {
        const key = predicate
        const value = object[key]
        if (value !== undefined) {
            return { [key]: object[key] }
        }
        return {}
    }

    if (Array.isArray(predicate)) {
        const result = {}
        for (const key of predicate) {
            const value = object[key]
            if (value !== undefined) {
                result[key] = value
            }
        }
        return result
    }

    return object
}

export function sort<T extends object>(object: T): T {
    return Object.keys(object)
        .sort()
        .reduce((result, key) => {
            result[key] = object[key]
            return result
        }, {}) as T
}

export function isEmpty(value: object | any[]) {
    if (isArray(value)) return value.length === 0
    if (isObject(value)) return Object.keys(value).length === 0
    return true
}

export function isNotEmpty(value: object | any[]) {
    if (isArray(value)) return value.length > 0
    if (isObject(value)) return Object.keys(value).length > 0
    return false
}

export function first<T>(array: T[]) {
    return array[0]
}

export function last<T>(array: T[]) {
    return array[array.length - 1]
}

export function contains<T>(array: T[], value: T) {
    return array.indexOf(value) >= 0
}

export function next<T>(array: T[], value: T): T
export function next<T>(array: T[], predicate: (item: T) => boolean): T
export function next<T>(array: T[], predicate: any): T {
    const index =
        typeof predicate === 'function' ? array.findIndex(predicate) : array.indexOf(predicate)
    const nextIndex = index === array.length - 1 ? 0 : index + 1
    return array[nextIndex]
}

export function previous<T>(array: T[], value: T): T
export function previous<T>(array: T[], predicate: (item: T) => boolean): T
export function previous<T>(array: T[], predicate: any): T {
    const index =
        typeof predicate === 'function' ? array.findIndex(predicate) : array.indexOf(predicate)
    const previousIndex = index <= 0 ? array.length - 1 : index - 1
    return array[previousIndex]
}
