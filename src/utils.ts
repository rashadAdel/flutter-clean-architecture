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
  return oldPath.replace("/", path.sep).replace("\\", path.sep);
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

export function betweenBrackets(text: string, searchText: string): string {
  const start = text.indexOf(searchText);
  const openBracket = searchText[searchText.length - 1];
  var closeBracket;
  switch (openBracket) {
    case "(":
      closeBracket = ")";
      break;
    case "[":
      closeBracket = "]";
      break;
    case "{":
      closeBracket = "}";
      break;
  }
  var openBrackets = [];
  var closeBrackets = [];
  for (let index = start; index < text.length; index++) {
    if (text[index] === openBracket) {
      openBrackets.push(index);
    } else if (text[index] === closeBracket) {
      closeBrackets.push(index);
      if (openBrackets.length === closeBrackets.length) {
        return text.substring(start, index + 1);
      }
    }
  }
  return "";
}

export async function editFile(
  filePath: string,
  searchText: string,
  replaceText: string
) {
  const fullPath: string = path.join(getProjectPath(), fixedPath(filePath));
  const readData = fs.readFileSync(fullPath, "utf-8");
  if (readData.indexOf(replaceText) >= 0) {
    showError(`${filePath} file its already modified`);
  } else {
    const newData: string = readData.replace(searchText, replaceText);
    writeFile(filePath, newData);
  }
}

export function terminalCommend(comment: string) {
  var term1 = vscode.window.createTerminal("clean_code");
  term1.show();
  term1.sendText(comment);
  term1.dispose();
}
