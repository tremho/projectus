# Riot Reboot

###### 8/30/2020
Decided to use Riot for the UI.
Did some experimenting in app-riot project and
settled on a scheme that should work here.

###### Presentation layer and appCore (one process)
- create an appCore (Presentation) class that holds the communication
methods and the full app presentation model
- also holds higher-level state info
- components reflect app elements to display
- component logic handles UX concerns (p-layer)
- calls into appCore via `props.app` to access
business logic. also registers listener callbacks.
- later, appCore could pass off to other processes
using IPC / RPC (like in an Electron host scenario or web services)

####### takeaways
- Presentation layer is in the browser process
- FS access (for example) is not found there, so
we need to use IPC to the back end for that.

#### Setting up

- [X] Create Riot framework
    -  npm install riot
    - don't do npm init riot because we're bringing it together ourselves

- [X] install node dependencies
    - npm install @riotjs/compiler @riotjs/ssr @riotjs/webpack-loader --save-dev 
    - npm install chai esm jsdom jsdom-global mocha nyc --save-dev
    - npm install webpack webpack-cli webpack-dev-server --save-dev
    - npm install typescript --save-dev
    
- [X] configure webpack
- [X] setup scripts
- [X] Build hello, world display
- [X] create Presentation core class
- [X] export via props and verify on display
- [x] set up Electron
- [X] replicate sanity test status
- [X] migrate main.js to typescript and build setup
- [ ] devise build cycle hooks
    - before compile
    - compile
    - before bundling
    - bundling
    - after bundling
    - before launch
    - launch
    - launchQuit
- [ ] Devise and run unit tests    
- [ ] Create component - to - app messaging
- [ ] synchronous and callback examples
- [ ] call into server side (Electron's Node process)
#### Desiging first parts of app

##### Top Level Info

##### First feature work
After initial meta work, create the first feature
of Projectus which is the build/test cycle we
just created.  
Make sure each element and component is designed
and has tests and those tests are passing.
Make sure the tests reflect the spec.
Generate docs and make sure the docs reflect the spec.
 
    