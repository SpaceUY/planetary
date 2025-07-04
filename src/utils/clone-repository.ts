import * as fs from "fs-extra";
import * as path from "path";

import chalk from "chalk";
import ora from "ora";

/**
 * Clone the repository for the chosen module and implementation, via the GitHub API.
 * @param {string} repository - The GitHub repository to clone from (e.g. "SpaceUY/ReactNative-Template")
 * @param {string} moduleName - The name of the module to clone from the boilerplate repository.
 * @param {string} pathInRepository - The path in the repository to clone elements from.
 * @param {string} destination - The destination path to clone the repository to.
 * @param {string} branch ? - The branch to clone from.
 * @param {ModuleImplementationConfig} implementation ? - The implementation configuration.
 * */
export const cloneRepository = async (
  repository: string,
  moduleName: string,
  pathInRepository: string,
  destination: string,
  branch?: string
): Promise<void> => {
  try {
    await downloadDirectory(repository, destination, pathInRepository, branch);
    console.log(
      chalk.green(`✓ Successfully downloaded ${moduleName} template`)
    );
  } catch (error: any) {
    console.error(
      chalk.red(`✗ Failed to download ${moduleName} template: ${error.message}`)
    );
    throw error;
  }
};

// Recursively download directory contents
async function downloadDirectory(
  repository: string,
  destination: string,
  currentPath?: string,
  branch?: string
): Promise<void> {
  const spinner = ora(`Downloading ${currentPath ?? "root"}...`).start();

  const query = branch ? `?ref=${branch}` : "";

  try {
    const response = await fetch(
      `https://api.github.com/repos/${repository}/contents/${currentPath}${query}`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // Handle GitHub API error responses
    if ('message' in data) {
      throw new Error(`GitHub API error: ${data.message}`);
    }

    // Ensure data is an array
    if (!Array.isArray(data)) {
      throw new Error(`Expected directory listing, got ${typeof data}`);
    }

    spinner.succeed(
      `Downloaded directory listing for ${currentPath ?? "root"}`
    );

    // Check if destination exists and handle appropriately
    try {
      const stats = await fs.stat(destination);

      // If destination exists and is a file, throw an error
      if (stats.isFile()) {
        throw new Error(
          `Cannot create directory at ${chalk.cyan(destination)}: ` +
            `A file already exists at this location`
        );
      }

      // If it's a directory, we'll use it
      spinner.info(`Using existing directory at ${chalk.cyan(destination)}`);
    } catch (error: any) {
      // If error is ENOENT (doesn't exist), create the directory
      if (error.code === "ENOENT") {
        await fs.mkdir(destination, { recursive: true });
        spinner.info(`Created new directory at ${chalk.cyan(destination)}`);
      } else {
        // If it's any other error, throw it
        throw error;
      }
    }

    // Process each item (file or directory)
    for (const item of data) {
      const destPath = path.join(destination, item.name);

      if (item.type === "dir") {
        // If it's a directory, recursively download its contents
        await downloadDirectory(repository, destPath, item.path, branch);
      } else if (item.type === "file") {
        // If it's a file, download and save it
        const fileSpinner = ora(`Downloading ${item.path}...`).start();
        try {
          const fileResponse = await fetch(item.download_url);
          if (!fileResponse.ok) {
            throw new Error(`Failed to download file: ${fileResponse.status}`);
          }
          const arrayBuffer = await fileResponse.arrayBuffer();
          await fs.writeFile(destPath, Buffer.from(arrayBuffer));
          fileSpinner.succeed(`Downloaded ${item.path}`);
        } catch (error: any) {
          fileSpinner.fail(`Failed to download ${item.path}: ${error.message}`);
          throw error;
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
