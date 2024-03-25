export function match(pattern: string, pathname: string) {
    const patternTokens = pattern.split('/')
    const pathnameTokens = pathname.split('/')

    if (patternTokens.length !== pathnameTokens.length) return undefined

    const params: Record<string, string> = {}

    for (let i = 0; i < patternTokens.length; i++) {
        if (patternTokens[i] === '*') {
            continue
        }
        if (patternTokens[i][0] === ':') {
            params[patternTokens[i].slice(1)] = pathnameTokens[i]
            continue
        }

        if (patternTokens[i] !== pathnameTokens[i]) return undefined
    }

    return params
}

export interface PathnameOptions {
    consume?: boolean
}

export function pathname(pattern: string, params: Record<string, any>, options?: PathnameOptions) {
    const tokens = pattern.split('/')

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i][0] === ':') {
            const key = tokens[i].slice(1)
            const param = params[key]
            if (param === undefined) {
                return undefined
            }
            if (options?.consume) {
                delete params[key]
            }
            tokens[i] = param
        }
    }
    return tokens.join('/')
}

export function wildcardPattern(pathname: string) {
    const tokens = pathname.split('/')

    for (let i = 0; i < tokens.length; i++) {
        if (tokens[i].length === 36) {
            tokens[i] = '*'
        }
    }
    return tokens.join('/')
}

export function wildcardPatterns(pathname: string) {
    const patterns: string[] = [pathname]

    const tokens = pathname.split('/')
    for (let i = tokens.length - 1; i >= 0; i--) {
        if (tokens[i].length === 36) {
            tokens[i] = '*'
            patterns.push(tokens.join('/'))
        }
    }
    return patterns
}

export function search(params: Record<string, any>) {
    const tokens = []
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
            tokens.push(`${key}=${value}`)
        }
    }
    if (tokens.length > 0) return '?' + tokens.join('&')
    return ''
}
