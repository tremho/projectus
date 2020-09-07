## Lessons from early test code

#### How to use riot as a UI solution

##### Parts in the structure

1. appMain and exported props 
2. Presentation core class
3. global components registered at start

#### Looking at the tree

The tree control does these things:

- uses the expandable node as its root render
and recursively instatiates itself in to the
child slot for subsequent items.

- The gist of the tree rendering is via expandable-node

###### What is a component?
Riot associates the custom tag with the exported code in the `<script>`
section.  Think of this like a scoped mini-module.  
The `export default {` section hosts the lifecycle methods and
`onBeforeMount()` is called like an initializer.

at the raw level of export default, which is the component object,
the component will define:
- props
- state
- root
- mount/unmount functions for this component
- update function
- shouldUpdate function
- onBeforeMount(), onMounted(), onBeforeUpdate(), onUpdated(), onBeforeUnmount, onUnmounted()
- $ and $$ to find dom elements within component scope

------

- the `root` value is available at all lifecycle points
- from a DOM element we can use this method to find the named
containing component: 
```js
        function getComponent(el) {
          while(el.tagName !== 'TEST-LABEL') {
            el = el.parentElement
          }
          const syms = Object.getOwnPropertySymbols(el)
          console.log('symbols ', syms)
          const comp = el[syms[0]]
          // const comp = el.Symbol('riot-component')
          console.log('found component', comp)
          return comp
        }
```
and we can get the tag name with `root.tagName` at the start
so we can have easy access between dom elements and components
without having to create our own mapping like we did with tree.

###### Using riot mixins 

Define:
```
riot.mixin('mixClassName', {
    method: (parm) => {
    },
    anotherMethod: (parm1, parm2) => {
    },
    property: 'string',
    anotherProp: 42
})   
```
apply to component in onBeforeMount()
```js
this.mixin('mixClassName')
```
and then the component will have all of these properties.
I imagine one could mix in `props` and `state` values too, but you'd need
to do that before applying any other settings, and they
probably would not combine. use namespaces if commuting such matters.


###### Formalizing further with TS and Sass

See [Riot docs on preprocessor support](https://riot.js.org/compiler/#pre-processors)
where it looks like we can write our riot code in Typescript
and leverage styles from SCSS.

not sure there's much of point there, except maybe the scss bit

###### On the subject of styles
We must maintain a classic CSS scope for the page for class definitions.
I would say use SASS for that, for all the normal reasons.

Within the components, we use `<style>` statements that refer
locally.  These can be overriden by class changes.
we can define class attributes as well.

#### See the construction of test-label.riot that puts all this together.

- [X] Now migrate tree-view to use this same approach

Now in a doc called [TreeDesign](Tree Design.md), detail the feature
for Projectus for the different views of the project.