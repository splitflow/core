export function extrude(path: string, value: any) {
    const tokens = path.split('.').reverse()
    let root = value
    for (let token of tokens) {
        const node = {}
        node[token] = root
        root = node
    }
    return root
}

export function exists(target: object, path: string) {
    const tokens = path.split('.')
    for (let token of tokens) {
        if (target) {
            target = target[token]
            continue
        }
        break
    }
    return target !== undefined
}

export function read<T>(target: object, path: string): T {
    const tokens = path.split('.')
    for (let token of tokens) {
        if (target) {
            target = target[token]
            continue
        }
        break
    }
    return target as T
}