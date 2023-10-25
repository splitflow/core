import Ajv, { type ErrorObject } from 'ajv'
import addFormats from 'ajv-formats'
import { writable, type Readable, type Subscriber } from './stores'
import { extrude, read } from './path'

const ajv = new Ajv()
addFormats(ajv)

export function cursor<T>(path: string, mergeable: Mergeable<T>): Target<T> {
    return {
        subscribe: (run: Subscriber<T>) => mergeable.subscribe(($) => run(read($ as object, path))),
        set: (value: T) => mergeable.merge(extrude(path, value))
    }
}

export interface Mergeable<T> extends Readable<T> {
    merge: (value: Partial<T>) => void
}

export interface Target<T> extends Readable<T> {
    set: (value: T) => void
}

export interface GuardValue<T> {
    value: T
    error: any
}

export function createGuard<T>(target: Target<T>, schema: any) {
    const validate = ajv.compile(schema)

    let value: T
    let error: any

    const { subscribe, set: setInternal } = writable({ value, error }, () => {
        const unsubscribe = target.subscribe(($target) => {
            if ($target !== undefined) {
                setImmutable($target, error)
            }
        })

        return () => unsubscribe()
    })

    function set({ value }: GuardValue<T>) {
        if (validate(value)) {
            setImmutable(value, undefined)
            target.set(value)
        } else {
            setImmutable(value, toError(validate.errors))
            target.set(value)
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
