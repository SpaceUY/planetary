import { Command } from "commander";
import { addPlanetaryComponent } from ".";

/**
 * Higher order function to add the main `planetary` command to the program
 * by directly mutating the program object.
 * @param {Command} program
 */
export const usePlanetaryCommand = (program: Command): void => {
  program
    .description(
      "Copies a component for either of the provided SpaceDev template repositories."
    )
    .option("-m, --module <module>", "Module to copy")
    .option(
      "-b, --branch <branch>",
      "Branch to copy from. If not provided, uses the default branch in the target repository"
    )
    .option("-d, --destination <path>", "Destination folder")
    .action(addPlanetaryComponent);
};
