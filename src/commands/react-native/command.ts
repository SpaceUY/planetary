import { COMMANDS } from "../../utils/commands";
import { Command } from "commander";
import { addReactNativeModule } from ".";

/**
 * Higher order function to add the React Native command to the program
 * by directly mutating the program object.
 * @param {Command} program
 */
export const useReactNativeCommand = (program: Command): void => {
  program
    .command(COMMANDS.REACT_NATIVE)
    .description(
      "Copies a specified React Native module from the SpaceDev template repo."
    )
    .option("-m, --module <module>", "Module to copy")
    .option(
      "-b, --branch <branch>",
      "Branch to copy from. If not provided, uses the default branch in the target repository"
    )
    .option("-d, --destination <path>", "Destination folder")
    .action(addReactNativeModule);
}; 