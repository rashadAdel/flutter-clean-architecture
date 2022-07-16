import * as vscode from "vscode";
import * as commands from "./commands";
import { subscribe } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  subscribe(context, "initApp", commands.initApp);
  subscribe(context, "newPage", commands.newPage);
  subscribe(context, "addAuth", commands.addAuth);
  subscribe(context, "newModel", commands.newModel);
  subscribe(context, "newFeature", commands.newFeature);
  subscribe(context, "initFirebase", commands.initFirebase);
  subscribe(context, "enableLocalization", commands.enableLocalization);
}

export function deactivate() {}
