# Projectus

A holistic project management system for software development.

## Basic concept
A software project is more than just code in a 
repository.  It involves planning, cooordination, financing,
technology, testing, and management.
Projectus aims to pull all of these aspects together into a 
single piece of tracking software.  It starts with defining
a concept, building the concept into requirements, the requirements
into APIs and the APIs into code and tests. Along the way 
there are business objectives: securing funding; marketing and
distribution plans and goals, release schedules, etc.  These
too can be tracked in Projectus.
Such work is customarily done with a variety of tools
including project boards (Jira, Trello, Backlog) and with
code planning tools (UML designers, etc.) and/or code framework
templates.  Projectus pulls in features from each of these, but
doesn't try to replace them, necessarily.
The key point of Projectus is to frame the dependencies and track
the reconciliation of these dependencies through tests.
From this status one can prioritize the next steps and chart
the work ahead more clearly.  Projectus is meant as the tool
that "builds the project and reports the outcome" so that
other project planning tools can step in with their features to
help complete the missing elements.

## Project data structure
A project has a root data structure that refers
to the various sections of the project
This is a heirarchy where dependent child sections
are referenced within thier parent.  
There may be cases of a shared dependency.
The data persists on AWS S3.  Each project is
given a bucket.  Each section is an object in that
bucket. (or maybe all in one object to start)

References are by S3 identifiers.

## Heirarchy
The section heirarchy will be something like this:

#### Project
- Name, author, copyright
- Repository
- Website
- Other legal or reference attachments
- Feature sections
    - Each feature section defines a concept
    
- Configuration
    - Plugins for binding to associated tools, like VCS repositories and Project trackers
    - Plugins for language bindings   
    
- buttons to run npm scripts     


- logging output option 
- general dashboard

- process related to tests that records key screenshots
for the brochure view
- brochure view rendered as readme
- link to dev notes


#### Concept
- Description
    - Document
- Use cases
    - Follow UML declaration
    - Output UML diagrams
- Functional Requirements
    - Should follow a standardized form
    - Should encourage recursive deconstruction
    - Should be able to be reduced to an API definition
 - Tests    
    
#### API definition
   - Language independent.
   - State Driven variants available.
   - Clearly state the functional objectives, parameters, and returns
   - Real-World value constraints
   
#### API generation
   - auto-generated from definition
   - targeted to selected language
   - outputs empty stub function in source file.
   - creates basic parameter/return test (which should work with stub)
   
#### Tests
   - Test of feature, coded by developer
   - Reconciliation expects a test for each feature
   - Integration tests, running a scenario of features,
   not required by reconciliation
   
#### Reconciliation
   - Walks dependency tree and tests each dependency
   - Reports missing or failing components
   - Uses repository info to check for modified files
   and primary / latest author and can create project tracker
   tickets.      
   
#### How this sits on disk
The executable ultimately runs globally (local to this while we bootstrap, though)
It can be hooked into normal project build hooks or repository action hooks.
the projectus root data file is kept at the repository root
(`projectus.json`)   
        
#### Building it
Start with the reconciler.  It will load the project
and begin testing sections, passing off to lower-level
heirarchial checks as it goes.        