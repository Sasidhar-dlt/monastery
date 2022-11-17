/**
 * (C) 2022 TekMonks. All rights reserved.
 * License: See enclosed LICENSE file.
 */
import { util } from "/framework/js/util.mjs";
import { monkshu_component } from "/framework/js/monkshu_component.mjs";
import { dialog_box } from "../../../shared/components/dialog-box/dialog-box.mjs";

const COMPONENT_PATH = util.getModulePath(import.meta);
const DEFAULT_HOST_ID = "__org_monkshu_dialog_box";

const elementConnected = async (element) => {
  Object.defineProperty(element, "value", {
    get: (_) => _getValue(element),
    set: (value) => _setValue(value, element)
  });
  if(element.getAttribute("value")) _setValue(element.getAttribute("value"), element);
};

function _getValue(host) {
  const shadowRoot = dialog_box.getShadowRootByContainedElement(host);
  let value = "";
  if(shadowRoot.querySelector('input[name="scr"]:checked'))  value = shadowRoot.querySelector('input[name="scr"]:checked').value;
  return value;
}

function _setValue(value, host) {
  const data = {};
  if (value == "start") data.start = "checked";
  else if (value == "stop") data.stop = "checked";
  else if (value  == "release") data.release = "checked";
  radio_button.setData(host.id, data);
}

function check(element){
  const diloagBoxComponent = window.monkshu_env.components['dialog-box'];
  const shadowRoot = element instanceof Element ? diloagBoxComponent.getShadowRootByContainedElement(element) :
  diloagBoxComponent.getShadowRootByHostId(element || DEFAULT_HOST_ID);
  console.log(shadowRoot);
  console.log(shadowRoot.querySelector('#pool'));
  console.log(element.getAttribute("id"));

 if(element.getAttribute("id")!="start")  shadowRoot.querySelector('#pool').setAttribute("disabled","true");
 else shadowRoot.querySelector('#pool').removeAttribute("disabled");

}

export const radio_button = {
  trueWebComponentMode: false,
  elementConnected,check
};

monkshu_component.register(
  "radio-button",
  `${COMPONENT_PATH}/radio-button.html`,
  radio_button
);