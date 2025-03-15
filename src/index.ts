#!/usr/bin/env node

import { Command } from "commander";
import { version } from "../package.json";
import { addNestModule } from "./commands/nest";
import { addPlanetaryComponent } from "./commands/planetary";
import { COMMANDS } from "./utils/commands";

const program = new Command();

program
  .name("planetary")
  .description(
    "CLI tool to clone common components from the SpaceDev boilerplate repos. "
  )
  .version(version);

program
  .description(
    "Copies a component for either of the provided SpaceDev template repositories."
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
  .action(addPlanetaryComponent);

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

program.parse(process.argv);
