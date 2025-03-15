import ora from "ora";
import chalk from "chalk";
import * as fs from "fs-extra";
import * as path from "path";

// ================================================

import { type AvailableModule } from "../configs/available-modules";
import { REPOSITORY, REPOSITORY_PATH } from "../configs/repository";

export const cloneRepository = async (
  module: AvailableModule,
  implementation: string,
  destination: string
) => {
  // TODO: Include `implementation`
  const repoPath = REPOSITORY_PATH[module];
  downloadDirectory(destination, repoPath);
};

// Recursively download directory contents
async function downloadDirectory(
  destination: string,
  currentPath?: string
): Promise<void> {
  const spinner = ora(`Downloading ${currentPath ?? "root"}...`).start();

  try {
    const response = await fetch(
      `https://api.github.com/repos/${REPOSITORY}/contents/${currentPath}`,
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
