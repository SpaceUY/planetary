import ora from "ora";
import chalk from "chalk";
import * as fs from "fs-extra";
import * as path from "path";

import { REPOSITORY } from "..";

/**
 * Clone the repository for the chosen module and implementation, via the GitHub API.
 * @param {string} moduleName - The name of the module to clone from the boilerplate repository.
 * @param {string} pathInRepository - The path in the repository to clone elements from.
 * @param {string} destination - The destination path to clone the repository to.
 * @param {string} branch ? - The branch to clone from.
 * */
export const cloneRepository = async (
  moduleName: string,
  pathInRepository: string,
  destination: string,
  branch?: string
): Promise<void> => {
  try {
    await downloadDirectory(destination, pathInRepository, branch);
    console.log(
      chalk.green(`✓ Successfully downloaded ${moduleName} template`)
    );
  } catch (error: any) {
    console.error(
      chalk.red(`✗ Failed to download ${moduleName} template: ${error.message}`)
    );
  }
};

// Recursively download directory contents
async function downloadDirectory(
  destination: string,
  currentPath?: string,
  branch?: string
): Promise<void> {
  const spinner = ora(`Downloading ${currentPath ?? "root"}...`).start();

  branch = branch ? `?ref=${branch}` : "";

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPOSITORY}/contents/${currentPath}${branch}`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );
    const data = await response.json();

    spinner.succeed(
      `Downloaded directory listing for ${currentPath ?? "root"}`
    );

    // Ensure the destination directory exists
    await fs.ensureDir(destination);

    // Process each item (file or directory)
    for (const item of data) {
      const destPath = path.join(destination, item.name);

      if (item.type === "dir") {
        // If it's a directory, recursively download its contents
        await downloadDirectory(destPath, item.path);
      } else if (item.type === "file") {
        // If it's a file, download and save it
        const fileSpinner = ora(`Downloading ${item.path}...`).start();
        try {
          const fileResponse = await fetch(item.download_url);
          const arrayBuffer = await fileResponse.arrayBuffer();
          await fs.writeFile(destPath, Buffer.from(arrayBuffer));
          fileSpinner.succeed(`Downloaded ${item.path}`);
        } catch (error: any) {
          fileSpinner.fail(`Failed to download ${item.path}: ${error.message}`);
        }
      }
    }
  } catch (error: any) {
    spinner.fail(
      `Failed to download ${currentPath ?? "root"}: ${error.message}`
    );
    throw error;
  }
}
