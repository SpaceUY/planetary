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
import { getAvailableModules } from "../../utils/get-modules";
import path from "path";

export const REPOSITORY = "SpaceUY/react-registry";

/**
 * Add a React module to a project.
 * @param {PlanetaryOptions} options - The options for the command.
 */
export const addReactModule = async (
  options: PlanetaryOptions,
  skipWelcome: boolean = false
): Promise<void> => {
  if (!skipWelcome) await printWelcomeMessage(COMMANDS.REACT);

  try {
    const availableModules = await getAvailableModules(REPOSITORY, options.branch);
    const moduleConfig = await chooseModule(availableModules, options.module);

    const implementations = moduleConfig.implementations;
    const implementation = await chooseImplementation(
      moduleConfig.name,
      implementations
    );

    options.destination = await chooseDestination(options.destination);

    const { path: implPath, name: implName } = implementation;
    
    let pathInRepository = "";

    if (implPath === "") {
      pathInRepository = `${moduleConfig.path}`;
    } else {
      pathInRepository = `${moduleConfig.path}/${implPath ?? implName}`;
    }

    await cloneRepository(
      REPOSITORY,
      moduleConfig.name,
      pathInRepository,
      options.destination,
      options.branch
    );

    await printSuccessMessage(moduleConfig.name, implementation);
  } catch (error: any) {
    console.error(chalk.red("Error copying React module:"), error.message);
  }
}; 