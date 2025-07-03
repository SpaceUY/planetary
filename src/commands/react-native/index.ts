import {
  printSuccessMessage,
  printWelcomeMessage,
} from "../../utils/shared-prints";

import { COMMANDS } from "../../utils/commands";
import { PlanetaryOptions } from "../planetary";
import chalk from "chalk";
import { chooseDestination } from "../../utils/choose-destination";
import { chooseImplementation } from "../../utils/choose-module-implementation";
import { chooseModule } from "../../utils/choose-module";
import { cloneRepository } from "../../utils/clone-repository";
import fs from "fs-extra";
import path from "path";

export const REPOSITORY = "SpaceUY/ReactNative-Template";

/**
 * Get available modules from template repository
 */
const getAvailableModules = async (branch?: string) => {
  const branchQuery = branch ? `?ref=${branch}` : "";
  const response = await fetch(
    `https://api.github.com/repos/${REPOSITORY}/contents/planetary.json${branchQuery}`,
    { headers: { Accept: "application/vnd.github.v3+json" } }
  );

  if (!response.ok) {
    throw new Error(`GitHub API responded with status: ${response.status}`);
  }

  const data = await response.json();
  const content = Buffer.from(data.content, "base64").toString("utf-8");
  const config = JSON.parse(content);
  return config.modules;
};

/**
 * Add a React Native module to a project.
 * @param {PlanetaryOptions} options - The options for the command.
 */
export const addReactNativeModule = async (
  options: PlanetaryOptions,
  skipWelcome: boolean = false
): Promise<void> => {
  if (!skipWelcome) await printWelcomeMessage(COMMANDS.REACT_NATIVE);

  try {
    const availableModules = await getAvailableModules(options.branch);
    const moduleConfig = await chooseModule(availableModules, options.module);

    const implementations = moduleConfig.implementations;
    const implementation = await chooseImplementation(
      moduleConfig.name,
      implementations
    );

    options.destination = await chooseDestination(options.destination);

    const { path: implPath, name: implName } = implementation;
    const pathInRepository = path.join(moduleConfig.path, implPath ?? implName);

    await cloneRepository(
      REPOSITORY,
      moduleConfig.name,
      pathInRepository,
      options.destination,
      options.branch
    );

    await printSuccessMessage(implementation.name, implementation);
  } catch (error: any) {
    console.error(chalk.red("Error copying React Native module:"), error.message);
  }
}; 