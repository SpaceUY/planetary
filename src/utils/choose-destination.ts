import inquirer from "inquirer";

/**
 * Prompts the user to choose a destination path if not provided
 * @param {string} destination - The destination path from command options
 * @returns {Promise<string>} The chosen destination path
 */
export const chooseDestination = async (
  destination?: string
): Promise<string> => {
  if (destination) return destination;

  const { chosenDestination } = await inquirer.prompt([
    {
      type: "input",
      name: "chosenDestination",
      message: "Where would you like to copy the module to?",
      default: ".",
    },
  ]);

  return chosenDestination;
};
