import {
    DOCUMENT_FRAGMENT_NODE,
    ELEMENT_NODE,
    TEXT_NODE,
    type Element,
    type Node,
    type Text
} from './node'

export abstract class Emitter {
    emit(node: Node) {
        for (const childNode of node.childNodes) {
            if (childNode.nodeType === ELEMENT_NODE) {
                this.element(childNode as Element)
            } else if (childNode.nodeType === TEXT_NODE) {
                this.text(childNode as Text)
            } else if (childNode.nodeType === DOCUMENT_FRAGMENT_NODE) {
                this.emit(childNode)
            }
        }
    }

    abstract element(node: Element): void
    abstract text(node: Text): void
}
