import { PaletteNode, ThemeDataNode, RootNode } from './theme'

export class ThemeToCSSVisitor {
    root(root: RootNode) {
        if (!root) return {}

        return Object.entries(root).reduce((rules, [themeName, themeData]) => {
            if (themeName === 'type') return rules

            rules[selector(themeName)] = this.theme(themeData)
            return rules
        }, {})
    }

    theme(themeData: ThemeDataNode) {
        return ruleStyle([this.palette(themeData.palette)])
    }

    *palette(palette: PaletteNode) {
        for (const [colorName, color] of Object.entries(palette)) {
            yield [`--${colorName}-color-h`, property(color, (c) => `${c[0]}`)]
            yield [`--${colorName}-color-s`, property(color, (c) => `${c[1]}%`)]
            yield [`--${colorName}-color-l`, property(color, (c) => `${c[2]}%`)]
        }
    }
}

function selector(themeName: string) {
    return `.sft-${themeName}`
}

function property(value: any, format: (val) => string): string {
    if (value === null || value === undefined) return value
    return format(value)
}

function ruleStyle(properties: Generator<string[]>[]) {
    const result = {}

    for (const propertyGenerator of properties) {
        for (const [property, value] of propertyGenerator) {
            result[property] = value
        }
    }
    return result
}
