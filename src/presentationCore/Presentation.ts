
let done = true;

export default
class Presentation {
    private name: string = 'Test App'

    public get appName() { return this.name; }
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
}

