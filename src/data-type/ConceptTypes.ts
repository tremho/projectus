/**
 * THe Collections in the model take this form
 */
export class UseCaseAssets {
    public actors: string[] = []
    public roles: string[] = []
    public packages: string[] = []
    public scenarios: UseCaseInfo[] = []
}

/**
 * Holds the elements of a Use Case Scenario
 * that can be rendered via UML.
 */
export class UseCaseInfo {
    public actor: string = ''
    public role: string = ''
    public pkg: string = ''
    public scenario: string = ''
    public outcome: string = ''
}

/**
 * Describes a relationship between component concepts
 */
export class ExchangeInfo {
    public name: string = ''
    public type: string = '' ; // type of data
    public direction: string = ''; // in, out or read,write
    public target: string = ''; // name of related component
}

/**
 * Holds description of component-level relationship of
 * component concepts and their modules
 */
export class ArchRelationshipInfo {
    public name: string = '' // name of this component concept
    public modules: string[]  = [] // modules that comprise this component
    public exchanges: ExchangeInfo[] = [] // exchanges with other component concepts
}

/**
 * Holds the UML generation materials
 */
export class UMLInfo {
    public useCases:UseCaseInfo[] = []
    public archRelations: ArchRelationshipInfo[] = []
    // tk: UML output products
}

/**
 * Status of asset generation and validation for each Api Declaration
 */
export class ApiReconciliation {
    public docStatus: string = '' // doc generation and InchJS report card
    public umlStatus: string = '' // diagram generation to be explored more.
    public testStatus: string = '' // spec generation and Instabul (nyc) report card.
}

/**
 * A Declaration of an API as parsed from a code file.
 * A new declaration may be added after parsing (including the case of a non-existing module)
 * which will have empty reconcilations and force new generation.
 */
export class ApiDeclaration {
    public pkg:string = ''
    public module:string = ''
    public type: string = '' // 'code' or 'ui'
    public class: string = ''
    public function: string = ''
    public reconciliation:ApiReconciliation = new ApiReconciliation()

}
/**
 * Class will use the declarations listed
 * (which generally come from the SpecificatonInfo modeling, but
 * can also be added seperately)
 * to generate code and test assets and to
 * produce a reconcile report that tells us if
 * we still have work to do or not
 * (are tests passing? have we touched it since the stubs?)
 */
export class ApiInfo {
    public declarations: ApiDeclaration[] = []
}

/**
 * Collection of information used to generate
 * formalized specification documentation,
 * and code and test stubs.
 */
export class SpecificationInfo {
    public uml: UMLInfo = new UMLInfo()
    public api: ApiInfo = new ApiInfo()
}

/**
 * Information about a single objective within a milestone
 */
export class ObjectiveInfo {
    public title:string = ''
    public specifications: SpecificationInfo = new SpecificationInfo()
}

/**
 * Time-boxed planned development objectives.
 * May be pre-planned deliverables or may be Sprint descriptions
 * Note that milestones can be added as development proceeds (e.g. as in an Agile scenario)
 */
export class MilestoneInfo {
    public name: string = ''
    public description: string = ''
    public targetDateStart: Date;
    public targetDateEnd: Date;
    public objectives: ObjectiveInfo[] = []
}

/**
 * High Level view of overall project
 */
export class ConceptInfo {
    public projectName:string = ''
    public devDescription:string = ''
    public tagLine:string = ''
    public elevatorPitch:string = ''
    public milestones: MilestoneInfo[] = []
}
