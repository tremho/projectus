
export default
class Presentation {
    private name: string = 'Test App'

    public get appName() { return this.name; }
    public presentationName() { return this.name + ' Presentation Core'; }
    public testSignal(n:number): number {
        console.log('testSignal received: ' + n)
        return n * 10
    }
}

