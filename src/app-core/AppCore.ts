
import {AppModel} from "./AppModel";
import {StringParser} from "../general/StringParser"

import {getInfoMessageRecorder, InfoMessageRecorder} from "./InfoMessageRecorder";

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
    
    private showObjectives(type) {
        console.log('show '+type+' objectives')
    }
    private showSpecifications(type) {
        console.log('show '+type+' specifications')
    }

    public setupUIElements() {
        this.model.addSection('uiElements', {
            navTree: [
                {
                    index: 0,
                    label: "Basic Info",
                    click: (e) => {
                        console.log('Show Basic Info')                    
                    }
                },{
                    index: 1,
                    label: "Objectives",
                    click: (e) => {
                        this.showObjectives('General')  
                    },   
                    items: [
                        {label: "Infrastructure", click: (e)=> {this.showObjectives('Infrastructure')}},
                        {label: "Library/Utility", click: (e)=> {this.showObjectives('Library')}},
                        {label: "Information Model", click: (e)=> {this.showObjectives('IM')}},
                        {label: "Business Logic", click: (e)=> {this.showObjectives('BusinessLogic')}},
                        {label: "User Interface", click: (e)=> {this.showObjectives('UI')}},
                        {label: "External Tasks", click: (e)=> {this.showObjectives('External')}},
                        {label: "Refactoring", click: (e)=> {this.showObjectives('Refactoring')}}
                    ]
                }, {
                    index: 2,
                    label: 'Specifications',
                    click: (e) => {
                        this.showSpecifications('General')
                    },
                    items: [
                        {label: "Infrastructure", click: (e)=> {this.showSpecifications('Infrastructure')}},
                        {label: "Library/Utility", click: (e)=> {this.showSpecifications('Library')}},
                        {label: "Information Model", click: (e)=> {this.showSpecifications('IM')}},
                        {label: "Business Logic", click: (e)=> {this.showSpecifications('BusinessLogic')}},
                        {label: "User Interface", click: (e)=> {this.showSpecifications('UI')}},
                        {label: "External Tasks", click: (e)=> {this.showSpecifications('External')}},
                        {label: "Refactoring", click: (e)=> {this.showSpecifications('Refactoring')}}
                    ]
                }, {
                    index: 3,
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
            })
        })
    }
}

