#!/usr/bin/env node

import { Command } from "commander";
// Commands
import { useNestCommand } from "./commands/nest/command";
import { usePlanetaryCommand } from "./commands/planetary/command";
import { useReactNativeCommand } from "./commands/react-native/command";
import { version } from "../package.json";

const program = new Command();

program
  .name("planetary")
  .description(
    "CLI tool to clone common components from the SpaceDev boilerplate repos. "
  )
  .version(version);

usePlanetaryCommand(program);
useNestCommand(program);
useReactNativeCommand(program);

program.parse();
