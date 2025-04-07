#!/usr/bin/env node

import { Command } from "commander";
import { version } from "../package.json";

// Commands
import { useNestCommand } from "./commands/nest/command";
import { usePlanetaryCommand } from "./commands/planetary/command";

const program = new Command();

program
  .name("planetary")
  .description(
    "CLI tool to clone common components from the SpaceDev boilerplate repos. "
  )
  .version(version);

usePlanetaryCommand(program);
useNestCommand(program);

program.parse();
