
import * as path from 'path'
import * as fs from 'fs'
import {SimpleDateFormat} from '../../src/general/SimpleDateFormat'
import {AppGateway} from "./AppGateway";
import {ConceptInfo, MilestoneInfo, ObjectiveInfo, SpecificationInfo,
        UMLInfo, ApiInfo, UseCaseAssets, UseCaseInfo} from "../../src/data-type/ConceptTypes"


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

    // make a text block to write with a name
    private makeBlock(name:string , text:string): string {
        let block = '# '+name+'\n'+text+'\n\n';
        return block;
    }
    // make an items block to write
    private makeItemsBlock(items:string[]): string{
        const lines:string[] = []
        items.forEach(it => {
            it = it.trim()
            if(it.charAt(0) != '-') {
                it = '- ' + it
            }
            lines.push(it)
        })
        return lines.join('\n')
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
                // TODO: read this detail from the milestone files
                let startDate = new Date();
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

    writeConcept() {
        let text = this.makeBlock('Project Name', this.concept.projectName)
        text += this.makeBlock('Project Development Description', this.concept.devDescription)
        text += this.makeBlock('Product tagline', this.concept.tagLine)
        text += this.makeBlock('Elevator Pitch', this.concept.elevatorPitch)
        text += '# Development Milestones\n'
        let msItems = []
        this.concept.milestones.forEach(ms => { msItems.push(ms.name) })
        text += this.makeItemsBlock(msItems)
        this.concept.milestones.forEach(msInfo => {
            this.writeMilestone(msInfo)
        })
        const dvt = path.join(this.dvtRoot, 'concept.dvt')
        fs.writeFileSync(dvt, text)
    }
    // read and parse a milestone dvt file
    readMilestone(name:string) : MilestoneInfo {
        const out: MilestoneInfo = new MilestoneInfo()
        const dvt = path.join(this.dvtRoot, name+'.dvt')
        if(fs.existsSync(dvt)) {
            this.text = fs.readFileSync(dvt).toString()
            const fname = this.readBlock('Milestone Name')
            if(fname !== name) {
                // console.error(`Feature Name in '${dvt}', "${fname}", is different than "${name}" in 'concept.dvt'`)
                writeMessage('Error', `Milestone Name in '${name+'.dvt'}', "${fname}", is different than "${name}" in 'concept.dvt'`)
            }
            const startDate = this.readBlock('Target Start Date')
            const endDate = this.readBlock('Target End Date')
            const desc = this.readBlock('Description')
            const objectives = this.readItems(this.readBlock('Objectives'))
            out.name = fname;
            out.targetDateStart = new Date(startDate);
            out.targetDateEnd = new Date(endDate);
            out.description = desc;
            out.objectives = [];
            objectives.forEach(title => {
                const objInfo = new ObjectiveInfo()
                objInfo.title = title
                objInfo.specifications.uml.useCases = this.readUseCases(title)
                out.objectives.push(objInfo)
            })

        } else {
            // console.error(`>>> ${dvt} file not found`)
            writeMessage('Error', `${name+'.dvt'} file not found`)
        }
        return out;
    }
    readUseCases(title:string) : UseCaseInfo[] {
        const out = []
        const items = this.readItems(this.readBlock(title))
        items.forEach(it => {
            it = it.trim()
            if(it.charAt(0) === '-') it = it.substring(1)
            let st = it.indexOf('[')+1
            let en = it.indexOf(']', st)
            let pkg = it.substring(st, en)
            st = en+1;
            en = it.indexOf(':', st)
            let d = it.substring(st, en)
            st = d.indexOf('(')
            let actor, role;
            if(st === -1) {
                actor = d;
                role = '';
            } else {
                actor = d.substring(0, st).trim()
                role = d.substring(st+1, d.indexOf(')', st))
            }
            st = en + 1
            en = it.indexOf(':', st)
            let scenario = it.substring(st, en)
            let outcome = it.substring(en+1)

            let uc = new UseCaseInfo()
            uc.pkg = pkg;
            uc.actor = actor
            uc.role = role
            uc.scenario = scenario
            uc.outcome = outcome
            out.push(uc)
        })
        return out;
    }
    // write milestone info to its own dvt file
    writeMilestone(msInfo:MilestoneInfo) {
        const dvt = path.join(this.dvtRoot, msInfo.name+'.dvt')
        let dtStart = new SimpleDateFormat(msInfo.targetDateStart)
        dtStart.setFormat('WWW MMM D YYYY')
        let dtEnd = new SimpleDateFormat(msInfo.targetDateEnd)
        dtEnd.setFormat('WWW MMM D YYYY')
        let text = this.makeBlock('Milestone Name', msInfo.name)
        text += this.makeBlock('Target Start Date', dtStart.toString())
        text += this.makeBlock('Target End Date', dtEnd.toString())
        text += this.makeBlock('Description', msInfo.description)
        text += '# Objectives\n'
        let objs = []
        let ucText = '\n\n'
        msInfo.objectives.forEach(o=> {
            objs.push(o.title)
            ucText += this.makeUseCaseBlock(o) + '\n'
        })
        text += this.makeItemsBlock(objs) + ucText;
        fs.writeFileSync(dvt, text)
    }

    makeUseCaseBlock(obj:ObjectiveInfo): string {
        // format and write out use case data
        let ucases = obj.specifications.uml.useCases
        let items = []
        ucases.forEach(ucase => {
            let ar = ucase.actor;
            if(ucase.role) ar += ` (${ucase.role})`
            let ln = `[${ucase.pkg}] ${ar} : ${ucase.scenario} : ${ucase.outcome}`
            items.push(ln)
        })
        return this.makeBlock(obj.title, this.makeItemsBlock(items))
    }

    parseTree() {
        this.readConcept()
        this.concept.milestones.forEach(step => {
            const fi = this.readMilestone(step.name)
            step.description = fi.description
            step.objectives = fi.objectives
        })
        return this.concept;
    }

    writeTree(conceptTree) {
        this.concept = conceptTree
        return this.writeConcept()

    }

    /**
     * Collections are data collected for project purposes, like actors, roles, scenarios, various status records, etc.
     * that we want to persist.  These are in the project directory under collections.dvt
     */
    readCollections() {
        const dvt = path.join(this.dvtRoot, 'collections.dvt')
        const useCaseAssets = {
            actors: [],
            roles: [],
            packages: [],
            scenarios: []
        }
        if (fs.existsSync(dvt)) {
            this.text = fs.readFileSync(dvt).toString()
            useCaseAssets.actors = this.readItems(this.readBlock('Use Case Actors'))
            useCaseAssets.roles = this.readItems(this.readBlock('Use Case Roles'))
            useCaseAssets.packages = this.readItems(this.readBlock('Project Areas (Packages)'))
        }
        console.log('>>>> read collections', useCaseAssets)
        return useCaseAssets
    }
    writeCollections(useCaseAssets:UseCaseAssets) {
        const dvt = path.join(this.dvtRoot, 'collections.dvt')
        let text = this.makeBlock('Use Case Actors', this.makeItemsBlock(useCaseAssets.actors))
        text += this.makeBlock('Use Case Roles', this.makeItemsBlock(useCaseAssets.roles))
        text += this.makeBlock('Project Areas (Packages)', this.makeItemsBlock(useCaseAssets.packages))
        fs.writeFileSync(dvt, text)
    }

    readScenarios() {
        console.log('# readScenarios')
        const dvt = path.join(this.dvtRoot, 'scenarios.dvt')
        const scenarios = []

        // - package : actor <<role>> : scenario text : outcome text
        if (fs.existsSync(dvt)) {
            this.text = fs.readFileSync(dvt).toString()
            console.log('...text', this.text)
            const block = this.readBlock('Scenarios')
            console.log('...block', block)
            const items = this.readItems(block)
            console.log('...items', items)
            items.forEach(it => {
                const p = it.split(':')
                let pkg = p[0].trim()
                if (pkg.charAt(0) === '-') {
                    pkg = pkg.substring(1).trim()
                }
                let actor, role
                let ar = p[1].trim()
                let rs = ar.indexOf('<<')
                if (rs !== -1) {
                    let re = ar.indexOf('>>', rs)
                    role = ar.substring(rs + 2, re)
                    actor = ar.substring(0, rs).trim()
                } else {
                    role = ''
                    actor = ar
                }
                let scenarioText = p[2].trim()
                let outcomeText = p[3].trim()
                let scene = new UseCaseInfo();
                scene.actor = actor
                scene.role = role;
                scene.pkg = pkg;
                scene.scenario = scenarioText;
                scene.outcome = outcomeText;
                console.log('...scene', scene)
                scenarios.push(scene)
            })
        }
        return scenarios;
    }

    writeScenarios(scenarios) {
        let text = '# Scenarios\n'
        scenarios.forEach(scene => {
            let {pkg, actor, role, scenario, outcome} = scene
            let ar = actor;
            if(role && role.length) ar += ` <<${role}>>`
            text += `- ${pkg} : ${ar} : ${scenario} : ${outcome}\n`
        })
        const dvt = path.join(this.dvtRoot, 'scenarios.dvt')
        fs.writeFileSync(dvt, text)
    }

}

let dfInstance = null

/**
 * Read the concept tree starting with concept.dvt
 * Call this function first to establish the Deveritae File parser instance.
 * @param rootPath
 */
export function readConcept(rootPath) : ConceptInfo {
    console.log('## readConcept')
    dfInstance = new DeveritaeFile(rootPath)
    return dfInstance .parseTree()
}

/**
 * Read the Use Case Assets and recorded scenarios
 */
export function readUseCaseAssets():UseCaseAssets {
    console.log('## readUseCaseAssets')
    const scenarios = dfInstance.readScenarios()
    console.log('scenarios',scenarios)
    const useCaseAssets = dfInstance.readCollections()
    useCaseAssets.scenarios = scenarios;
    console.log('>>>> read useCaseAssets', useCaseAssets)
    return useCaseAssets
}

/**
 * Write out the current concept tree
 * @param conceptTree
 */
export function writeConcept(conceptTree : ConceptInfo) {
    return dfInstance.writeTree(conceptTree)
}

/**
 * write out current useCaseAssets and scenarios
 * @param useCaseAssets
 */
export function writeUseCaseAssets(useCaseAssets:UseCaseAssets) {
    dfInstance.writeCollections(useCaseAssets)
    dfInstance.writeScenarios(useCaseAssets.scenarios)
}