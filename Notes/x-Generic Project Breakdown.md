(9/10/20)

## Breakdown of a project

In order to codify the creation of a project, we need to concretely 
identify what a project consists of, what makes up the tasks of these 
categories in the context of the framework structure, and how such tasks
are verified.

I'll assert here that a project is divided into different categories of
concern:

- Infrastructure / Framework integration
- Library and utility code
- Information Model
- Business Logic
- User Interface
- Tools and processes / External Tasks
- Refactoring efforts

**`Infrastructure`** 

This is the harness of your application.  It establishes the code and
data structure and flow.  Elements such as data binding, component construction
and layout, modularity isolation and communication paradigms, etc.
Unless you are designing a framework (and we are in this scope), most of 
infrastructure for your project will come from the framework you adopt.
However, you must still integrate these framework features into your app,
and it is useful to have some boilerplate proof-of-concept stub tests
in place before committing to additional pieces, so that debugging the
integration is out of the way before adding key elements.
THe framework APIs are bedrock and available as common library imports or
through other accessibility mechanisms.
Verification of Infrastructure is done through boilerplate or specific
tests that use stub code to prove a feature of the Framework is indeed
working as expected.  These stubs later migrate to specific for-purpose
cases, and the stubs can then be removed.

**`Library / Utility Code`**

Code modules that are used generally throughout the application fall into
this category.  This may be in the form of an externally packaged 
library, or custom code, or a combination.
Library code may be asserted at the start of project, but oftentimes
it comes from a realization that something can be shared between
modules to prevent repeated work and redundancies, and will often fall
into a task in Refactoring.
Each module presents its own API interface for use by the application.
Verification of library code is through conventionally styled unit testing
for each module.


**`Information Model`**

The IM is like a master State Machine of the application.  There are
differing approaches and strategies for the nature and implementation
of an information model, but at the end of the day this is 'what does
the app "know" at this moment?'.  Once a concept of business data is
arrived at, specifying its manifestation in the Information Model category 
of the app is necessary along with how this is accessed and manipulated 
by the business logic and UI layers. 
The Information Model generally has some form of manual or automatic
binding to the UI and Business Logic concerns.
The Information Model will have a Specification pattern that applies
to its construction, and an API that declares it.
Verification of the IM is through a mini-integration test per elemental section
that tests changes in the Business Logic echoed in the UI and vice-versa. 

**`Business Logic`**

This is the heart of the application: taking data from the information model
and manipulating it in some way to produce an interesting result.
For example, an app that predicts weather would take various sensor readings
from the Information Model, and crunch these with its algorithms, then
produce the results back to the Information Model where the UI can display them.
Business Logic is often separated to the "back-end" of a framework, separated
by a protocol-enforced API specification.
Verification is through a combination of unit tests for the module as 
well as the aforemenioned mini-integration testing.

**`User Interface`**

The framework used will provide some technology for creating a user interface.
Some components of the UI will come from framework or compatible libraries to 
provide functionality.  Other components will need to be custom created within
the framework for the app.
The UI technology will dictate how these components are constructed,
how they are tested, and how they are used in the application.
A UI Component will have a corresponding API specification.
Components may be grouped into libraries or collections.
Verification is through a combination of unit tests for the component as 
well as the aforementioned mini-integration testing.

**`Tools and Processes`**
These are of course necessary and integral, and not normally not thought
of as an explicit component of a project creation.
The integration of `Deveritae` into a project framework relies upon the
standards for the given technologies as used within the framework.
Custom tools and hooks are sometimes an element of project construction,
however.
These are not explicitly verified. There are considered effectively external
and can be controlled by a simple TO-DO checklist marking readiness.

**`External Tasks`**

Are things you need to do for the project that are not code/design based.
Like get a user account to a service, or secure a partnership, etc.
Like Custom Tools, these are self-acknowledged with a TODO Checklist.

**`Refactoring`**

Refactoring comes up often in the course of a normal project, and
by definition, this affects the state of items previously tracked.
A Refactoring task is carried out in stages:
1. Refactoring objective is named (e.g. "Add Localization to all Components")
and an identifier (e.g. RF-1234) is generated for this objective.
2. Each category affected by the refactor is given relevant objectives,
and each one references the id.  (e.g. "RF-1234: Create localization Module", "RF-1234: Create string tables", "RF-1234: Change component static text to use new loc() references")
3. When all (non-zero) of the tagged tasks are done, the Refactoring task is marked complete.

Verification is done in the distributed tasks, and thus implicit on completion.



