import chalk from "chalk";
import inquirer from "inquirer";

import {
  AvailableModule,
  availableModules,
} from "../configs/available-modules";

/**
 * Choose a module from the available modules, either by using the `--module` flag, or through an interactive prompt.
 * @param {string} module ? - The module chosen through the `--module` flag.
 * @returns {string} The final chosen module.
 * */
export const chooseModule = async (
  module?: string
): Promise<AvailableModule> => {
  const questions = [];

  if (!module) {
    questions.push({
      type: "list",
      name: "module",
      message: "Which module would you like to add?",
      choices: availableModules,
    });

    const answers = await inquirer.prompt(questions);
    module = answers.module;
  }

  if (!availableModules.includes(module as string)) {
    throw new Error(`
    Module ${chalk.cyan(module)} not found.
    Available modules are: ${chalk.cyan(
      `\n\t- ${availableModules.join("\n\t- ")}`
    )}`);
  }

  return module as AvailableModule;
};
