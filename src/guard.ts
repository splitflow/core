import Ajv, { ValidateFunction, type ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'
import { writable, type Readable, type Subscriber } from './stores'
import { extrude, read } from './path'
import { MergeOption } from './utils'

const ajv = new Ajv()
addFormats(ajv)

export function cursor<U>(path: string, mergeable: Mergeable<object>): Target<U> {
    return {
        subscribe: (run: Subscriber<U>) => mergeable.subscribe(($) => run(read($ as object, path))),
        set: (value: U) => mergeable.merge(extrude(path, value), { deleteNullProps: true })
    }
}

export interface Mergeable<T> extends Readable<T> {
    merge: (value: Partial<T>, options?: MergeOption) => void
}

export interface Target<T> extends Readable<T> {
    set: (value: T) => void
}

export interface GuardValue<T> {
    value: T
    error: any
}

export function createGuard<T>(target: Target<T>, schema: any) {
    let validate: ValidateFunction
    let value: T
    let error: any

    const { subscribe, set: setInternal } = writable({ value, error }, () => {
        const unsubscribe = target.subscribe(($target) => {
            if ($target !== undefined && $target !== value) {
                validate ??= ajv.compile(schema)

                if (validate($target)) {
                    setImmutable($target, undefined)
                } else {
                    setImmutable($target, toError(validate.errors))
                }
            }
        })

        return () => unsubscribe()
    })

    function set({ value }: GuardValue<T>) {
        validate ??= ajv.compile(schema)

        if (validate(value)) {
            setImmutable(value, undefined)
            target.set(value)
        } else {
            setImmutable(value, toError(validate.errors))
            target.set(null)
        }
    }

    function setImmutable(nextValue: T, nextError: any) {
        if (nextValue !== value || nextError !== error) {
            value = nextValue
            error = nextError
            setInternal({ value, error })
        }
    }

    return {
        subscribe,
        set
    }
}

function toError(errors: ErrorObject[]) {
    return errors[0]?.message
}

export function isValid(value: GuardValue<unknown>) {
    return value.value !== undefined && !value.error
}
