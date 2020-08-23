"use strict";
/*
Index.js Main file for Projectus

Determine the root we are reading from

Detect this as an NPM-style project (it has a package.json with key fields we can use)
Read the projectus.json file
if it doesn't exist, ask questions to create it with
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FS = __importStar(require("fs"));
var Path = __importStar(require("path"));
var ReadLine = __importStar(require("readline"));
// @ts-ignore
var Git = __importStar(require("git-utils"));
var rl = ReadLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
console.log("Hello, World");
var npminfo = null;
var projectus = null;
function readNPM() {
    if (FS.existsSync('./package.json')) {
        try {
            npminfo = FS.readFileSync('./package.json').toJSON();
        }
        catch (e) {
        }
    }
}
function query(question, defaultAnswer) {
    return new Promise(function (resolve) {
        var prompt = question + '  [' + defaultAnswer + ']';
        rl.question(prompt, function (answer) {
            if (answer == '')
                answer = defaultAnswer;
            resolve(answer);
        });
    });
}
// We will use the NPM information for our top-level metadata, if provided
// if it's not there, we'll create it.
readNPM();
if (!npminfo)
    npminfo = {};
// let's get our current pathname.  We can guess a project name from that, maybe.
var cwd = process.cwd();
var projName = npminfo.name || Path.basename(cwd);
// let's get git info from here and establish our repo madness
var repository = Git.open(cwd);
if (!repository) {
    console.log("New project, not attached to Git");
    console.log("");
    console.log("go to your github space and create a new repository (without files)");
    console.log('return to this directory');
    console.log("type git init");
    console.log("setup .gitignore with anything you don't want shared");
    console.log("type git add .");
    console.log('type git commit -m"initial commit"');
    process.exit(1);
}
// fill in missing npminfo
console.log('repository info', repository);
var repoOwner = 'tremho';
// name, version, description, keywords
if (!npminfo.version)
    npminfo.version = "1.0.0";
if (!npminfo.name) {
    query('Name of your project?', projName).then(function (ans) {
        npminfo.name = ans;
    });
}
if (!npminfo.description) {
    query('Describe this project', '').then(function (ans) {
        npminfo.name = ans;
    });
}
// homepage (default to repository readme [https://github.com/owner/project#readme])
if (!npminfo.homepage) {
    npminfo.homepage = 'https://github.com/' + repoOwner + ("/" + projName + "#readme");
}
// bugs (default to repository issues [https://github.com/owner/project/issues])
if (!npminfo.bugs) {
    npminfo.bugs = 'https://github.com/' + repoOwner + ("/" + projName + "/issues");
}
// License (SPDX explorer / chooser)
// repository (fill in with discovered git info)
// all other npm fields are left as is and it's up to npm package developers to edit package.json to suit
// dependencies and devDependencies, peerDependencies and optionalDependencies should not be copied to projectus.
console.log("Welcome to projectus.\nLet's gather some information about this project.");
query('Project Name', npminfo && npminfo.name).then(function (answer) {
    projectus.name = answer;
});
if (!FS.existsSync('./projectus.json')) {
    projectus = {
        npminfo: npminfo
    };
}
console.log(projectus);
