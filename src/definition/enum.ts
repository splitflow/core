import { SchemaDef } from './def'

export interface EnumDef<T> {
    type?: never
    enum: T[]
}

export function isEnumDef<T>(definition: SchemaDef): definition is EnumDef<T> {
    return !!(definition as EnumDef<T>).enum
}

export function enumeration<T>(values: T[]): EnumDef<T> {
    return { enum: values }
}

export interface EnumAccessor<T> {
    next: (value: T) => T
    previous: (value: T) => T
}

export function compileEnum<T>({ enum: values }: EnumDef<T>): EnumAccessor<T> {
    return {
        next(value: T) {
            const index = values.indexOf(value)
            const nextIndex = index === values.length - 1 ? 0 : index + 1
            return values[nextIndex]
        },
        previous(value: T) {
            const index = values.indexOf(value)
            const previousIndex = index <= 0 ? values.length - 1 : index - 1
            return values[previousIndex]
        }
    }
}
