import {
  printUnderConstructionMessage,
  printWelcomeMessage,
} from "../../utils/shared-prints";

import { addNestModule } from "../nest";
import { addReactNativeModule } from "../react-native";
import chalk from "chalk";
import inquirer from "inquirer";

export interface PlanetaryOptions {
  destination?: string;
  module?: string;
  branch?: string;
}

const AVAILABLE_APPS = {
  NEST: "NestJS",
  REACT: "React",
  REACT_NATIVE: "React Native",
  CONTRACTS: "Blockchain Contracts",
} as const;

/**
 * Add a component to an application, prompting the user for the type of application they are working with.
 * @param {PlanetaryOptions} options - The options for the command.
 */
export const addPlanetaryComponent = async (
  options: PlanetaryOptions
): Promise<void> => {
  await printWelcomeMessage();

  const appChoices = Object.values(AVAILABLE_APPS);

  const questions = [
    {
      type: "list",
      name: "app",
      message: "Which type of application are you working with?",
      choices: appChoices,
    },
  ];

  const answers = await inquirer.prompt(questions);

  const app = answers.app;

  switch (app) {
    case AVAILABLE_APPS.NEST:
      await addNestModule(options, true);
      break;
    case AVAILABLE_APPS.REACT_NATIVE:
      await addReactNativeModule(options, true);
      break;
    default:
      await printUnderConstructionMessage(app);
  }
};
