import { clean, isNotEmpty } from '../utils/object'
import {
    BackgroundNode,
    BorderNode,
    CornerNode,
    DefinitionNode,
    LayoutNode,
    PaddingNode,
    RootNode,
    SizeNode,
    TypographyNode
} from './ast'

export class ASTToCSSVisitor {
    root(root: RootNode) {
        if (!root) return {}

        return Object.entries(root).reduce((rules, [definitionName, definition]) => {
            if (definitionName === 'type') return rules

            const properties = this.definition(definition)
            if (isNotEmpty(properties)) {
                rules[selector(definitionName)] = properties
            }

            const childProperties = this.definition(definition, true)
            if (isNotEmpty(childProperties)) {
                rules[selector(definitionName, true)] = childProperties
            }
            return rules
        }, {})
    }

    definition(definition: DefinitionNode, child = false) {
        if (child) {
            return {
                ...this.layout(definition.layout, true)
            }
        }

        return {
            ...this.padding(definition.padding),
            ...this.corner(definition.corner),
            ...this.border(definition.border),
            ...this.backgroud(definition.background),
            ...this.size(definition.size),
            ...this.typography(definition.typography),
            ...this.layout(definition.layout)
        }
    }

    corner(corner: CornerNode) {
        return clean({
            'border-top-left-radius': property(corner && corner.topLeft, 'rem'),
            'border-top-right-radius': property(corner && corner.topRight, 'rem'),
            'border-bottom-left-radius': property(corner && corner.bottomLeft, 'rem'),
            'border-bottom-right-radius': property(corner && corner.bottomRight, 'rem')
        })
    }

    border(border: BorderNode) {
        return clean({
            'border-color': property(border && border.color, hsl),
            'border-width': property(border && border.tickness, 'rem'),
            'border-style': property(border && 'solid')
        })
    }

    backgroud(backgroud: BackgroundNode) {
        return clean({
            'background-color': property(backgroud && backgroud.color, hsl)
        })
    }

    padding(padding: PaddingNode) {
        return clean({
            'padding-top': property(padding && padding.top, 'rem'),
            'padding-bottom': property(padding && padding.bottom, 'rem'),
            'padding-left': property(padding && padding.left, 'rem'),
            'padding-right': property(padding && padding.right, 'rem')
        })
    }

    size(size: SizeNode) {
        return clean({
            width: property(size && size.width, 'rem'),
            height: property(size && size.height, 'rem')
        })
    }

    typography(typography: TypographyNode) {
        return clean({
            'font-size': property(typography && typography.fontSize, 'rem'),
            'font-weight': property(typography && typography.fontWeight),
            color: property(typography && typography.color, hsl)
        })
    }

    layout(layout: LayoutNode, child = false) {
        if (child) {
            return clean({
                'flex-grow': property(layout && layout.mainAxisAlignment, (v) =>
                    v === 'stretch' ? '1' : 'unset'
                ),
                'flex-basis': property(layout && layout.mainAxisAlignment, (v) =>
                    v === 'stretch' ? '0' : 'unset'
                )
            })
        }

        return clean({
            display: property(layout && 'flex'),
            'flex-direction': property(layout && layout.direction),
            'justify-content': property(layout && layout.mainAxisAlignment, (v) => {
                if (v === 'stretch') return 'unset'
                if (v === 'start' || v === 'end') return `flex-${v}`
                return v
            }),
            'align-items': property(layout && layout.crossAxisAlignment),
            gap: property(layout && layout.spacing, 'rem')
        })
    }
}

function hsl(color: number[]) {
    return `hsl(${color[0]}, ${color[1]}%, ${color[2]}%)`
}

function property(value, unit?: string)
function property(value, format: (val) => string)
function property(value, format: any) {
    if (value === null || value === undefined) return value
    if (typeof format === 'function') return format(value)
    if (format) return value + format
    return value
}

function selector(definitionName, child = false) {
    const [componentToken, elementToken] = definitionName.split('-')
    const [componentName, componentVariant] = componentToken.split(':')
    const [elementName, elementVariant] = elementToken.split(':')

    let selector = []

    if (componentVariant) {
        selector.push(elementSelector(componentName) + variantSelector(componentVariant))
    }
    selector.push(elementSelector(componentName, elementName) + variantSelector(elementVariant))
    if (child) {
        selector.push(childSelector())
    }

    return selector.join(' ')
}

function childSelector() {
    return '> *'
}

function elementSelector(componentName: string, elementName = 'root') {
    return `.${componentName}-${elementName}`
}

function variantSelector(variantName: string) {
    if (variantName === 'hover') return ':hover'
    if (variantName === 'even') return ':nth-child(2n)'
    if (variantName === 'odd') return ':nth-child(2n+1)'
    if (variantName) return `.${variantName}`
    return ''
}
