
import { describe, expect, it } from 'vitest'
import { merge, mergeObject } from '../../src/utils/object'

describe('object', () => {
    it('.merge() null keep property', () => {
        const target = {name: 'bob'}
        const source = {name: null}
        expect(merge(target, source as any)).to.deep.equal({name: null})
    })
    it('.mergeObject() null delete property', () => {
        const target = {name: 'bob'}
        const source = {name: null}
        expect(mergeObject(target, source as any, {deleteNullProps: true})).to.deep.equal({})
    })
    it('.merge() copies source nested objects', () => {
        const target = {}
        const source = {name: {fulleName: 'bob'}}
        const result = merge(target, source as any)
        expect(result).to.deep.equal(source)
        expect(result.name).to.not.equal(source.name)
    })
})