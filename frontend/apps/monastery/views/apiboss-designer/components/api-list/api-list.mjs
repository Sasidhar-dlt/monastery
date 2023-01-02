
/**
 * A component to hold and display a list of items.
 * Item format is {id, img, label}. 
 * 
 * Value attribute returns or expects an array of items in the format
 * listed above.
 *  
 * (C) 2020 TekMonks. All rights reserved.
 * License: See enclosed LICENSE file.
 */
import { i18n } from "./api-list.i18n.mjs";
import { util } from "/framework/js/util.mjs";
import { i18n as i18nFramework } from "/framework/js/i18n.mjs";
import { monkshu_component } from "/framework/js/monkshu_component.mjs";
import { loader } from "../../../../js/loader.mjs";


const COMPONENT_PATH = util.getModulePath(import.meta);



async function elementConnected(element) {
    Object.defineProperty(element, "value", {
        get: _ => JSON.stringify(api_list.getData(element.id).items),
        set: value => {
            const newData = api_list.getData(element.id); newData.items = _addClickHandlerToItems(JSON.parse(value), element.getAttribute("onclickHandler"));
            api_list.bindData(newData, element.id)
        }
    });
    const data = {
        items: _addClickHandlerToItems(JSON.parse(element.getAttribute("value") || await window.monkshu_env['ITEMS'].getItemList(element.parentElement.parentElement) ? await window.monkshu_env['ITEMS'].getItemList(element.parentElement.parentElement) : "[]"), element.getAttribute("onclickHandler")),
        styleBody: element.getAttribute("styleBody") ? `<style>${element.getAttribute("styleBody")}</style>` : undefined,
        label: element.getAttribute("label") || i18n.DefaultLabel[i18nFramework.getSessionLang()]
    }
    api_list.setDataByHost(element, data);
}

async function elementRendered(element) {
const items = Array.from(api_list.getShadowRootByHostId(element.id).querySelector("div#container").children)[0].style.background = "#F8FCFF";
console.log(items);
}

function _addClickHandlerToItems(items, onclick) {
    if (!onclick) return;
    for (const item of items) item.onclick = onclick;
    return items;
}
async function openClicked(element, elementid) {
   let thisElement = api_list.getHostElementByID("packages");
    await loader.beforeLoading(); _disableButton(thisElement.parentElement.parentElement)
    const containerArray = Array.from(element.parentElement.children);
    for(let i=0;i<containerArray.length;i++){
        if(element.id == containerArray[i].id){
            containerArray[i].style.background = "#F8FCFF"
        } else containerArray[i].style.background = "none"
    }
  window.monkshu_env.components["api-contents"].bindApiContents(elementid);
  window.monkshu_env.components["api-details"].updateExposedpathandMethod(elementid);
  window.monkshu_env.components["apiinput-apioutput"].bindApiInputOutputParameters(elementid);
  window.monkshu_env.components["text-editor"].updateResponseData();
  await loader.afterLoading(); _enableButton(thisElement.parentElement.parentElement);
// setTimeout(()=>{loader.afterLoading(); _enableButton(thisElement.parentElement.parentElement);}, 500);

}

function _disableButton(element){ element.style["pointer-events"]="none"; element.style["opacity"]=0.4; }
function _enableButton(element){ element.style["pointer-events"]=""; element.style["opacity"]=""; }

export const api_list = { trueWebComponentMode: true, elementConnected,elementRendered, openClicked };
monkshu_component.register("api-list", `${COMPONENT_PATH}/api-list.html`, api_list);