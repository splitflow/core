import { DefinitionNode, RootNode } from '../ast'
import { merge, sort } from '../utils/object'

export interface SplitflowStyleDef {
    [definitionName: string]: DefinitionNode | VariantsDef
}

export interface VariantsDef {
    [variantPattern: `@:${string}` | `:${string}`]: DefinitionNode
}

export function styleToAST(componentName: string, styleDef: SplitflowStyleDef): RootNode {
    const fragment = { type: 'fragment' }

    for (const [elementName, definition] of Object.entries(styleDef)) {
        const defaultDefinition = {}

        for (const [pattern, value] of Object.entries(definition)) {
            if (isVariantPattern(pattern)) {
                fragment[definitionName(componentName, elementName, pattern)] = value
            } else {
                defaultDefinition[pattern] = value
            }
        }

        if (Object.keys(defaultDefinition).length > 0) {
            fragment[definitionName(componentName, elementName)] = defaultDefinition
        }
    }

    return fragment as any
}

export function* astToStyle(ast: RootNode): Generator<[string, SplitflowStyleDef]> {
    let styleDef: SplitflowStyleDef | null = null
    let styleComponentName: string | null = null

    for (const [definitionName, definition] of Object.entries(sort(ast))) {
        if (definitionName === 'type') continue

        const [componentName, elementName, variantPattern] = parseDefinitionName(definitionName)

        if (styleDef && styleComponentName != componentName) {
            yield [styleComponentName!, styleDef]

            styleDef = null
            styleComponentName = null
        }

        styleComponentName = componentName
        styleDef ??= {}
        styleDef[elementName] ??= {}

        if (variantPattern) {
            styleDef[elementName][variantPattern] = definition
        } else {
            merge(styleDef[elementName], definition)
        }
    }

    if (styleDef) {
        yield [styleComponentName!, styleDef]
    }
}

const VARIANT_REGEX = /^(@:[^:]+)?(:[^:]+)?$/

function isVariantPattern(pattern: string) {
    return pattern.charAt(0) === '@' || pattern.charAt(0) === ':'
}

function variantPattern(componentVariant?: string, elementVariant?: string) {
    if (componentVariant && elementVariant) return `@:${componentVariant}:${elementVariant}`
    if (componentVariant) return `@:${componentVariant}`
    if (elementVariant) return `:${elementVariant}`
    return null
}

function parseDefinitionName(definitionName: string) {
    const [componentToken, elementToken] = definitionName.split('-')
    const [componentName, componentVariant] = componentToken.split(':')
    const [elementName, elementVariant] = elementToken.split(':')

    return [componentName, elementName, variantPattern(componentVariant, elementVariant)]
}

function definitionName(componentName: string, elementName: string, variantPattern?: string) {
    const match = variantPattern?.match(VARIANT_REGEX)
    const componentVariant = match?.[1]?.slice(2)
    const elementVariant = match?.[2]?.slice(1)

    return `${key(componentName, componentVariant)}-${key(elementName, elementVariant)}`
}

function key(name: string, variant: string) {
    if (variant) return `${name}:${variant}`
    return name
}
