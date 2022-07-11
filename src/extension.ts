import * as vscode from "vscode";
import * as commands from "./commands";
import { subscribe } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  subscribe(context, "newFeature", commands.newFeature);
}

export function deactivate() {}
