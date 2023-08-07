export class Tokenizer {
    *tokenize(
        markdown: string,
        tokenizer: (text: string, index: number) => [string, number, boolean?]
    ) {
        let index = 0
        let buffer = ''

        while (index < markdown.length) {
            const [token, position, isText] = tokenizer(markdown, index)

            if (isText) {
                buffer += token
                index = position
                continue
            }

            if (buffer) {
                yield buffer
                buffer = ''
            }

            yield token
            index = position
        }

        if (buffer) {
            yield buffer
        }
    }

    createTokenizer(
        textTokenizers: ((text: string, index: number) => [string, number, boolean?])[]
    ) {
        return (text: string, index: number) => {
            for (const textTokenizer of textTokenizers) {
                const result = textTokenizer.bind(this)(text, index)
                if (result) return result
            }
        }
    }
}
