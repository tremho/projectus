
####  9/6
to this point, I've put together a pretty decent set of framework parts
and I have the basic component stuff in place to support layouts, etc.

Starting to do actual project component work, and it's clear there are
some prerequisites I need first:

- Need to construct a drop down arbitrary panel
- Need to construct a checklist that is either radio or multi
- Support fa-icons gracefully, including using an image instead.



- Need to construct a model and a binding relationship to the components.
- Need to design the model with some forethought
- Need a mechanism to provide project type support

### 9/7 
Did some work on the model binding and it's working pretty good.
Still need to consolidate the code in bind-test.riot and make
some common callpoints, but hey - it's working.

Leaving undecided the question of decoupling via event and/or timeout pool.
Let's let the situation develop before we try to solve it.

##### Evening update -
- binding code cleaned up and boilerplated, better syntax.
- so, do I do the dropdown UI work now, or do I work on plugin actions?

other stuff:

- set up watchers for tsc, sass, and webpack and create a browser-based dev mode
- Thinking of changing the name to 'Deverity' or 'Deveritas' or 'Deveritable'

9/8
It's hot today.
Anyway, have IPC layer to back end working, and calling FileSystem
methods there.

The model is supplying all the values to the UI, and these are being
set by the callers into the Discovery module on the back end.

Have a hard-coded path for project in there now.
For our 'we are our own project' scenario, we can pass in something
discovered locally (hard-coded, but relative)

We should enable the menu and add a file/open action to point us
at a different project to evaluate.  Maybe do discovery for a few more types.

Invoke modules per framework.  These will in turn invoke modules per
tech, and use common features of tech stack within framework context.

We should also set up the tree, and put TLInfo at the top.  We can
put TL detail info in the info panel, and also any build actions.
We're going to want to expose scripts as buttons for npm projects, we
can put these there (scrollable toolbar at top of panel?)

But I'm already ahead of myself.  We need to stick to the bootstrap.
Next step is to parse the dvt files and record a set of features with
objectives, components, and code entries.
Also use to populate TLInfo and reference tree.

Need to create an issue collector and log the console errors and
warnings we are currently emitting to there instead, so we can
display it in an appropriate app window.

I also think I'm deconstructing the elements of the project wrongly,
or at least for this project.
Maybe categories first: Infrastructure, UI, Library, Tools 
and then put goals into each category as you go,
as in 'Infrastructure: create model binding', 'Library: Localization support',
'Tools: Component Generator', 'UI: main screen sections, Menu'

This might also help define how to create tests for said things.

9/10 

- created document for [Generic Project Breakdown](Notes/x-Generic%20Project%20Breakdown.md)
to capture some structural ideas to address some of the thinking above.

9/12

- My split-panel is working decently. Some minor complaints about capture, but
it works okay and is flexible.

- Need to start populating screens with some information.  
We've parsed the Deveritae file, but all we really get from it are
console warnings and errors (or presumably a lack thereof).

- Creating a log recorder is part of our next steps.

- More completely, we also need to record the status of the features.
We have a FeatureInfo as part of the dvt parse, but we need to extend
this to a model-ready record and populate an array of these records
for each of the asserted features.

- In our immediate case, each feature is incomplete and has log errors
of missing files.

- Basic info  concept tree top, in basic readme form.
    - some summary stats, too, like % passing tests, dev stage, etc.
- Objectives = devSteps, with status.  
- Specifications => TK, template starts generated from Objectives,
and then broken into sections:
    - UML
    - API with constraints and test expectations.
    - UI component concept description and sketch
- This generates test code which runs and is reported at basic info

- Basic info should be Project Info and it should feature PM / Issue Tracking
and milestone status as well.  
    - Use this to verify sprint completion criteria
    - Tie in to 3rd party tools.
    - Collect Milestone info in Concept.dvt

At some point, dvt editing is needed instead of hacking at text files.
