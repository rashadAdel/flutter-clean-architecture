import { readdirSync } from "fs";
import * as vscode from "vscode";

import {
  capitalizeName,
  createBlocOrCubit,
  createCoreFiles,
  createFeatureFiles,
  createLocalizationsFiles,
  createMain,
  createPubspec,
  friendlyText,
  inject,
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
    "assets/images",
    "assets/fonts",
    "assets/icons",
    "lib/shared",
    "lib/shared/configs",
    "lib/shared/errors",
    "lib/shared/routes",
    "lib/shared/constants",
    "lib/shared/injection",
    "lib/shared/extensions",
    "lib/shared/theme",
    "lib/shared/theme/cubit",
    "lib/shared/ui",
    "lib/shared/ui/layouts",
    "lib/shared/ui/pages",
    "lib/shared/ui/widgets",
    "lib/shared/utils",
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
        createFolders(["lib/features"]);
        const listOfFeatures = readdirSync(
          fixedPath(`${getProjectPath()}/lib/features`)
        );
        listOfFeatures.push("shared");
        vscode.window
          .showQuickPick(listOfFeatures, {
            canPickMany: false,
            placeHolder: "which feature want add the page?",
          })
          .then((featureName) => {
            if (featureName !== undefined) {
              //create page
              const pathPage =
                featureName === "shared"
                  ? `lib/shared/ui/pages/${pageName}.dart`
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

              const pageNameWithOutPageWord = pageName.replace("_page", "");
              //add in appRoutes
              editFile(
                `lib/shared/constants/app_routes.dart`,
                "class AppRoutes {",
                `class AppRoutes {
          static const  ${pageNameWithOutPageWord.toUpperCase()}= '/${transformUrlName(
                  pageNameWithOutPageWord.toUpperCase()
                )}';`
              );

              //add in app_page
              editFile(
                "lib/shared/routes/app_pages.dart",
                "switch (routeSettings.name) {",
                `switch (routeSettings.name) {
                case AppRoutes.${pageName
                  .toUpperCase()
                  .replaceAll("_PAGE", "")}:
                  return MaterialPageRoute(settings: routeSettings,builder: (_) => const ${capitalizeName(
                    pageName
                  )}());
              `
              );
              var importRelativePath: string;
              if (featureName === "shared") {
                importRelativePath = `import '../ui/pages/${pageName}.dart';`;
              } else {
                importRelativePath = `import '../../features/${featureName}/presentation/pages/${pageName}.dart';`;
              }
              //import
              editFile(
                "lib/shared/routes/app_pages.dart",
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
          `${featurePath}/${featureName}/helper`,
          `${featurePath}/${featureName}/helper/configs`,
          `${featurePath}/${featureName}/helper/constants`,
          `${featurePath}/${featureName}/helper/errors`,
          `${featurePath}/${featureName}/helper/extensions`,
          `${featurePath}/${featureName}/helper/injection`,
          `${featurePath}/${featureName}/helper/utils`,
        ]);
        createFeatureFiles(featureName);
        inject(featureName);
        createBlocOrCubit(featureName, featureName);
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
