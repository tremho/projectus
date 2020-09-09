
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



