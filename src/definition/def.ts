import { BooleanAccessor, BooleanDef, compileBoolean, isBooleanDef } from './boolean'
import { EnumAccessor, EnumDef, compileEnum, isEnumDef } from './enum'
import { ExpressionAccessor, ExpressionDef, compileExpression, isExpressionDef } from './expression'
import { NumberAccessor, NumberDef, compileNumber, isNumberDef } from './number'

export interface DataDef {
    type: string
}

export function compile<T>(definition: EnumDef<T>): EnumAccessor<T>
export function compile(definition: NumberDef): NumberAccessor
export function compile(definition: ExpressionDef): ExpressionAccessor
export function compile(definition: BooleanDef): BooleanAccessor
export function compile(definition: DataDef) {
    if (isEnumDef(definition)) return compileEnum(definition)
    if (isNumberDef(definition)) return compileNumber(definition)
    if (isExpressionDef(definition)) return compileExpression(definition)
    if (isBooleanDef(definition)) return compileBoolean(definition)
}
