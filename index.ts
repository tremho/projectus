
/*
Index.js Main file for Projectus

Determine the root we are reading from

Detect this as an NPM-style project (it has a package.json with key fields we can use)
Read the projectus.json file
if it doesn't exist, ask questions to create it with
 */

import * as FS from 'fs';
import * as Path from 'path';
import * as ReadLine from 'readline';
// @ts-ignore
import * as Git from 'git-utils';

const rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log("Hello, World")

let npminfo:any = null
let projectus:any = null

function readNPM(): void {
    if (FS.existsSync('./package.json')) {
        try {
            npminfo = FS.readFileSync('./package.json').toJSON()
        } catch (e) {
        }

    }
}

function query(question: string, defaultAnswer: string) : Promise<string> {
    return new Promise(resolve => {
        let prompt = question + '  ['+defaultAnswer+']'
        rl.question(prompt, answer => {
            if(answer == '') answer = defaultAnswer;
            resolve(answer)
        })
    })
}

// We will use the NPM information for our top-level metadata, if provided
// if it's not there, we'll create it.
readNPM()
if(!npminfo) npminfo = {}

// let's get our current pathname.  We can guess a project name from that, maybe.
let cwd = process.cwd();
let projName = npminfo.name || Path.basename(cwd)
// let's get git info from here and establish our repo madness
const repository = Git.open(cwd)
if(!repository) {
    console.log("New project, not attached to Git")
    console.log("")
    console.log("go to your github space and create a new repository (without files)")
    console.log('return to this directory')
    console.log("type git init")
    console.log("setup .gitignore with anything you don't want shared")
    console.log("type git add .")
    console.log('type git commit -m"initial commit"')
    process.exit(1)
}
// fill in missing npminfo

console.log('repository info', repository)

let repoOwner = 'tremho'

// name, version, description, keywords
if (!npminfo.version) npminfo.version = "1.0.0";
if(!npminfo.name) {
    query('Name of your project?', projName).then(ans => {
        npminfo.name = ans;
    })
}
if (!npminfo.description) {
    query('Describe this project', '').then(ans => {
        npminfo.name = ans;
    })
}
// homepage (default to repository readme [https://github.com/owner/project#readme])
if(!npminfo.homepage) {
    npminfo.homepage = 'https://github.com/'+repoOwner + `/${projName}#readme`
}
// bugs (default to repository issues [https://github.com/owner/project/issues])
if(!npminfo.bugs) {
    npminfo.bugs = 'https://github.com/'+repoOwner + `/${projName}/issues`
}
// License (SPDX explorer / chooser)
// repository (fill in with discovered git info)
// all other npm fields are left as is and it's up to npm package developers to edit package.json to suit
// dependencies and devDependencies, peerDependencies and optionalDependencies should not be copied to projectus.


console.log("Welcome to projectus.\nLet's gather some information about this project.");
query('Project Name', npminfo && npminfo.name).then(answer => {
    projectus.name = answer
})

if (!FS.existsSync('./projectus.json')) {
    projectus = {
        npminfo
    }

}
console.log(projectus)
