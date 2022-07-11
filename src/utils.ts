import * as vscode from "vscode";
import { APP_NAME } from "./core/strings";
import fs = require("fs");
import path = require("path");

export function subscribe(
  context: vscode.ExtensionContext,
  name: string,
  fun: (...args: any[]) => any
) {
  let disposable = vscode.commands.registerCommand(`${APP_NAME}.${name}`, fun);
  context.subscriptions.push(disposable);
}

export function makeFolders([...paths]: string[]) {
  const projectPath = getProjectPath();
  paths.forEach((dir) => {
    const completePath = path.join(projectPath, dir);
    fs.mkdir(completePath, { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });
  });
}

export function writeFile(filePath: string, content: string) {
  fs.writeFile(path.join(getProjectPath(), filePath), content, (err) => {
    if (err) {
      throw err;
    }
  });
}

function getProjectPath(): string {
  return vscode.workspace.workspaceFolders![0].uri.fsPath;
}
