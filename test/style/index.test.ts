import { describe, expect, it } from 'vitest'
import { RootNode } from '../../src/ast'
import { styleToAST, astToStyle, SplitflowStyleDef } from '../../src/style'

const styleDef: SplitflowStyleDef = {
    root: {
        padding: { top: 1 },
        ':selected': {
            padding: { top: 2 }
        },
        '@:hover': {
            padding: { top: 3 }
        },
        '@:hover:selected': {
            padding: { top: 4 }
        }
    }
}

const ast: RootNode = {
    type: 'fragment',
    'Component-root': {
        padding: { top: 1 }
    },
    'Component-root:selected': {
        padding: { top: 2 }
    },
    'Component:hover-root': {
        padding: { top: 3 }
    },
    'Component:hover-root:selected': {
        padding: { top: 4 }
    }
}

describe('styledef', () => {
    describe('styleToAST', () => {
        it('with variants', () => {
            expect(styleToAST('Component', styleDef)).to.deep.equal(ast)
        })
    })
    describe('astToStyle', () => {
        it('with variants', () => {
            const result = [...astToStyle(ast)]

            expect(result).to.have.length(1)
            expect(result[0][0]).to.equal('Component')
            expect(result[0][1]).to.deep.equal(styleDef)
        })
    })
})
