
import * as path from 'path'
import * as fs from 'fs'
import {AppGateway} from "./AppGateway";
import {ConceptInfo, MilestoneInfo} from "../../src/data-type/ConceptTypes"


function writeMessage(subject:string, message:string) {
    AppGateway.sendMessage('IM',{subject, message})
}

export class DeveritaeFile {

    // the concept file is in (root)/project/concept.dvt
    private dvtRoot:string;
    private text:string;
    private concept:ConceptInfo = new ConceptInfo()

    constructor(projectRoot:string) {
        this.dvtRoot = path.join(projectRoot, 'project')
    }

    private nextBlockTitle(startIndex) {
        const ln = startIndex ? this.text.indexOf('\n', startIndex) : 0;
        const hn = this.text.indexOf('#', ln)
        let e = this.text.indexOf('\n', hn+1)
        if(e === -1) e = this.text.length
        const title = this.text.substring(hn+1, e).trim()
        return {
            title,
            nextPosition: e+1
        }
    }

    private readBlock(name:string) : string {
        let nbt = {title:'', nextPosition: 0}
        while(nbt.title !== name) {
            nbt = this.nextBlockTitle(nbt.nextPosition)
            if(nbt.nextPosition >= this.text.length) break;
        }
        if(nbt.title === name) {
            // now advance past the title line, and find the end of block (or end of text)
            let n = this.text.indexOf('#', nbt.nextPosition)
            if (n == -1) n = this.text.length;
            const block = this.text.substring(nbt.nextPosition, n)
            return block.trim()
        } else {
            // console.warn('dvt block '+name+' not found')
            writeMessage('Warning', 'dvt block '+name+' not found')
        }
        return '';
    }
    private readItems(block:string) : string[] {
        const lines:string[] = block.split('\n')
        const items:string[] = []
        lines.forEach(line => {
            if(line.trim().charAt(0) === '-') {
                items.push(line.substring(1).trim())
            }
        })
        return items;
    }

    // read and parse the concept file
    readConcept() {
        const dvt = path.join(this.dvtRoot, 'concept.dvt')
        if(fs.existsSync(dvt)) {
            this.text = fs.readFileSync(dvt).toString()
            this.concept.projectName = this.readBlock('Project Name')
            this.concept.devDescription = this.readBlock('Project Development Description')
            this.concept.tagLine = this.readBlock('Product tagline')
            this.concept.elevatorPitch = this.readBlock('Elevator Pitch')
            let stepItems = this.readItems(this.readBlock('Development Milestones'))
            stepItems.forEach(item => {
                let startDate = new Date(); // TODO: parse dates from item as in: Milestone 1 (Aug 1, 2020 - Aug 31, 2020)
                let endDate = new Date();
                this.concept.milestones.push({
                    name: item,
                    description: '',
                    targetDateStart: startDate,
                    targetDateEnd: endDate,
                    objectives: []
                })
            })
            this.text = null; // clear when done
        }
    }
    // read and parse a feature dvt file
    readFeature(name:string) : MilestoneInfo {
        const out: MilestoneInfo = new MilestoneInfo()
        const dvt = path.join(this.dvtRoot, name+'.dvt')
        if(fs.existsSync(dvt)) {
            this.text = fs.readFileSync(dvt).toString()
            const fname = this.readBlock('Feature Name')
            if(fname !== name) {
                // console.error(`Feature Name in '${dvt}', "${fname}", is different than "${name}" in 'concept.dvt'`)
                writeMessage('Error', `Feature Name in '${name+'.dvt'}', "${fname}", is different than "${name}" in 'concept.dvt'`)
            }
            const desc = this.readBlock('Description')
            const objectives = this.readItems(this.readBlock('Objectives'))
            out.name = fname;
            out.description = desc;
            out.objectives = objectives;
        } else {
            // console.error(`>>> ${dvt} file not found`)
            writeMessage('Error', `${name+'.dvt'} file not found`)
        }
        return out;
    }

    parseTree() {
        this.readConcept()
        this.concept.milestones.forEach(step => {
            const fi = this.readFeature(step.name)
            step.description = fi.description
            step.objectives = fi.objectives
        })
        return this.concept;
    }

}


export function readConcept(rootPath) {
    const df = new DeveritaeFile(rootPath)
    return df.parseTree()
}