import chalk from "chalk";

// ================================================

import { chooseModule } from "./utils/choose-module";
import { chooseImplementation } from "./utils/choose-module-implementation";
import { cloneRepository } from "./utils/clone-repository";

import { getAvailableModules } from "../../utils/get-modules";
import { PlanetaryOptions } from "../planetary";
import {
  printSuccessMessage,
  printWelcomeMessage,
} from "../../utils/shared-prints";
import { COMMANDS } from "../../utils/commands";

export const REPOSITORY = "SpaceUY/NestJS-Template";

/**
 * Add a NestJS module to a project.
 * @param {PlanetaryOptions} options - The options for the command.
 */
export const addNestModule = async (
  options: PlanetaryOptions,
  skipWelcome: boolean = false
): Promise<void> => {
  if (!skipWelcome) await printWelcomeMessage(COMMANDS.NEST);

  // Wait for 200ms to ensure the box is printed
  await new Promise((res) => setTimeout(res, 200));

  try {
    const availableModules = await getAvailableModules(REPOSITORY, options.branch);
    const moduleConfig = await chooseModule(availableModules, options.module);

    const implementations = moduleConfig.implementations;
    const implementation = await chooseImplementation(
      moduleConfig.name,
      implementations
    );

    const { path: implPath, name: implName } = implementation;

    let pathInRepository = "";

    if (implPath === "") {
      pathInRepository = `${moduleConfig.path}`;
    } else {
      pathInRepository = `${moduleConfig.path}/${implPath ?? implName}`;
    }

    await cloneRepository(
      moduleConfig.name,
      pathInRepository,
      options.destination,
      options.branch
    );

    await printSuccessMessage(moduleConfig.name);
  } catch (error: any) {
    console.error(chalk.red("Error copying NestJS module:"), error.message);
  }
};
