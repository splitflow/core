
import { describe, expect, it } from 'vitest'
import { addDigit, bound, trunc } from '../src/utils/number'

describe('number', () => {
    it('.addDigit()', () => {
        expect(addDigit('1', '5')).to.equal('15')
    })
    it('.addDigit() with dot', () => {
        expect(addDigit('1', '.')).to.equal('1.')
        expect(addDigit('1.', '5')).to.equal('1.5')
        expect(addDigit('1.', '.')).to.equal('1.')
    })
    it('.addDigit() with no value', () => {
        expect(addDigit(null as any, '5')).to.equal('5')
        expect(addDigit('0', '5')).to.equal('5')
    })
    it('.trunc()', () => {
        expect(trunc('1', null as any)).to.equal('1')
        expect(trunc('1.', null as any)).to.equal('1')
        expect(trunc('1.0', null as any)).to.equal('1')
        expect(trunc('1', 1)).to.equal('1')
        expect(trunc('1.', 1)).to.equal('1.')
        expect(trunc('1.0', 1)).to.equal('1.0')
        expect(trunc('1.00', 1)).to.equal('1.0')
    })
    it('.bound()', () => {
        expect(bound('5', 0, 10)).to.equal('5')
    })
})