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
    try {
      fs.mkdirSync(fixedPath(completePath), { recursive: true });
    } catch (error) {
      showError("error while create folder " + dir);
    }
  });
}

export function fixedPath(oldPath: string): string {
  return oldPath.replaceAll("/", path.sep).replaceAll("\\", path.sep);
}

export function writeFile(filePath: string, content: string) {
  try {
    fs.writeFileSync(path.join(getProjectPath(), fixedPath(filePath)), content);
  } catch (err) {
    showError(`error while write file ${filePath}`);
    console.log(err);
  }
}

export function getProjectPath(): string {
  return vscode.workspace.workspaceFolders![0].uri.fsPath;
}

export function getProjectName() {
  return vscode.workspace.workspaceFolders![0].name;
}

export function showMessage(message: string) {
  vscode.window.showInformationMessage(message);
}
export function showError(message: string) {
  vscode.window.showErrorMessage(message);
}

export async function editFile(
  filePath: string,
  searchText: string,
  replaceAllText: string
) {
  const fullPath: string = path.join(getProjectPath(), fixedPath(filePath));
  const readData = fs.readFileSync(fullPath, "utf-8");
  if (readData.indexOf(replaceAllText) >= 0) {
    showError(`${filePath} file its already modified`);
  } else {
    const newData: string = readData.replaceAll(searchText, replaceAllText);
    writeFile(filePath, newData);
  }
}

export function terminalCommend(comment: string) {
  var term1 = vscode.window.createTerminal("clean_code");
  term1.show();
  term1.sendText(comment);
  term1.dispose();
}
