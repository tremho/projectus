
import {AppModel} from "./AppModel";
import {StringParser} from "../general/StringParser"

import {getInfoMessageRecorder, InfoMessageRecorder} from "./InfoMessageRecorder";
import {SpecificationInfo, UMLInfo, UseCaseInfo} from "../data-type/ConceptTypes";

let imrSingleton:InfoMessageRecorder = getInfoMessageRecorder()

function writeMessage(subject:string, message:string) {
    imrSingleton.write(subject, message)
}

const mainApi = (window as any).api;

let done = true;


export default
/**
 *  Core object of the application.  Contains the app model and gateway functions for actions, which are
 *  mostly handled by action modules.
 */
class AppCore {
    private appModel:AppModel = new AppModel()
    private rootPath:string;
    private topLevelInfo:object;

    /**
     * get the model used for binding to the UI.
     */
    public get model() {
        return this.appModel
    }

    /**
     * Return an instance of StringParser for the given string
     * @param str
     */
    public makeStringParser(str) {
        return new StringParser(str)
    }
    
    /**
     * Set the root directory of the project we are concerned with
     * @param path
     */
    public setProjectRoot (path:string) {
        this.rootPath = path;  // TODO: Not currently used
    }

    public requestMessages() {
        mainApi.messageInit().then(() => {
            console.log('messages wired')
        })
    }

    private showInfo() {
        this.model.setAtPath('uiElements.page', 'info')
    }
    private showMilestones() {
        this.model.setAtPath('uiElements.page', 'milestones')
    }
    private showObjectives() {
        this.model.setAtPath('uiElements.page', 'objectives')
    }
    private showSpecifications() {
        this.model.setAtPath('uiElements.page', 'specifications')
    }

    public setupUIElements() {
        console.log('>>> setupUIElements >>>')
        this.model.addSection('uiElements', {
            page: 'info',
            msState: 'display',
            msSelectedIndex: -1,
            selectedNav: '',
            navTree: [
                {
                    index: 0,
                    label: "Basic Info",
                    click: (e) => {
                        this.showInfo();
                    }
                }, {
                    index: 1,
                    label: "Milestones",
                    click: (e) => {
                        this.showMilestones()
                    },
                    items: []

                },{
                    index: 2,
                    label: "Objectives",
                    click: (e) => {
                        this.showObjectives()
                    },
                    items: []
                    //     {label: "Infrastructure", click: (e)=> {this.showObjectives('Infrastructure')}},
                    //     {label: "Library/Utility", click: (e)=> {this.showObjectives('Library')}},
                    //     {label: "Information Model", click: (e)=> {this.showObjectives('IM')}},
                    //     {label: "Business Logic", click: (e)=> {this.showObjectives('BusinessLogic')}},
                    //     {label: "User Interface", click: (e)=> {this.showObjectives('UI')}},
                    //     {label: "External Tasks", click: (e)=> {this.showObjectives('External')}},
                    //     {label: "Refactoring", click: (e)=> {this.showObjectives('Refactoring')}}
                    // ]
                }, {
                    index: 3,
                    label: 'Specifications',
                    click: (e) => {
                        this.showSpecifications()
                    },
                    items: []
                    //     {label: "Infrastructure", click: (e)=> {this.showSpecifications('Infrastructure')}},
                    //     {label: "Library/Utility", click: (e)=> {this.showSpecifications('Library')}},
                    //     {label: "Information Model", click: (e)=> {this.showSpecifications('IM')}},
                    //     {label: "Business Logic", click: (e)=> {this.showSpecifications('BusinessLogic')}},
                    //     {label: "User Interface", click: (e)=> {this.showSpecifications('UI')}},
                    //     {label: "External Tasks", click: (e)=> {this.showSpecifications('External')}},
                    //     {label: "Refactoring", click: (e)=> {this.showSpecifications('Refactoring')}}
                    // ]
                }, {
                    index: 4,
                    label: "Build Tools",
                    click: (e) => {
                        console.log('show build tools')
                    }
                }
            ]
        })
        // set the infomessage log handling
        this.model.addSection('infoMessage', { messages: [] })
        mainApi.addMessageListener('IM', data => {
            writeMessage(data.subject, data.message)
        })
        imrSingleton.subscribe(msgArray => {
            this.model.setAtPath('infoMessage.messages', msgArray)
        })

        this.model.setAtPath('uiElements.selectedNav', 'x-0') // basic info

        return Promise.resolve(); // this is called as a promise
    }
    flatten(obj) {
        const flatObj = {}
        Object.getOwnPropertyNames(obj).forEach(prop => {

            let value = obj[prop]
            if( typeof value === 'object') {
                if(!Array.isArray(value)) {
                    value = this.flatten(value)
                }
            }
            flatObj[prop] = value
        })
        return flatObj
    }

    /**
     * Use some general discovery and action module interfaces to determine what
     * type(s) of project is at the root directory.
     */
    public discovery() {
        // quick sniffs to rule in/out different modules
        return mainApi.projectDiscovery(this.rootPath).then(results => {
            console.log('Top Level Info', results)
            this.model.addSection('topLevelInfo', results);

            return mainApi.readConcept(this.rootPath).then(results => {
                console.log('Concept Tree', results)
                this.model.addSection('concept', results)

                // set up the use-case conponents
                return mainApi.readUseCaseAssets().then(useCaseAssets => {
                    console.log('--- recording useCase collections', useCaseAssets)
                    this.model.setAtPath('useCase', useCaseAssets, true)
                })
            })

        })
    }

    public updateMilestone(milestoneInfo, atIndex) {
        const milestones = this.model.getAtPath('concept.milestones')
        if(typeof atIndex === 'undefined') {
            atIndex = this.model.getAtPath('uiElements.msSelectedIndex')
        }
        if(milestones[atIndex]) {
            // console.log('updating milestone index '+ atIndex)
            milestones[atIndex] = milestoneInfo
            this.model.setAtPath('concept.milestones', milestones)
            this.model.setAtPath('uiElements.msSelectedIndex', atIndex)
        }
    }

    public performUpdateAction() {
        console.log('performing verity update sweep')

        // so... TLInfo updates should migrate to the correct files, per project type
        // (e.g. package.json)

        const topLevelInfo = this.flatten(this.model.getAtPath('topLevelInfo'))
        const conceptTree = this.flatten(this.model.getAtPath('concept'))
        const useCaseAssets = this.flatten(this.model.getAtPath('useCase'))

        Promise.all([
            mainApi.writeBackTopLevel(topLevelInfo),
            mainApi.writeConcept(conceptTree),
            mainApi.writeUseCaseAssets(useCaseAssets)
        ]).then(() => {
            console.log('finished with verity operations')
        })
    }
    
    public addNewUseCaseActor(actor:string) : boolean {
        const actors = this.model.getAtPath('useCase.actors') || []
        let add = actors.indexOf(actor) === -1
        if(add) {
            actors.push(actor)
            actors.sort()
            this.model.setAtPath('useCase.actors',actors, true)
        }
        return add
    }

    public addNewUseCaseRole(role:string) : boolean {
        const roles = this.model.getAtPath('useCase.roles') || []
        let add = roles.indexOf(role) === -1
        if(add) {
            roles.push(role)
            roles.sort()
            this.model.setAtPath('useCase.roles',roles, true)
        }
        return add
    }

    public addNewUseCasePackage(pckg:string) : boolean {
        const packages = this.model.getAtPath('useCase.packages') || []
        let add = packages.indexOf(pckg) === -1
        if(add) {
            packages.push(pckg)
            packages.sort()
            this.model.setAtPath('useCase.packages',packages, true)
        }
        return add
    }

    public addUseCaseScenario(msIndex:number, obIndex:number, caseData:UseCaseInfo) {
        // concept.milestones[ms].objectives[ob].specifications.uml.useCases
        console.log('>> addUseCaseScenario')
        const milestones = this.model.getAtPath('concept.milestones')
        const milestone = milestones[msIndex]
        const objectives = milestone.objectives;
        const objective = objectives[obIndex]
        if(!objective.specifications) {
            objective.specifications = new SpecificationInfo()
        }
        if(!objective.specifications.uml) {
            objective.specifications.uml = new UMLInfo()
        }
        console.log('target objective', objective)
        let useCases = objective.specifications.uml.useCases
        useCases.push(caseData)
        this.model.setAtPath('concept.milestones', milestones)
    }
    
}

