#!/usr/bin/env node

import { Command } from "commander";
import { version } from "../package.json";
import { addNestModule } from "./commands/nest";

const program = new Command();

program
  .name("space-cli")
  .description(
    "CLI tool to clone common components from the SpaceDev boilerplate repos. "
  )
  .version(version);

// program
//   .command("create")
//   .description("Create a new project from a template")
//   .option(
//     "-t, --template <template>",
//     "Template to use (nest, react, react-native)"
//   )
//   .option("-d, --destination <path>", "Destination folder")
//   .option(
//     "-r, --repository <url>",
//     "GitHub repository URL",
//     "https://github.com/yourusername/your-templates-repo"
//   )
//   .action(createProject);

program
  .command("nest")
  .description(
    "Copies a specified NestJS module from the SpaceDev template repo."
  )
  .option("-m, --module <module>", "Module to copy")
  .option(
    "-d, --destination <path>",
    "Destination folder, defaults to `.`",
    "."
  )
  .action(addNestModule);

program.parse(process.argv);

// If no arguments are provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
