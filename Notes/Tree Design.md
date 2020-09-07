# Projectus Tree Design

![visual concept](Projectus%20Overview.png)

## Projectus top view
- banner with title and summary info
- Note that the `Types` control is meant to be a drop down
multi-select that summaries the selections in a text line.

- Project name and version are editable, and this event
triggers project-wide update.

## Tree menu in left pane

- selecting a node or branch reveals detail about that selection
in the right pane.

- Concept is formalized into a set of features.  Each new feature
created here populates a new empty area under features.

Just the description is gathered in Concept.
The drilldown happens in the Feature section itself.  This is where
the concept turns into specification.

## action
Action is taken based upon the data.
for now, at least, trigger this with a button on the top
next to or just under `Status`.

Actions are influenced by the type and will report errors
if environment is not as expected for given type or if
an action fails in execution.

## Configuration
A `projectus.config` file is a JSON file that gives us flexibilty.
for example, for project type it will have a map for different
bits of injectable modules to handle each action phase for that
type.  

