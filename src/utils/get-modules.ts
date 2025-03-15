import ora from "ora";
import chalk from "chalk";

// ================================================
/**
 * Interface representing the structure of the planetary.json file
 */
interface PlanetaryConfig {
  modules: {
    [key: string]: {
      path: string;
      implementations: Array<{
        name: string;
        description: string;
      }>;
    };
  };
}

export interface ModuleImplementationConfig {
  name: string;
  description: string;
}

export interface ModuleConfig {
  name: string;
  path: string;
  implementations: ModuleImplementationConfig[];
}

/**
 * Fetches the planetary.json file from the repository and returns the available modules
 * @returns {Promise<Record<string, ModuleConfig>>} The available modules and their configurations
 */
export const getAvailableModules = async (
  repository: string
): Promise<Record<string, ModuleConfig>> => {
  const spinner = ora("Fetching available modules...").start();

  try {
    // Fetch the planetary.json file from the repository
    const response = await fetch(
      `https://api.github.com/repos/${repository}/contents/planetary.json`,
      { headers: { Accept: "application/vnd.github.v3+json" } }
    );

    if (!response.ok) {
      throw new Error(`GitHub API responded with status: ${response.status}`);
    }

    const data = await response.json();

    // GitHub API returns content as base64 encoded
    const content = Buffer.from(data.content, "base64").toString("utf-8");
    const config = JSON.parse(content) as PlanetaryConfig;

    spinner.succeed("Successfully fetched available modules");

    // Transform the modules into the expected format
    const availableModules: Record<string, ModuleConfig> = {};

    for (const [moduleName, moduleConfig] of Object.entries(config.modules)) {
      availableModules[moduleName] = {
        name: moduleName,
        path: moduleConfig.path,
        implementations: moduleConfig.implementations,
      };
    }

    return availableModules;
  } catch (error: any) {
    spinner.fail(`Failed to fetch available modules: ${error.message}`);
    console.error(chalk.red(`Error details: ${error.stack || error}`));
    return {};
  }
};
