import { Command } from "commander";
import { addNestModule } from ".";
import { COMMANDS } from "../../utils/commands";

/**
 * Higher order function to add the NestJS command to the program
 * by directly mutating the program object.
 * @param {Command} program
 */
export const useNestCommand = (program: Command): void => {
  program
    .command(COMMANDS.NEST)
    .description(
      "Copies a specified NestJS module from the SpaceDev template repo."
    )
    .option("-m, --module <module>", "Module to copy")
    .option(
      "-b, --branch <branch>",
      "Branch to copy from. If not provided, uses the default branch in the target repository"
    )
    .option(
      "-d, --destination <path>",
      "Destination folder, defaults to `.`",
      "."
    )
    .action(addNestModule);
};
