import chalk from "chalk";
import inquirer from "inquirer";

import { ModuleConfig } from "./get-modules";
import { printStep } from "./shared-prints";

/**
 * Choose a module from the available modules, either by using the `--module` flag, or through an interactive prompt.
 * @param {string} module ? - The module chosen through the `--module` flag.
 * @returns {string} The final chosen module.
 * */
export const chooseModule = async (
  availableModules: Record<string, ModuleConfig>,
  module?: string
): Promise<ModuleConfig> => {
  printStep("Choose a module to add");

  const moduleChoices = Object.keys(availableModules);

  if (!module) {
    const questions = [
      {
        type: "list",
        name: "module",
        message: "Which module would you like to add?",
        choices: moduleChoices,
      },
    ];

    const answers = await inquirer.prompt(questions);
    module = answers.module;
  }

  const moduleConfig = availableModules[module as string];

  if (!moduleConfig) {
    throw new Error(`
    Module ${chalk.cyan(module)} not found.
    Available modules are: ${chalk.cyan(
      `\n\t- ${moduleChoices.join("\n\t- ")}`
    )}`);
  }

  return moduleConfig;
};
