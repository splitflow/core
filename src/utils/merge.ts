import { isEmpty, isObject } from './misc'

export interface MergeOption {
    deleteNullProps?: boolean
    forceUpdate?: boolean
}

export function merge<U, V>(target: U, source: V): U & V
export function merge<U, V>(target: U, source: V, option: MergeOption): U & V
export function merge<U, V>(target: U, source: V, option?: MergeOption): U & V {
    return mergeAny(target, source, option)
}

export function mergeWithOption<U, V>(option: MergeOption) {
    return (target: U, source: V) => merge(target, source, option)
}

function mergeObject(target: object, source: object, option: MergeOption): object {
    let targetCopy: object
    let targetKeyDeleted = false

    for (const sourceKey of Object.keys(source)) {
        const targetValue = target[sourceKey]
        const sourceValue = source[sourceKey]
        const mergedValue = mergeAny(targetValue, sourceValue, option)

        if (mergedValue === undefined) {
            //skip
        } else if (mergedValue === targetValue && !option?.forceUpdate) {
            // skip
        } else if (mergedValue === null && targetValue === undefined && option?.deleteNullProps) {
            // skip
        } else if (mergedValue === null && option?.deleteNullProps) {
            targetCopy ??= { ...target }
            delete targetCopy[sourceKey]
            targetKeyDeleted = true
        } else {
            targetCopy ??= { ...target }
            targetCopy[sourceKey] = mergedValue
        }
    }

    if (targetKeyDeleted && isEmpty(targetCopy)) return null
    return targetCopy ?? target
}

function cleanObject(object: object): object {
    let objectCopy: object

    for (const key of Object.keys(object)) {
        const value = isObject(object[key]) ? cleanObject(object[key]) : object[key]

        if (value === null) {
            objectCopy ??= { ...object }
            delete objectCopy[key]
        }
    }

    if (objectCopy && isEmpty(objectCopy)) return null
    return objectCopy ?? object
}

function mergeAny(target: any, source: any, option: MergeOption) {
    if (isObject(target) && isObject(source)) {
        return mergeObject(target, source, option)
    }
    if (isObject(source) && option?.deleteNullProps) {
        return cleanObject(source)
    }
    if (source === undefined) {
        return target
    }
    return source
}
