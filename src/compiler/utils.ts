export function lookup(tokens: string[] | string, range: [number, number?], target: string) {
    range = range[1] ? range : [range[0], tokens.length]

    for (let i = range[0]; i < range[1]; i++) {
        if (tokens[i] === target) return i
    }
}

export function consume(tokens: string[] | string, range: [number, number?], stop: string[] | string) {
    range = range[1] ? range : [range[0], tokens.length]

    for (let i = range[0]; i < range[1]; i++) {
        if (stop.indexOf(tokens[i]) >= 0) return i
    }
    return range[1]
}

export function grab(tokens: string[], range: [number, number]) {
    let result = ''
    for (let i = range[0]; i < range[1]; i++) {
        result += tokens[i]
    }
    return result
}