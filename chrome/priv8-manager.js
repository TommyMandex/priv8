/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const {classes: Cc, interfaces: Ci, utils: Cu, results: Cr} = Components;

Cu.import("resource://gre/modules/Services.jsm");
Cu.import("chrome://priv8/content/modules/priv8-manager.jsm");

// Main object for the manager (it's just a proxy for the single page objects)
function Priv8Manager() {}

// Initializer
Priv8Manager.initialize = function() {
  let win = window.QueryInterface(Ci.nsIInterfaceRequestor)
                  .getInterface(Ci.nsIWebNavigation)
                  .QueryInterface(Ci.nsIDocShellTreeItem)
                  .rootTreeItem
                  .QueryInterface(Ci.nsIInterfaceRequestor)
                  .getInterface(Ci.nsIDOMWindow);

  try {
    win.document.documentElement.setAttribute("disablechrome", "true");
    document.documentElement.setAttribute("disablechrome", "true");
  } catch(e) {}

  // Emm... I want to be in the white-list :)
  try {
    win.top.XULBrowserWindow.inContentWhitelist.push('chrome://priv8/content/manager.xul');
  } catch(e) {}

  window.priv8ManagerData = new Priv8ManagerData(window, document);

  // Send a message about the loading completed
  Services.obs.notifyObservers(window, "Priv8-manager-loaded", "");
}

// Shutdown
Priv8Manager.shutdown = function() {
  if (!window.priv8ManagerData) {
    return;
  }

  window.priv8ManagerData.shutdown();
  window.priv8ManagerData = null;
}
