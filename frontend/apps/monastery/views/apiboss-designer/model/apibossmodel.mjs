/** 
 * Model file for API400 application.
 * (C) 2022 TekMonks. All rights reserved.
 * License: See enclosed LICENSE file.
 */
import { algos } from "./algos.mjs";
import { util } from "/framework/js/util.mjs";
import { blackboard } from "/framework/js/blackboard.mjs";

const EMPTY_MODEL = { apicl: [] }, DEFAULT_BUNDLE = "commands";
let apibossmodelObj = EMPTY_MODEL, idCache = {}, current_command_bundle = DEFAULT_BUNDLE;
const MSG_NODES_MODIFIED = "NODES_MODIFIED", MSG_CONNECTORS_MODIFIED = "CONNECTORS_MODIFIED",
    MSG_NODE_DESCRIPTION_CHANGED = "NODE_DESCRIPTION_CHANGED", MSG_ARE_NODES_CONNECTABLE = "ARE_NODES_CONNECTABLE",
    MSG_GET_MODEL = "GET_MODEL", MSG_RESET = "RESET", MSG_LOAD_MODEL = "LOAD_MODEL",
    MSG_CONNECT_NODES = "CONNECT_NODES", MSG_ADD_NODE = "ADD_NODE";

function init() {
     console.log("init");
    blackboard.registerListener(MSG_NODES_MODIFIED, message => modelNodesModified(message.type, message.nodeName,
        message.id, message.properties), true);
    blackboard.registerListener(MSG_CONNECTORS_MODIFIED, message =>{console.log(message); modelConnectorsModified(message.type,
        message.sourceNode, message.targetNode, message.sourceID, message.targetID)});
    blackboard.registerListener(MSG_NODE_DESCRIPTION_CHANGED, message => nodeDescriptionChanged(message.nodeName,
        message.id, message.description));
    blackboard.registerListener(MSG_ARE_NODES_CONNECTABLE, message => isConnectable(message.sourceName,
        message.targetName, message.sourceID, message.targetID), true);
    blackboard.registerListener(MSG_GET_MODEL, message => getModelAsFile(message.name), true);
    blackboard.registerListener(MSG_RESET, _ => { apibossmodelObj = EMPTY_MODEL, idCache = {}, current_command_bundle = DEFAULT_BUNDLE; }, true);
    blackboard.registerListener(MSG_LOAD_MODEL, message => loadModel(message.data));
}

function loadModel(jsonModel) {
console.log(jsonModel);
    try {
        apibossmodelObj = JSON.parse(jsonModel);
        console.log(apibossmodelObj);
    }
    catch (err) { LOG.error(`Bad API400 model, error ${err}, skipping.`); return; }
    if (!(apibossmodelObj.apicl)) { LOG.error(`Bad API400 model, not in right format.`); return; }

    // first add all the commands
    for (const apicl of apibossmodelObj.apicl) for (const command of apicl.commands) {
        const id = command.id || _getUniqueID(); idCache[id] = command; const clone = util.clone(command);
        const nodeName = clone.nodeName;
        blackboard.broadcastMessage(MSG_ADD_NODE, { nodeName, id, description: clone.description, properties: { ...clone }, connectable: true });
    }


    const connectNodes = (sourceID, targetID) => {
        if ((!idCache[sourceID]) || (!idCache[targetID])) { LOG.error(`Bad dependency in the model ${sourceID}, skipping.`); return; }
        const sourceName = idCache[sourceID].nodeName, targetName = idCache[targetID].nodeName;
        blackboard.broadcastMessage(MSG_CONNECT_NODES, { sourceName, targetName, sourceID, targetID });
    }
    console.log(apibossmodelObj);
    // add connections between commands
    for (const command of apibossmodelObj.apicl[0].commands)
        if (command.dependencies) for (const dependency of command.dependencies) connectNodes(dependency, command.id);

}

function modelNodesModified(type, nodeName, id, properties) {

    if (type == apibossmodel.ADDED) return _nodeAdded(nodeName, id, properties);
    if (type == apibossmodel.REMOVED) return _nodeRemoved(nodeName, id);
    if (type == apibossmodel.MODIFIED) return _nodeModified(nodeName, id, properties);

    return false;   // unknown modification
}

function modelConnectorsModified(type, sourceName, targetName, sourceID, targetID) {
console.log(type);

    if ((!idCache[sourceID]) || (!idCache[targetID])) return;   // not connected

    const addOrRemoveDependencies = (sourceNode, targetNode, type) => {

        if (type == apibossmodel.ADDED) {
            if (!targetNode.dependencies) targetNode.dependencies = [];
            targetNode.dependencies.push(sourceNode.id);
        } else if (type == apibossmodel.REMOVED && targetNode) {
            const dependencies = targetNode.dependencies;
            if ((!dependencies) || (!dependencies.length) || dependencies.indexOf(sourceNode.id) == -1) return;
            else _arrayDelete(dependencies, sourceNode.id);
            if (dependencies.length == 0) delete targetNode.dependencies;    // no longer required
        }
    }

    addOrRemoveDependencies(idCache[sourceID], idCache[targetID], type);    // also visually connect the nodes  
}

function isConnectable(sourceName, targetName, sourceID, targetID) {    // are these nodes connectable
    if (sourceID == targetID) return false;
    if (targetName == "policy_tag") return false;
    if(sourceName == targetName ) return false;

    return true;
}

function nodeDescriptionChanged(_nodeName, id, description) {

    if (!idCache[id]) return;

    const oldNameTracksDescription = _getNameFromDescription(idCache[id].description) == idCache[id].name;
    if (idCache[id].name && oldNameTracksDescription) {
        idCache[id].name = _getNameFromDescription(description); idCache[id].description = description;
    } else idCache[id].description = description;

}

function getModel() {
    const retModel = util.clone(apibossmodelObj);
    console.log(retModel);
    const sortedCommands = algos.sortDependencies(retModel.apicl[0]);  // sort apicl commands in the order of dependencies
    const NOPparams = saveCordinates(sortedCommands);
    let APICL = algos.convertIntoAPICL(sortedCommands); // converting into the final APICL
    const NOPcommand = `NOP PARAMS(${JSON.stringify({ "CORDINATES": NOPparams })})`;
    const lastCommand = APICL[Object.keys(APICL).length ]
    if(lastCommand.includes("ENDAPI")){
    APICL[Object.keys(APICL).length ] = NOPcommand;
    APICL[Object.keys(APICL).length +1 ] = lastCommand;
    return APICL;
    }
    else{
        APICL[Object.keys(APICL).length +1 ] =  NOPcommand;
    return APICL;
    }

}

function saveCordinates(modelObject) {
    let visitedNodes = [], cordinates = [];
    modelObject.forEach(node => {
        if (!visitedNodes.includes(node.id)) {
            const cordinate = { "description": node["description"], "x": node["x"] ? node["x"] : 30, "y": node["y"] ? node["y"] : 30 };
            visitedNodes.push(node.id);
            cordinates.push(cordinate);
        }
    })
    return cordinates;
}

function getModules() {
    const api400 = util.clone(apibossmodelObj);
    let nameAndJsArray = []
    for (const command of api400.apicl[0].commands) {
        let nameAndJs = [];
        if (command.nodeName == "mod") {
            nameAndJs.push(command.modulename ? command.modulename : '');
            nameAndJs.push(command.code);
            nameAndJsArray.push(nameAndJs)
        }

    }
    return nameAndJsArray;
}

const getModelAsFile = name => { return { data: JSON.stringify(getModel(), null, 4), mime: "application/json", filename: `${name || "api400api"}.apicl` } }

const _getUniqueID = _ => `${Date.now()}${Math.random() * 100}`;

function _findOrCreateCommand(name = current_command_bundle, forceNew) {
    if (!forceNew) for (const command of apibossmodelObj.apicl) if (command.name == name) return command;
    const newCommand = { name, commands: [], id: _getUniqueID() };
    apibossmodelObj.apicl.push(newCommand);
    return newCommand;
}

function _nodeAdded(nodeName, id, properties) {
     console.log(nodeName);
    const node = idCache[id] ? idCache[id] : JSON.parse(JSON.stringify(properties)); node.nodeName = nodeName;
    if (idCache[id]) { _nodeModified(nodeName, id, properties); return; }  // node properties modified
    const name = _getNameFromDescription(node.description);

    if (nodeName == "api" || nodeName == "policy_tag") {
        node.name = name;
        _findOrCreateCommand().commands.push(node);
    }

    node.id = id; idCache[id] = node;   // transfer ID and cache the node
    console.log(idCache);
    return true;
}

function _nodeRemoved(nodeName, id) {
    if (idCache && Object.keys(idCache).length === 0) apibossmodelObj = { apicl: [] };
    if (!idCache[id]) return;   // we don't know of this node
    const node = idCache[id];

    const nextTargetNode = algos.checkNodeInAllNodes(node, apibossmodelObj.apicl[0].commands);
    if (nextTargetNode) modelConnectorsModified(apibossmodel.REMOVED, nodeName, nextTargetNode.nodeName, id, nextTargetNode.id);
    if (nodeName == "api" || nodeName == "policy_tag")
        _arrayDelete(apibossmodelObj.apicl[0].commands, node);

    delete idCache[id]; // uncache
    return true;
}

function _nodeModified(nodeName, id, properties) {
console.log(properties);
console.log(idCache);
    let parameters = [];
    if (!idCache[id]) return false; // we don't know of this node
    for (const key in properties) { // transfer the new properties
        // listbox is used for the commands which are having the dynamic elements
        if (key.includes("listbox") && (nodeName == "strapi" || nodeName == "sndapimsg" || nodeName == "call" || nodeName == "runsqlprc" ||
            nodeName == "map" || nodeName == "scrread" || nodeName == "scrkeys")) {
            if (properties[key] != '') { parameters = properties[key]; }
        } else idCache[id][key] = properties[key];
    }

    if (parameters && parameters.length != 0) { idCache[id].listbox = parameters; }

    return true;
}

const _arrayDelete = (array, element) => {
    if (array.includes(element)) array.splice(array.indexOf(element), 1); return element;
}

const _getNameFromDescription = description => description.split(" ")[0].split("\n")[0];

export const apibossmodel = {
    init, loadModel, modelNodesModified, modelConnectorsModified, isConnectable,
    nodeDescriptionChanged, getModelAsFile, getModel, getModules, ADDED: "added", REMOVED: "removed", MODIFIED: "modified"
};