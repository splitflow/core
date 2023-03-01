export interface RootNode {
    type: 'fragment' | 'snapshot'
    [definitionName: string]: any
}

export interface DefinitionNode {
    padding?: PaddingNode
    corner?: CornerNode
    border?: BorderNode
    background?: BackgroundNode
    size?: SizeNode
    typography?: TypographyNode
    layout?: LayoutNode
}

export interface PaddingNode {
    top?: number
    left?: number
    bottom?: number
    right?: number
}

export interface CornerNode {
    topLeft?: number
    topRight?: number
    bottomLeft?: number
    bottomRight?: number
}

export interface BorderNode {
    color?: number[]
    tickness?: number
}

export interface BackgroundNode {
    color?: number[]
}

export interface SizeNode {
    width?: number
    height?: number
}

export interface TypographyNode {
    fontWeight?: number
    fontSize?: number
    color?: number[]
}

export interface LayoutNode {
    direction: 'row' | 'column'
    mainAxisAlignment:
        | 'start'
        | 'end'
        | 'center'
        | 'stretch'
        | 'space-between'
        | 'space-around'
        | 'space-evenly'
    crossAxisAlignment: 'start' | 'end' | 'center' | 'stretch'
    spacing: number
}

export const AST = {
    padding: {
        all: [2, 0, 100, 1, 'rem']
    },
    corner: {
        all: [2, 0, 10, 0.25, 'rem']
    },
    border: {
        tickness: [1, 0, 10, 0.1, 'rem']
    },
    size: {
        all: [2, 0, 100, 1, 'rem']
    },
    typography: {
        fontSize: [2, 0, 10, 0.25, 'rem'],
        fontWeight: [100, 200, 300, 400, 500, 600, 700, 800, 900]
    },
    layout: {
        direction: ['row', 'column'],
        mainAxisAlignment: [
            'start',
            'end',
            'center',
            'stretch',
            'space-between',
            'space-around',
            'space-evenly'
        ],
        crossAxisAlignment: ['start', 'end', 'center', 'stretch'],
        spacing: [2, 0, 100, 1, 'rem']
    }
}

export const featureNames = [
    'padding',
    'corner',
    'border',
    'background',
    'size',
    'typography',
    'layout'
]