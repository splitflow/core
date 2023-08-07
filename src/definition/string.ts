import { SchemaDef } from './def'

export interface StringDef {
    type: 'string'
    variables: ExpressionVariables
}

export interface ExpressionVariables {
    [variableName: string]: string | number
}

export function isStringDef(definition: SchemaDef): definition is StringDef {
    return definition.type === 'string'
}

export function expression(variables: ExpressionVariables): StringDef {
    return { type: 'string', variables }
}

export interface StringAccessor {
    format: (value: string) => string
}

export function compileString({ variables }: StringDef): StringAccessor {
    return {
        format(value) {
            if (variables) {
                for (const [variableName, variableValue] of Object.entries(variables)) {
                    value = value.replaceAll('${' + variableName + '}', variableValue.toString())
                }
            }
            return value
        }
    }
}
