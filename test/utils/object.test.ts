import { describe, expect, it } from 'vitest'
import { merge, mergeObject } from '../../src/utils/object'

describe('object', () => {
    describe('.merge()', () => {
        it('null keeps property', () => {
            const target = { name: 'bob' }
            const source = { name: null }
            expect(merge(target, source as any)).to.deep.equal({ name: null })
        })
        it('copies source nested objects', () => {
            const target = {}
            const source = { name: { fullName: 'bob' } }
            const result = merge(target, source as any)
            expect(result).to.deep.equal(source)
            expect(result.name).to.not.equal(source.name)
        })
        it('mutates the target', () => {
            const target = { bob: { age: 30 }, alice: { age: 40 } }
            const source = { bob: { age: 31 } }
            const result = merge(target, source)
            expect(result).to.deep.equal({ bob: { age: 31 }, alice: { age: 40 } })
            expect(result).toBe(target)
            expect(result.bob).toBe(target.bob)
        })
    })
    describe('.mergeObject()', () => {
        it('null delete property', () => {
            const target = { name: 'bob' }
            const source = { name: null }
            expect(mergeObject(target, source as any, { deleteNullProps: true })).to.deep.equal({})
        })
        it('immutable creates new object instances', () => {
            const target = { bob: { age: 30 }, alice: { age: 40 } }
            const source = { bob: { age: 31 } }
            const result = mergeObject(target, source, { immutable: true })
            expect(result).to.deep.equal({ bob: { age: 31 }, alice: { age: 40 } })
            expect(target).to.deep.equal({ bob: { age: 30 }, alice: { age: 40 } })
            expect(result).not.toBe(target)
            expect(result.bob).not.toBe(target.bob)
            expect((result as any).alice).toBe(target.alice)
        })
    })
})
