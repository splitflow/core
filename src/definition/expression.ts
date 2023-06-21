import { DataDef } from './def'

export interface ExpressionDef {
    type: 'expression'
    variables: ExpressionVariables
}

export interface ExpressionVariables {
    [variableName: string]: string | number
}

export function isExpressionDef(definition: DataDef): definition is ExpressionDef {
    return definition.type === 'expression'
}

export function expression(variables: ExpressionVariables): ExpressionDef {
    return { type: 'expression', variables }
}

export interface ExpressionAccessor {
    format: (value: string) => string
}

export function compileExpression({ variables }: ExpressionDef): ExpressionAccessor {
    return {
        format(value) {
            for (const [variableName, variableValue] of Object.entries(variables)) {
                value = value.replaceAll('${' + variableName + '}', variableValue.toString())
            }
            return value
        }
    }
}
