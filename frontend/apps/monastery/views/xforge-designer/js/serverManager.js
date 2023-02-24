/** 
 * Manages all communication with Rules server.
 * (C) 2020 TekMonks. All rights reserved.
 * License: See enclosed LICENSE file.
 */
import { APP_CONSTANTS } from "../../../js/constants.mjs";
import { apimanager as apiman } from "/framework/js/apimanager.mjs";
import { session } from "/framework/js/session.mjs";
import {model} from "../model/model.mjs";
import {loader} from "../../../js/loader.mjs";

const API_KEYS = { "*": "jfiouf90iejw9ri32fewji910idj2fkvjdskljkeqjf" }, KEY_HEADER = "org_monkshu_apikey";
const org = new String(session.get(APP_CONSTANTS.USERORG)).toLowerCase(), userid = new String(session.get(APP_CONSTANTS.USERID)).toLowerCase();
/**
 * Returns the list of models present on the server
 * @param {string} server Server IP or Hostname
 * @param {string||number} port Server port
 * @param {string} adminid Server admin login ID
 * @param {string} adminpassword Server admin password
 * @returns {result: true|false, models: [array of model names on success], err: Error text on failure, raw_err: Raw error, key: Error i18n key}
 */
async function getModelList(server, port, adminid, adminpassword) {
    const API_ADMIN_URL_FRAGMENT = `://${server}:${port}/apps/monkruls/admin`;

    const loginResult = await loginToServer(server, port, adminid, adminpassword);
    if (!loginResult.result) return loginResult;    // failed to connect or login

    try {   // try to get the list now
        const result = await apiman.rest(loginResult.scheme + API_ADMIN_URL_FRAGMENT, "POST",
            { op: "list" }, true);
        return {
            result: result.result, models: result.result ? result.list : null, err: "List fetch failed at the server",
            raw_err: "Model list fetch failed at the server", key: "ModelListServerIssue"
        };
    } catch (err) { return { result: false, err: "Server connection issue", raw_err: err, key: "ConnectIssue" } }
}

/**
 * Returns the given model as an object
 * @param {string} name The model name
 * @param {string} server Server IP or Hostname
 * @param {string||number} port Server port
 * @param {string} adminid Server admin login ID
 * @param {string} adminpassword Server admin password
 * @returns {result: true|false, model: Model object on success, err: Error text on failure, raw_err: Raw error, key: Error i18n key}
 */
async function getMetaData(name, server, port, adminid, adminpassword) {

    const loginResult = await loginToServer(server, port, adminid, adminpassword);
    console.log(loginResult);
    if (!loginResult.result) return loginResult;    // failed to connect or login
    apiman.registerAPIKeys({ "*": "fheiwu98237hjief8923ydewjidw834284hwqdnejwr79389" }, "X-API-Key");

    try {   // try to read the model now
        const result = await apiman.rest(APP_CONSTANTS.API_GETMETADATA, "POST", { org, name, id: userid, server, port }, true, true);
        console.log(result);
        return {
            result: result.result, model: result.result ? result.data : null, err: "Metadata read failed at the server",
            name: result.result ? result.name : null, raw_err: "Metadata read failed at the server", key: "MetaDataReadServerIssue"
        };
    } catch (err) { return { result: false, err: "Server connection issue", raw_err: err, key: "ConnectIssue" } }
}

/**
 * Unpublishes the given model at the server (deletes it)
 * @param {string} name The model name
 * @param {string} server Server IP or Hostname
 * @param {string||number} port Server port
 * @param {string} adminid Server admin login ID
 * @param {string} adminpassword Server admin password
 * @returns {result: true|false, err: Error text on failure, raw_err: Raw error, key: Error i18n key}
 */
async function unpublishModel(name, server, port, adminid, adminpassword) {
    const API_ADMIN_URL_FRAGMENT = `://${server}:${port}/apps/monkruls/admin`;

    const loginResult = await loginToServer(server, port, adminid, adminpassword);
    if (!loginResult.result) return loginResult;    // failed to connect or login

    try {   // try to delete
        const result = await apiman.rest(loginResult.scheme + API_ADMIN_URL_FRAGMENT, "POST",
            { op: "delete", name }, true);
        return {
            result: result.result, err: "Mode unpublish failed at the server",
            raw_err: "Model unpublish failed at the server", key: "ModelUnpublishServerIssue"
        };
    } catch (err) { return { result: false, err: "Server connection issue", raw_err: err, key: "ConnectIssue" } }
}

/**
 * Publishes the given model to the server
 * @param {object} model The model to publish or update
 * @param {string} name The name for the model
 * @param {string} server Server IP or Hostname
 * @param {string||number} port Server port
 * @param {string} adminid Server admin login ID
 * @param {string} adminpassword Server admin password
 * @returns {result: true|false, err: Error text on failure, raw_err: Raw error, key: Error i18n key}
 */
async function publishModel(parsedData, server, port, adminid, adminpassword) {
    const loginResult = await loginToServer(server, port, adminid, adminpassword);
    console.log(loginResult);

    if (!loginResult.result) return loginResult;    // failed to connect or login
    try {   // try to publish now
        return {
            result: (await apiman.rest(`http://${server}:${port}/apps/monastery/createxforgemeta`, "POST",
                { data: parsedData }, true, true)).result, err: "Publishing failed at the server",
            raw_err: "Publishing failed at the server", key: "PublishServerIssue"
        };
    } catch (err) { return { result: false, err: "Server connection issue", raw_err: err, key: "ConnectIssue" } }
}

async function publishMetaData(metaData, org, userid, server, port) {
    apiman.registerAPIKeys({ "*": "fheiwu98237hjief8923ydewjidw834284hwqdnejwr79389" }, "X-API-Key");

    try {   // try to publish now
        return {
            result: (await apiman.rest(`http://${server}:${port}/apps/monastery/createxforgemeta`, "POST",
                { metadata: metaData, org, id: userid, server, port }, false, true)).result, err: "Publishing failed at the server",
            raw_err: "Publishing failed at the server", key: "PublishServerIssue"
        };
    } catch (err) { return { result: false, err: "Server connection issue", raw_err: err, key: "ConnectIssue" } }
}

async function runScript() {
    await loader.beforeLoading();
    apiman.registerAPIKeys({ "*": "fheiwu98237hjief8923ydewjidw834284hwqdnejwr79389" }, "X-API-Key");
    const finalData = model.getModel();
    const name = finalData.scripts[0].result;
    console.log(name);


    try {   // try to publish now
                const result= await apiman.rest( APP_CONSTANTS.API_RUNSCRIPT, "POST", {name}, false, true);
                console.log(result);
                await loader.afterLoading();
       }
     catch (err) { await loader.afterLoading();return { result: false, err: "Server connection issue", raw_err: err, key: "ConnectIssue" } }
}




async function publishScripts(scriptData, org, userid, server, port) {
    apiman.registerAPIKeys({ "*": "fheiwu98237hjief8923ydewjidw834284hwqdnejwr79389" }, "X-API-Key");
    try {
        let count = 0, result;
        for (let script of scriptData) {
            console.log(script);
            const b64Data = btoa(script[1]);
            result = await apiman.rest(`http://${server}:${port}/apps/monastery/publishscripts`, "POST", { name: script[0], data: b64Data, org, id: userid, server, port },false,true);
            console.log(result);
            if (typeof result == "string") result = JSON.parse(result);
            count = result.result ? ++count : count;
        }
        if (count == scriptData.length) return { result: true };
        if (!result.result) return { result: result.result, key: "PublishModFailed" };
        return { result: false, key: "PublishModFailed" }
    }
    catch (err) {
        return { result: false, err: "Server connection issue", raw_err: err, key: "ConnectIssue" }
    }
}

async function loginToServer(server, port, adminid, adminpassword) {
    apiman.registerAPIKeys(API_KEYS, KEY_HEADER);

    const API_LOGIN_SECURE = `https://${server}:${port}/apps/apiboss/admin/login`;
    const API_LOGIN_INSECURE = `http://${server}:${port}/apps/apiboss/admin/login`;

    try {   // try secure first
        const result = await apiman.rest(API_LOGIN_SECURE, "POST", { id: adminid, pw: adminpassword, op: "login" }, false, true);
        if (result.result) return { result: true, scheme: "https" };
        else throw `Server secure login failed, trying insecure, ${await i18n.get(SecureConnectFailed)}`;
    } catch (err) {    // try insecure else give up
        try {
            LOG.debug(err);
            const result = await apiman.rest(API_LOGIN_INSECURE, "POST", { id: adminid, pw: adminpassword, op: "login" }, false, true);
            if (result.result) return { result: true, scheme: "http" };
            else return { result: false, err: "Login failed at the server", raw_err: "Login failed at the server", key: "LoginIssue" };
        } catch (err) { return { result: false, err: "Server connection issue", raw_err: err, key: "ConnectIssue" } }
    }
}
export const serverManager = { publishModel, unpublishModel, getModelList, getMetaData, publishMetaData, loginToServer, publishScripts,runScript};