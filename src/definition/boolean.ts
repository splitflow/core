import { SchemaDef } from './def'

export interface BooleanDef {
    type: 'boolean'
}

export function isBooleanDef(definition: SchemaDef): definition is BooleanDef {
    return definition.type === 'boolean'
}

export function boolean(): BooleanDef {
    return { type: 'boolean' }
}

export interface BooleanAccessor {
    next: (value: boolean) => boolean
    previous: (value: boolean) => boolean
    format: (value: boolean) => string
}

export function compileBoolean(_: BooleanDef): BooleanAccessor {
    return {
        next: (value: boolean) => !value,
        previous: (value: boolean) => !value,
        format: (value: boolean) => (value ? 'true' : 'false')
    }
}
