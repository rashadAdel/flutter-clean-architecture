import path = require("path");
import { makeFolders } from "./utils";

export function newFeature() {
  makeFolders([path.join("lib", "core", "util.dart")]);
}
