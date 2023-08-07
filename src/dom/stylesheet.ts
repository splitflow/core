export function deleteCssRule(stylesheet: CSSStyleSheet, index: number) {
    if (stylesheet.cssRules.length > index) {
        stylesheet.deleteRule(index)
    }
}

export function deleteCssRules(stylesheet: CSSStyleSheet) {
    while (stylesheet.cssRules.length > 0) {
        stylesheet.deleteRule(0)
    }
}

export function cssRule(stylesheet: CSSStyleSheet, selectorText: string) {
    for (let i = 0; i < stylesheet.cssRules.length; i++) {
        const cssRule = stylesheet.cssRules[i] as CSSStyleRule
        if (cssRule.selectorText === selectorText) return cssRule
    }

    stylesheet.insertRule(`${selectorText} {}`, 0)
    return stylesheet.cssRules[0] as CSSStyleRule
}

export function stylesheet(id: string) {
    let style = document.querySelector(`style[data-splitflow-id=${id}]`) as HTMLStyleElement
    if (!style) {
        style = document.createElement('style')
        style.setAttribute('type', 'text/css')
        style.setAttribute('data-splitflow-id', id)
        document.head.appendChild(style)
    }
    return style.sheet!
}

export function key(key: string, callback: (event: KeyboardEvent) => void) {
    return (event: KeyboardEvent) => {
        if (event.key === key) {
            callback(event)
        }
    }
}

export function fontFamilies() {
    const result = new Set<string>()

    document.fonts.forEach((font) => result.add(font.family))
    return [...result]
}
