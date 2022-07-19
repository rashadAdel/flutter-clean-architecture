import { readdirSync } from "fs";
import * as vscode from "vscode";

import {
  capitalizeName,
  createBlocOrCubit,
  createCoreFiles,
  createLocalizationsFiles,
  createMain,
  createPubspec,
  friendlyText,
  transformUrlName,
} from "./createFiles";
import {
  createFolders,
  editFile,
  fixedPath,
  getProjectPath,
  showMessage,
  writeFile,
} from "./utils";

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
  var pageName: string;
  vscode.window
    .showInputBox({
      placeHolder: "new page name",
    })
    .then((name) => {
      if (name !== undefined && name !== "") {
        pageName = name;
        if (pageName.toLowerCase().indexOf("page") < 0) {
          pageName = pageName + " page";
        }
        pageName = friendlyText(pageName!);
        const listOfFeatures = readdirSync(
          fixedPath(`${getProjectPath()}/lib/features`)
        );
        listOfFeatures.push("core");
        vscode.window
          .showQuickPick(listOfFeatures, {
            canPickMany: false,
            placeHolder: "which feature want add the page?",
          })
          .then((featureName) => {
            if (featureName !== undefined) {
              //create page
              const pathPage =
                featureName === "core"
                  ? `lib/core/ui/pages/${pageName}.dart`
                  : `lib/features/${featureName}/presentation/pages/${pageName}.dart`;
              const content = `import 'package:flutter/material.dart';
                class ${capitalizeName(pageName)} extends StatelessWidget {
                  const ${capitalizeName(
                    pageName
                  )}({Key? key}) : super(key: key);
                
                  @override
                  Widget build(BuildContext context) {
                    return Container();
                  }
                }`;
              writeFile(pathPage, content);

              //add in appRoutes
              editFile(
                `lib/core/strings/app_routes.dart`,
                "class AppRoutes {",
                `class AppRoutes {
          static const  ${pageName.toUpperCase()}= '/${transformUrlName(
                  pageName.toUpperCase()
                ).replaceAll("-PAGE", "")}';`
              );

              //add in app_page
              editFile(
                "lib/core/routes/app_pages.dart",
                "switch (routeSettings.name) {",
                `switch (routeSettings.name) {
                case AppRoutes.${pageName.toUpperCase()}:
                  return MaterialPageRoute(builder: (_) => const ${capitalizeName(
                    pageName
                  )}());
              `
              );
              var importRelativePath: string;
              if (featureName === "core") {
                importRelativePath = `import '../ui/pages/${pageName}.dart';`;
              } else {
                importRelativePath = `import '../../features/${featureName}/presentation/pages/${pageName}.dart';`;
              }
              //import
              editFile(
                "lib/core/routes/app_pages.dart",
                `import 'package:flutter/material.dart';`,
                `import 'package:flutter/material.dart';
                ${importRelativePath}
              `
              );
            } else {
              showMessage("please select feature");
              newPage();
            }
          });
      } else {
        showMessage("please enter page name");
        newPage();
      }
    });
}

export function newFeature() {
  vscode.window
    .showInputBox({ placeHolder: `new Feature name` })
    .then((featureName) => {
      if (featureName !== "" && featureName !== undefined) {
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
