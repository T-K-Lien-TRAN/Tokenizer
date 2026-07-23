import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const deploymentDirectory = resolve(scriptDirectory, "..");
const sourceContract = resolve(deploymentDirectory, "../code/TokenizerToken.sol");
const hardhatContract = resolve(
  deploymentDirectory,
  "contracts/TokenizerToken.sol",
);

await mkdir(dirname(hardhatContract), { recursive: true });

const source = await readFile(sourceContract, "utf8");
const current = await readFile(hardhatContract, "utf8").catch(() => null);

if (current !== source) {
  await copyFile(sourceContract, hardhatContract);
  console.log("Synchronized code/TokenizerToken.sol into deployment/contracts/.");
} else {
  console.log("Contract copy is already synchronized.");
}
