import chalk from "chalk";
import inquirer from "inquirer";

import { ModuleImplementationConfig } from "../../../utils/get-modules";

/**
 * Choose an implementation for the chosen module.
 * @param {string} moduleName - The module to choose an implementation for.
 * @param {ModuleImplementationConfig[]} implementations - The available implementations for the module.
 * @returns {string | undefined} The chosen implementation. Undefined if the module has a single implementations.
 * */
export const chooseImplementation = async (
  moduleName: string,
  implementations: ModuleImplementationConfig[]
): Promise<string> => {
  if (implementations.length === 1) {
    console.log(
      `✓ Using default implementation: ${chalk.green(implementations[0].name)}`
    );
    return implementations[0].name;
  }

  const questions = [
    {
      type: "list",
      name: "implementation",
      message: `Which implementation for the ${chalk.cyan(
        moduleName
      )} module would you like to add?`,
      choices: implementations.map((implementation) => implementation.name),
    },
  ];

  const answers = await inquirer.prompt(questions);
  const implementation = answers.implementation;

  console.log(`✓ Using implementation: ${chalk.green(implementation)}`);
  return implementation;
};
