
import * as path from 'path'
import * as fs from 'fs'

export function projectDiscovery(rootPath) {

    if(!rootPath) rootPath = __dirname
    console.log("discovering from root path = ", rootPath)

    // assign score of one point per piece of evidence. This may help aid disambigutions later.
    let techScores = {
        electron: 0,
        nativescript: 0,
        npm: 0,
        riot: 0,
        sass: 0,
        typescript: 0,
        webpack: 0,
    }
    let fwScores = {
        nativescriptCore: 0,
        nativescriptAngular: 0,
        nativescriptVue: 0,
        nativescriptPluginSeed: 0,
        thunderBoltProject: 0,
    }
    // it is a Deverit project if it has project/concept.dvt
    const isDeverit = (fs.existsSync(path.join(rootPath, 'project', 'concept.dvt')))
    // it may be npm if it has a package.json file
    let packageJson;
    const pkgPath = path.join(rootPath, 'package.json')
    if(fs.existsSync(pkgPath)) {
        techScores.npm++
        const contents = fs.readFileSync(pkgPath).toString()
        if(contents) {
            try {
                packageJson = JSON.parse(contents)
                techScores.npm++;
            } catch(e) {
                console.error('invalid package.json: ', e)
            }
        }
    }
    const allFiles = getAllFiles(rootPath)
    // it may be a riot app if it has .riot or .tag files in the tree / riot is in package dependencies
    if(countMatches(allFiles, /\.riot$/)) techScores.riot++
    if(countMatches(allFiles, /\.tag$/)) techScores.riot++
    if(packageJson && packageJson.dependencies.riot) techScores.riot++;
    if(packageJson && packageJson.devDependencies["@riotjs/compiler"]) techScores.riot++;

    // it may be a webpack app if there is a webpack.config.js file / webpack found in dependencies
    if(fs.existsSync(path.join(rootPath, 'webpack.config.js'))) techScores.webpack++
    if(packageJson && packageJson.dependencies.webpack) techScores.webpack++;

    // it may be typescript if there is a tsconfig.json file or .ts files in the tree / typescript, ts-loader in devDependencies
    if(countMatches(allFiles, /\.tsx?$/)) techScores.typescript++
    if(fs.existsSync(path.join(rootPath, 'tsconfig.json'))) techScores.typescript++
    if(packageJson && packageJson.devDependencies.typescript) techScores.typescript++
    if(packageJson && packageJson.devDependencies['ts-loader']) techScores.typescript++

    // it may support sass if there are .scss files in the tree / sass is in devDependencies
    if(countMatches(allFiles, /\.scss$/)) techScores.sass++
    if(packageJson && packageJson.devDependencies.sass) techScores.sass++

    // it may be Electron if package.json dependencies include electron.
    if(packageJson && packageJson.devDependencies.electron) techScores.electron++

    // it presents as a 'ThunderBolt' Framework app if there is an electronMain that looks right
    const tbelPath = path.join(rootPath, 'electronMain', 'package.json')
    let electronPackageJson
    if(fs.existsSync(tbelPath)) {
        const contents = fs.readFileSync(tbelPath).toString()
        if(contents) {
            try {
                electronPackageJson = JSON.parse(contents)
                fwScores.thunderBoltProject++;
            } catch(e) {
                console.error('invalid electronMain package.json: ', e)
            }
        }
    }
    if(techScores.npm && techScores.riot) { // must be riot and npm to be thunderbolt.  now just check for Electron
        if (electronPackageJson && electronPackageJson.devDependencies.electron) {
            fwScores.thunderBoltProject++
            techScores.electron++ // mark as an electron tech even though it's a sub folder scope in thunderbolt.
        }
        if (packageJson && packageJson.scripts.start.indexOf('electronMain') !== -1) fwScores.thunderBoltProject++
    }


    const topLevelInfo = {
        devTechTypes: [],
        projectFramework: '',
        projectName: '',
        projectVersion: '',
        projectDescription: '',


    }
    Object.getOwnPropertyNames(techScores).forEach(name => {
        if(techScores[name]) topLevelInfo.devTechTypes.push(name);
    })

    if(techScores.npm) {
        topLevelInfo.projectName = packageJson.name;
        topLevelInfo.projectVersion = packageJson.version;
        topLevelInfo.projectDescription = packageJson.description;
    }
    if(fwScores.thunderBoltProject) {
        topLevelInfo.projectFramework = 'ThunderBolt'
    }

    return topLevelInfo;
}

/**
 * Recursively iterates at the given directory path and returns an array of all file paths within the scope.
 * @param dirPath
 * @param arrayOfFiles
 */
export function getAllFiles(dirPath:string, arrayOfFiles:string[] = []) {
    const files = fs.readdirSync(dirPath)

    files.forEach(function(file) {
        if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
            arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(dirPath, file))
        }
    })
    return arrayOfFiles
}

function countMatches(array:string[], match:RegExp | string) {
    let count = 0;
    array.forEach(str => {
        if(str.match(match)) count++
    })
    return count
}
