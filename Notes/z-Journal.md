
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

