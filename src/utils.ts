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

export function createFolders([...paths]: string[]) {
  const projectPath = getProjectPath();
  paths.forEach((dir) => {
    const completePath = path.join(projectPath, dir);
    fs.mkdir(fixedPath(completePath), { recursive: true }, (err) => {
      if (err) {
        throw err;
      }
    });
  });
}

function fixedPath(oldPath: string): string {
  return oldPath.replace("/", path.sep).replace("\\", path.sep);
}

export function writeFile(filePath: string, content: string) {
  fs.writeFile(
    path.join(getProjectPath(), fixedPath(filePath)),
    content,
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
}

export function getProjectPath(): string {
  return vscode.workspace.workspaceFolders![0].uri.fsPath;
}

export function getProjectName() {
  return vscode.workspace.workspaceFolders![0].name;
}
