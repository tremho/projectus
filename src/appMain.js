
import * as riot from 'riot'
import App from './app.riot'
import AppCore from './app-core/AppCore'
import registerGlobalComponents from './register-global-components'

// register
registerGlobalComponents()

console.log('Running under Riot', riot.version)

// mount all the global components found in this page
riot.mount('[data-riot-component]')
const mountApp = riot.component(App)
const coreApp = new AppCore()

let app;
coreApp.discovery().then(() => {
  app = mountApp( document.getElementById('root'), { app: coreApp } )

})


