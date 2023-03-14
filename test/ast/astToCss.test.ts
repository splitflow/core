import { describe, expect, it } from 'vitest'
import { ASTToCSSVisitor, RootNode } from '../../src/ast'
import { styleToAST, astToStyle, SplitflowStyleDef } from '../../src/style'

describe('astToCss', () => {
    describe('ASTToCSSVisitor selector', () => {
        it('with element ', () => {
            const visitor = new ASTToCSSVisitor()
            const css = visitor.root({
                type: 'snapshot',
                'Component-element': { padding: { top: 1 } }
            })

            expect(css).to.deep.equal({ '.Component-element': { 'padding-top': '1rem' } })
        })

        it('with root element ', () => {
            const visitor = new ASTToCSSVisitor()
            const css = visitor.root({
                type: 'snapshot',
                'Component-root': { padding: { top: 1 } }
            })

            expect(css).to.deep.equal({ '.Component-root': { 'padding-top': '1rem' } })
        })

        it('with element variant', () => {
            const visitor = new ASTToCSSVisitor()
            const css = visitor.root({
                type: 'snapshot',
                'Component-element:selected': { padding: { top: 1 } }
            })

            expect(css).to.deep.equal({ '.Component-element.selected': { 'padding-top': '1rem' } })
        })

        it('with component variant', () => {
            const visitor = new ASTToCSSVisitor()
            const css = visitor.root({
                type: 'snapshot',
                'Component:selected-element': { padding: { top: 1 } }
            })

            expect(css).to.deep.equal({
                '.Component-root.selected .Component-element': { 'padding-top': '1rem' }
            })
        })

        it('with component variant and root element ', () => {
            const visitor = new ASTToCSSVisitor()
            const css = visitor.root({
                type: 'snapshot',
                'Component:selected-root': { padding: { top: 1 } }
            })

            expect(css).to.deep.equal({ '.Component-root.selected': { 'padding-top': '1rem' } })
        })

        it('with both component and element variant', () => {
            const visitor = new ASTToCSSVisitor()
            const css = visitor.root({
                type: 'snapshot',
                'Component:selected-element:selected': { padding: { top: 1 } }
            })

            expect(css).to.deep.equal({
                '.Component-root.selected .Component-element.selected': { 'padding-top': '1rem' }
            })
        })
    })
})
