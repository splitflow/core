import { describe, expect, it } from 'vitest'
import { merge } from '../../src/utils/merge'

describe('.merge()', () => {
    it('with nested update is immutable', () => {
        const target = { bob: { age: 30 }, alice: { age: 40 } }
        const source = { bob: { age: 31 } }
        const result = merge(target, source)
        expect(result).to.deep.equal({ bob: { age: 31 }, alice: { age: 40 } })
        expect(result.alice).toBe(target.alice)
        expect(result.bob).not.toBe(target.bob)
        expect(result).not.toBe(target)
    })
    it('with no ops returns target', () => {
        const target = { bob: { age: 30 }, alice: { age: 40 } }
        const source = { bob: { age: 30 } }
        const result = merge(target, source)
        expect(result).to.deep.equal({ bob: { age: 30 }, alice: { age: 40 } })
        expect(result.alice).toBe(target.alice)
        expect(result.bob).toBe(target.bob)
        expect(result).toBe(target)
    })
    it('with undefined target returns source', () => {
        const target = undefined
        const source = { bob: { age: 30 } }
        const result = merge(target, source)
        expect(result).to.deep.equal({ bob: { age: 30 } })
        expect(result).toBe(source)
    })
    it('with undefined source returns target', () => {
        const target = { bob: { age: 30 }, alice: { age: 40 } }
        const source = undefined
        const result = merge(target, source)
        expect(result).to.deep.equal({ bob: { age: 30 }, alice: { age: 40 } })
        expect(result).toBe(target)
    })
    it('with null property', () => {
        const target = { name: 'bob' }
        const source = { name: null }
        const result = merge(target, source)
        expect(result).to.deep.equal({ name: null })
        expect(result).not.toBe(target)
    })
    describe('with deleteNullProps = true', () => {
        it('deletes null property', () => {
            const target = { name: 'bob', age: 30 }
            const source = { name: null }
            const result = merge(target, source, { deleteNullProps: true })
            expect(result).to.deep.equal({ age: 30 })
            expect(result).not.toBe(target)
        })
        it('cascade deletes empty objects', () => {
            const target = { name: 'bob' }
            const source = { name: null }
            const result = merge(target, source, { deleteNullProps: true })
            expect(result).toBe(null)
        })
        it('returns source with deleted null props when target is undefined', () => {
            const target = undefined
            const source = { name: null }
            const result = merge(target, source, { deleteNullProps: true })
            expect(result).toBe(null)
        })
        it('returns target when no ops ', () => {
            const target = { name: 'bob' }
            const source = { age: null }
            const result = merge(target, source, { deleteNullProps: true })
            expect(result).to.deep.equal({ name: 'bob' })
            expect(result).toBe(target)
        })
    })
    describe('with forceUpdate = true', () => {
        it('returns new instance even if there are no ops', () => {
            const target = { bob: { age: 30 }, alice: { age: 40 } }
            const source = { bob: { age: 30 } }
            const result = merge(target, source, {forceUpdate: true})
            expect(result).to.deep.equal({ bob: { age: 30 }, alice: { age: 40 } })
            expect(result.alice).toBe(target.alice)
            expect(result.bob).not.toBe(target.bob)
            expect(result).not.toBe(target)
        })
    })
})
