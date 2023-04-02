export interface RootNode {
    type: 'fragment' | 'snapshot'
    [themeName: string]: any
}

export interface ThemeDataNode {
    palette?: PaletteNode
}

export interface PaletteNode {
    [colorName: string]: number[]
}

export type Color = (number | `#${string}`)[]

export function resolveColor(palette: PaletteNode, color: Color): number[] {
    if (typeof color?.[0] === 'string') {
        const paletteColorName = color[0].slice(1)
        const paletteColor = palette[paletteColorName]
        if (paletteColor) {
            return [
                paletteColor[0],
                paletteColor[1],
                typeof color[2] === 'number' ? color[2] : paletteColor[2],
                typeof color[3] === 'number' ? color[3] : paletteColor[3]
            ]
        }
        return [0, 0, 0, 100]
    }
    return color as number[]
}

export function resolveColorName(color: Color) {
    if (typeof color?.[0] === 'string') return color[0].slice(1)
    return null
}