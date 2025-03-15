import chalk from "chalk";
import inquirer from "inquirer";

import {
  type AvailableModule,
  MODULE_IMPLEMENTATIONS,
} from "../configs/available-modules";

/**
 * Choose an implementation for the chosen module.
 * @param {string} module - The module to choose an implementation for.
 * @returns {string} The chosen implementation.
 * */
export const chooseImplementation = async (
  module: AvailableModule
): Promise<string> => {
  const availableImplementations = MODULE_IMPLEMENTATIONS[module];

  const questions = [
    {
      type: "list",
      name: "implementation",
      message: `Which implementation for the ${chalk.cyan(
        module
      )} module would you like to add?`,
      choices: availableImplementations,
    },
  ];

  const answers = await inquirer.prompt(questions);
  return answers.implementation;
};
