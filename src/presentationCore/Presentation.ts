
import {AppModel} from "./AppModel";

let done = true;

/**
 * Information returned from tokenize function of Tokenizer
 */

const whitespace = [' ','\t','\r\n','\n','\r']
class StringParser {
    private parseString: string;
    private parsePos: number;

    constructor (parseString:string) {
        this.parseString = parseString;
        this.parsePos = 0;
    }

    /**
     * Moves just behind the match occurrence, looking forward
     *
     * @param match
     */
    public aheadTo(match) : void {
        this.parsePos = this.parseString.indexOf(match, this.parsePos)
    }

    /**
     * Moves just forward of the match occurrence, looking forward
     * @param match
     */
    public aheadPast(match) : void {
        this.parsePos = this.parseString.indexOf(match, this.parsePos) + match.length;
    }

    /**
     * Moves just forward the match occurrence, looking backward.
     * @param match
     */
    public backTo(match) : void {
        this.backBefore(match);
        this.parsePos += match.length;

    }

    /**
     * Moves to the start of the match occurrence, looking backward.
     * @param match
     */
    public backBefore(match) : void {
        this.parsePos = this.parseString.lastIndexOf(match, this.parsePos)

    }

    /**
     * Reads the word next in the parse string.
     * "Word" is terminated by the occurrence of one of the given delimiters.
     *
     * @param delimiters
     */
    public readNext(delimiters?: string[]) : string {
        if(!delimiters) delimiters = whitespace;
        let index = -1;
        let ds = delimiters.slice(0); // make copy
        while(index === -1) {
             const d = ds.shift()
            if(!d) break;
            index = this.parseString.indexOf(d, this.parsePos)
        }
        if(index === -1) index = undefined;
        const word = this.parseString.substring(this.parsePos, index)
        this.parsePos = index ? index + 1 : this.parseString.length;
        this.skipWhitespace()
        return word;
    }

    /**
     * Reads the word prior to the current position.
     * "Word" is terminated by the occurrence of one of the given delimiters.
     *
     * @param delimiters
     */
    public readPrevious(delimiters?:string[]) : string {
        if(!delimiters) delimiters = whitespace;
        let index = -1;
        let ds = delimiters.slice(); // make copy
        while(index === -1) {
            const d = ds.shift()
            if(!d) break;
            index = this.parseString.lastIndexOf(d, this.parsePos)
        }
        if(index === -1) index = 0;
        const word = this.parseString.substring(index, this.parsePos)
        return word;
    }

    /**
     * advances past any interceding whitespace at current position.
     */
    public skipWhitespace() : void {
        while(whitespace.indexOf(this.parseString.charAt(this.parsePos)) !== -1) {
            this.parsePos++
        }
    }

    /**
     * Returns the remaining part of the string ahead of parse position
     */
    public getRemaining() : string {
        return this.parseString.substring(this.parsePos + 1)
    }

    /**
     * Moves the current parse position the given amount
     * @param charCount
     */
    public advancePosition(charCount:number) {
        this.parsePos += charCount;
    }

    /**
     * Returns the current parse position
     */
    public get parsePosition() { return this.parsePos }


}

export default
class Presentation {
    private name: string = 'Test App'
    private callbacks: object = {}
    private appModel:AppModel = new AppModel()

    public get model() {
        return this.appModel
    }
    public presentationName() { return this.name + ' Presentation Core'; }
    public testSignal(n:number): number {
        console.log('testSignal received: ' + n)
        return n * 10
    }
    public get items() { return [
        {title: 'collapse tree', done},
        {title: 'click on leaf', done},
        {title: 'document structure and accessors'},
        {title: 'refactor as a platform'}
    ]}

    public makeStringParser(str) {
        return new StringParser(str)
    }

    public registerCallback(name, callback) {
        if(typeof callback !== 'function') {
            console.error(Error(`registered name ${name} is not a function`))
            return;
        }
        this.callbacks[name] = callback;
    }
    public findCallback(name) {
        const cb = this.callbacks[name]
        if(!cb) {
            console.warn(`Warning: callback ${name} is not registered`)
        }
        return cb;
    }

}

