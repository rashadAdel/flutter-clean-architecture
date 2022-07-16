import path = require("path");
import { createCoreFiles, createMain, createPubspec } from "./functions";
import { createFolders } from "./utils";

export function newFeature() {
  createFolders([path.join("lib", "core", "util.dart")]);
}
export function newModel() {
  throw new Error("Function not implemented.");
}

export function initApp() {
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
    "lib/core/ui/screens",
    "lib/core/ui/widgets",
    "lib/core/utils",
    "lib/features",
  ]);

  createPubspec();
  createMain();
  createCoreFiles();
}

export function newPage() {
  throw new Error("Function not implemented.");
}

export function addAuth() {
  throw new Error("Function not implemented.");
}

export function initFirebase() {
  throw new Error("Function not implemented.");
}

export function enableLocalization() {
  throw new Error("Function not implemented.");
}
