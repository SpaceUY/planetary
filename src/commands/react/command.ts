import { COMMANDS } from "../../utils/commands";
import { Command } from "commander";
import { addReactModule } from ".";

/**
 * Higher order function to add the React command to the program
 * by directly mutating the program object.
 * @param {Command} program
 */
export const useReactCommand = (program: Command): void => {
  program
    .command(COMMANDS.REACT)
    .description(
      "Copies a specified React module from the SpaceDev React Registry repo."
    )
    .option("-m, --module <module>", "Module to copy")
    .option(
      "-b, --branch <branch>",
      "Branch to copy from. If not provided, uses the default branch in the target repository"
    )
    .option("-d, --destination <path>", "Destination folder")
    .action(addReactModule);
};  