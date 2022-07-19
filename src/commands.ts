import { readdirSync } from "fs";
import * as vscode from "vscode";

import {
  createBlocOrCubit,
  createCoreFiles,
  createLocalizationsFiles,
  createMain,
  createPubspec,
  friendlyText,
} from "./createFiles";
import { createFolders, fixedPath, getProjectPath, showMessage } from "./utils";

export async function initApp() {
  createFolders([
    "assets",
    "assets/animations",
    "assets/sounds",
    "assets/image",
    "assets/fonts",
    "assets/icons",
    "lib/core",
    "lib/core/errors",
    "lib/core/routes",
    "lib/core/strings",
    "lib/core/theme",
    "lib/core/theme/cubit",
    "lib/core/ui",
    "lib/core/ui/layouts",
    "lib/core/ui/pages",
    "lib/core/ui/widgets",
    "lib/core/utils",
    "lib/features",
  ]);

  createPubspec();
  createMain();
  createCoreFiles();

  showMessage("init successfully");
}

export function enableLocalization() {
  createLocalizationsFiles();
}

export function newPage() {
  throw new Error("Function not implemented.");
}

export function newFeature() {
  vscode.window
    .showInputBox({ placeHolder: `new Feature name` })
    .then((featureName) => {
      if (featureName !== "") {
        featureName = friendlyText(featureName!);
        const featurePath = "lib/features";
        createFolders([
          featurePath,
          `${featurePath}/${featureName}`,
          `${featurePath}/${featureName}/data`,
          `${featurePath}/${featureName}/data/model`,
          `${featurePath}/${featureName}/data/datasources`,
          `${featurePath}/${featureName}/data/repositories`,
          `${featurePath}/${featureName}/domain`,
          `${featurePath}/${featureName}/domain/entities`,
          `${featurePath}/${featureName}/domain/usecases`,
          `${featurePath}/${featureName}/domain/repositories`,
          `${featurePath}/${featureName}/presentation`,
          `${featurePath}/${featureName}/presentation/pages`,
          `${featurePath}/${featureName}/presentation/widgets`,
        ]);
        createBlocOrCubit(featureName);
      } else {
        showMessage("please enter name");
        newFeature();
      }
    });
}

export function addAuth() {
  throw new Error("Function not implemented.");
}

export function initFirebase() {
  throw new Error("Function not implemented.");
}

export function tst() {}

export function newBloc() {
  vscode.window
    .showInputBox({ placeHolder: `new bloc or cubit name` })
    .then((featureName) => {
      if (featureName !== "") {
        featureName = friendlyText(featureName!);
        vscode.window
          .showQuickPick(
            readdirSync(fixedPath(`${getProjectPath()}/lib/features`)),
            {
              canPickMany: false,
              placeHolder: "which feature want add the bloc?",
            }
          )
          .then((name) => {
            if (name !== undefined) {
              createBlocOrCubit(featureName!, name);
            } else {
              showMessage("please select feature");
              newBloc();
            }
          });
      } else {
        showMessage("please enter name");
        newBloc();
      }
    });
}
