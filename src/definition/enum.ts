import { DataDef } from './def'

export interface EnumDef<T> {
    type: 'enum'
    values: T[]
}

export function isEnumDef(definition: DataDef): definition is EnumDef<unknown> {
    return definition.type === 'enum'
}

export function enumm<T>(values: T[]): EnumDef<T> {
    return { type: 'enum', values }
}

export interface EnumAccessor<T> {
    next: (value: T) => T
    previous: (value: T) => T
}

export function compileEnum<T>({ values }: EnumDef<T>): EnumAccessor<T> {
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
