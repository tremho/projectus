
Projectus (or Deveritae) has different code modules that deal with
different project types.

Some project structures are combinations of project types.
For example, the Projectus project itself is an npm-based project
with a Riot app/component structure and an Electron back-end.

We can give this structure a name ('Thunderbolt') and treat it
as it's own type, but we can also do this as an aggregate that 
configures the other helper types while leaving these free to be used
in other aggregations or on their own.

Modules are in the `src/projModule` folder 

one of these modules is 'Discovery' and it it charged with determining
the type of project this is by examining the directory contents.
If a configuration file must be saved to simplify this in future
runs (required if there is any user-interrogation necessary), then
it should be named `deveritae.info` at the root. 

modules are loaded per project type (once determined)

Each module is tasked with performing actions, based on how that
project deals with the issue:

- read/write of Project Name
- read/write of Version Information
- export of code-importable data in a consistent way
- export of script actions to buttons
- standard actions for running verity tests.

Actions during development:

- Define a new feature

    - Features are in the `project` folder
    - top-level is `concept.dvt`
    - concept description lists components and code modules in 
    a formalized way.

- Create a component with test and docs
- Create a code module with tests and docs

- Assets created must reconcile to a slot in the feature concepts
- tests named in concept are stubbed as 'failing' until coded differently.
- tests that pass have the git hash of the file they represent recorded.
If test is older than code and If more than (n) lines of code (3) have changed in the source then the
test is considered out of date and flagged as such.



