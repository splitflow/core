import { CText, type Element, type Text, CElement, type Node, CDocumentFragment } from './node'

export class Parser {
    parse(
        tokens: string[],
        range: [number, number],
        parser: (tokens: string[], range: [number, number]) => [Node, number]
    ) {
        const fragment = this.createDocumentFragment()
        let index = range[0]

        while (index < range[1]) {
            const [node, position] = parser(tokens, [index, range[1]])
            fragment.appendChild(node)
            index = position
        }
        return fragment
    }

    createDocumentFragment(): Node {
        return new CDocumentFragment()
    }

    createElement(tagName: string): Element {
        return new CElement(tagName)
    }

    createTextNode(data: string): Text {
        return new CText(data)
    }

    createParser(tokenParsers: ((tokens: string[], range: [number, number]) => [Node, number])[]) {
        return (tokens: string[], range: [number, number]) => {
            for (const tokenParser of tokenParsers) {
                const result = tokenParser.bind(this)(tokens, range)
                if (result) return result
            }
        }
    }
}