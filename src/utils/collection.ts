export function addAll<T>(set: Set<T>, values: Iterable<T>) {
    for (let value of values) {
        set.add(value)
    }
}

export function deleteAll<T>(set: Set<T>, values: Iterable<T>) {
    for (let value of values) {
        set.delete(value)
    }
}

export function mapUpsert<T>(array: T[], update: (value: T) => T | void, insert: () => T) {
    const result = []
    let didUpdate = false
    for (let item of array) {
        const updatedItem = update(item)
        if (updatedItem) {
            didUpdate = true
        }
        result.push(updatedItem ?? item)
    }

    if (!didUpdate) {
        result.push(insert())
    }

    return result
}

export function tokens(path: string) {
    return path.split('.')
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

export function bounded<T>(options: T[]) {

    return {
        next(predicate: any) {
            return next<T>(options, predicate)
        },
        previous(predicate: any) {
            return previous<T>(options, predicate)
        }
    }
}