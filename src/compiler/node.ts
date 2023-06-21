export interface Node {
    nodeType: number
    nodeName: string
    childNodes: Iterable<Node>
    appendChild: (node: Node) => void
}

export interface Element extends Node {
    tagName: string
    setAttribute: (qualifiedName: string, value: string) => void
    getAttribute: (qualifiedName: string) => string
}

export interface Text extends Node {
    textContent: string
}

export const ELEMENT_NODE = 1
export const DOCUMENT_FRAGMENT_NODE = 11
export const TEXT_NODE = 3

export class CDocumentFragment implements Node {
    constructor() {
        this.#childNodes = new Array<Node>()
    }

    #childNodes: Node[]

    get nodeType() {
        return 11
    }

    get nodeName() {
        return '#document-fragment'
    }

    get childNodes() {
        return this.#childNodes.values()
    }

    appendChild(node: Node) {
        this.#childNodes.push(node)
    }
}

export class CElement implements Element {
    constructor(tagName) {
        this.#tagName = tagName
        this.#childNodes = new Array<Node>()
        this.#attributes = new Map<string, string>()
    }

    #tagName: string
    #childNodes: Node[]
    #attributes: Map<string, string>

    get nodeType() {
        return 1
    }

    get nodeName() {
        return this.#tagName
    }

    get tagName() {
        return this.#tagName
    }

    get childNodes() {
        return this.#childNodes.values()
    }

    appendChild(node: Node) {
        if (node instanceof CDocumentFragment) {
            this.#childNodes.push(...node.childNodes)
        } else {
            this.#childNodes.push(node)
        }
    }

    setAttribute(qualifiedName: string, value: string) {
        this.#attributes.set(qualifiedName, value)
    }

    getAttribute(qualifiedName: string) {
        return this.#attributes.get(qualifiedName)
    }
}

export class CText implements Text {
    constructor(text: string) {
        this.#text = text
    }

    #text: string

    get nodeType() {
        return 3
    }

    get nodeName() {
        return '#text'
    }

    get textContent() {
        return this.#text
    }

    get childNodes(): IterableIterator<Node> {
        throw new Error("MDText doesn't implement childNodes")
    }

    appendChild(_: Node) {
        throw new Error("MDText doesn't implement appendChild")
    }
}
