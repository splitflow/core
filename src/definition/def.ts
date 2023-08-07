import { Readable } from '../stores'
import { BooleanAccessor, BooleanDef, compileBoolean, isBooleanDef } from './boolean'
import { EnumAccessor, EnumDef, compileEnum, isEnumDef } from './enum'
import { StringAccessor, StringDef, compileString, isStringDef } from './string'
import {
    NumberAccessor,
    NumberDef,
    NumberGuard,
    compileNumber,
    createNumberGuard,
    isNumberDef
} from './number'

export interface SchemaDef {
    type?: string
}

export function compile<T>(definition: EnumDef<T>): EnumAccessor<T>
export function compile(definition: NumberDef): NumberAccessor
export function compile(definition: StringDef): StringAccessor
export function compile(definition: BooleanDef): BooleanAccessor
export function compile(definition: SchemaDef) {
    if (isEnumDef(definition)) return compileEnum(definition)
    if (isNumberDef(definition)) return compileNumber(definition)
    if (isStringDef(definition)) return compileString(definition)
    if (isBooleanDef(definition)) return compileBoolean(definition)
}

export interface Guard<T> extends Readable<GuardValue<T>> {
    set: (value: GuardValue<T>) => void
}

export interface GuardValue<T> {
    value: T
}

export interface Target<T> extends Readable<T> {
    set: (value: T) => void
}

export function createGuard(value: Target<number>, definition: NumberDef): NumberGuard
export function createGuard(value: Target<any>, definition: any) {
    if (isNumberDef(definition)) return createNumberGuard(value, definition)
}
