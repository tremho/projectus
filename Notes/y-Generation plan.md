## Generation of testable assets from Objectives

So we have our milestones in place, and each milestone names objectives.
Each objective breaks down into collected statements about what actions need
to occur, and what the outcome is.  This is results in a classic UML
use case statement which which can later diagram if we so wish.

The developer is interrogated per each use case to turn this action into
a corresponding API declaration.
Coming out of this questioning we will have the
- package
- api name
- description of action
- outcome description

from this, the developer is asked to provide
- api function name
- module or class this API belongs to
- if its a class, which module does the class belong to (if not already associated)
- parameters of the function
    - including constraint definitions
- return type of the function
    - including constraint definitions
    
Once we have all of this, we can generate
- modules and classes
- functions / methods with empty bodies and stub return
    - validation throws on type/constraint fail by default
    
- spec files that 
    - test for type / result validation (stubs will pass)
    - test for outcomes (stubs will fail -- needs edit)    

Optionally, tools that help illustrate or work through the action
description -- like sequence diagrams -- might be helpful additions.
These don't change the testable content, but may be useful in adding
to documentation. Possibly could inform a generated test, but that's uncertain.    

[Conceptual Diagram of this arrangement](Use%20Case%20&%20API%20Generation%20.png)

    