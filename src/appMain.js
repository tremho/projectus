
import * as riot from 'riot'
import App from './scratch-app.riot'
import Presentation from './presentationCore/Presentation'
import registerGlobalComponents from './register-global-components'

// register
registerGlobalComponents()

console.log('Running under Riot', riot.version)

// mount all the global components found in this page
riot.mount('[data-riot-component]')
const mountApp = riot.component(App)
const coreApp = new Presentation()
console.log('appName=',coreApp.appName)
const app = mountApp( document.getElementById('root'), { app: coreApp } )
