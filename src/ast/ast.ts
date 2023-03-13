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
    position?: PositionNode
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
    minWidth?: number
    maxWidth?: number
    height?: number
    minHeight?: number
    maxHeight?: number
    aspectRatio?: number
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

export interface PositionNode {
    mainAxisAlignment: 'start' | 'end' | 'center' | 'stretch' | 'shrink'
    crossAxisAlignment: 'start' | 'end' | 'center' | 'stretch'
    mainAxisSize?: number
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
        all: [2, 0, 100, 1, 'rem'],
        aspectRatio: [1, 0, 10, 0.1, '/1']
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
    },
    position: {
        mainAxisAlignment: ['start', 'end', 'center', 'stretch', 'shrink'],
        crossAxisAlignment: ['start', 'end', 'center', 'stretch'],
        mainAxisSize: [0, 0, 100, 10, '%'],
    }
}

export const featureNames = [
    'padding',
    'corner',
    'border',
    'background',
    'size',
    'typography',
    'layout',
    'position'
]
