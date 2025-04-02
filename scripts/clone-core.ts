import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const dest = path.join(__dirname, "..", "fingerprints");
//only for inital package install
if (!fs.existsSync(dest)) {
  console.log("Cloning core logic into fingerprints/");
  execSync("git clone --depth=1 https://github.com/tzi-labs/whats-that-tech-core.git fingerprints", {
    stdio: "inherit",
    cwd: path.join(__dirname, "..")
  });
}