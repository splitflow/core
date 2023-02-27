export function isObject(value: unknown) {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function clean(object: Object) {
    for (let key of Object.keys(object)) {
        if (object[key] === undefined) delete object[key]
    }
    return object
}

export function print(object: object) {
    const result = []
    for (let key of Object.keys(object)) {
        if (object[key] === true) {
            result.push(key)
        }
    }
    return result.join(' ')
}

export function find<T>(object: object, predicate: (value: T) => boolean) {
    for (let [, property] of Object.entries(object)) {
        if (predicate(property)) return property
    }
}

export function iterate(object: object) {
    if (object) return Object.entries(object).map(([, p]) => p)
    return []
}

export interface MergeOption {
    deleteNullProps: boolean
}

export function merge<T>(target: T, source: T) {
    return mergeObject(target, source)
}

export function mergeWithOption<T>(option: MergeOption) {
    return (target: T, source: T) => mergeObject(target, source, option)
}

export function mergeObject<T>(target: T, source: T, option?: MergeOption): T {
    for (let sourceKey of Object.keys(source)) {
        if (sourceKey === '*') {
            for (let targetKey of Object.keys(target)) {
                mergeProperty(target, source, targetKey, sourceKey, option)
            }
        } else {
            mergeProperty(target, source, sourceKey, sourceKey, option)
        }
    }
    return target
}

function mergeProperty<T>(
    target: T,
    source: T,
    targetKey: string,
    sourceKey: string,
    option?: MergeOption
) {
    const targetValue = target[targetKey]
    const sourceValue = source[sourceKey]
    if (isObject(targetValue) && isObject(sourceValue)) {
        mergeObject(targetValue, sourceValue, option)
    } else if (isObject(sourceValue)) {
        mergeObject((target[targetKey] = {}), sourceValue, option)
    } else if (sourceValue === undefined) {
        // skip
    } else if (option?.deleteNullProps && sourceValue === null) {
        delete target[targetKey]
    } else {
        target[targetKey] = sourceValue
    }
}

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

export function filter(object: object, key: string) {
    if (key) {
        return { [key]: object[key] }
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

export function isEmpty(object: object) {
    if (object) return Object.keys(object).length === 0
    return true
}

export function isNotEmpty(object: object) {
    if (object) return Object.keys(object).length > 0
    return false
}
