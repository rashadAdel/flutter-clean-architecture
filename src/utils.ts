import * as vscode from "vscode";
import { APP_NAME } from "./core/strings";

export function subscribe(
  context: vscode.ExtensionContext,
  name: string,
  fun: (...args: any[]) => any
) {
  let disposable = vscode.commands.registerCommand(`${APP_NAME}.${name}`, fun);
  context.subscriptions.push(disposable);
}
