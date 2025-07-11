import chalk from "chalk";
import { ModuleImplementationConfig } from "./get-modules";
// import { version } from "../../package.json";

/**
 * Prints a friendly welcome message when the CLI is initialized
 * @param {string} command - The command being executed (e.g. "nest", "react", etc.)
 */
export const printWelcomeMessage = async (command?: string): Promise<void> => {
  const { default: boxen } = await import("boxen");

  // Create a colorful header
  const header = chalk.bold.cyan("🚀 Planetary CLI");

  // Create a message based on the command
  let message: string;

  switch (command) {
    case "nest":
      message = `You're about to add a NestJS module from the SpaceDev templates.\n`;
      break;
    case "react":
      message = `You're about to create a new React project with Vite and TypeScript.\n`;
      break;
    default:
      message = `You're about to copy a component from the SpaceDev templates.\n`;
  }

  // Tips section
  const tips = [
    `${chalk.green("Tip:")} Use ${chalk.bold(
      "-m"
    )} to specify a the module you want to add if you know what you're looking for`,
    `${chalk.green("Tip:")} Use ${chalk.bold(
      "-d"
    )} to specify a destination folder`,
    `${chalk.green("Tip:")} Use ${chalk.bold(
      "-b"
    )} to specify a branch from the repository`,
    `${chalk.green("Tip:")} Run with ${chalk.bold(
      "--help"
    )} to see all available options`,
  ].join("\n");

  const welcomeMessage = `${header}\n\n${message}\n\n${tips}`;

  const boxOptions = {
    padding: 2,
    borderColor: "cyan",
  };

  // Print the box
  const box = boxen(welcomeMessage, boxOptions);
  console.log(box);
  console.log("");
};

/**
 * Prints a success message after a component has been successfully added
 * @param {string} module - The module that was added
 */
export const printSuccessMessage = async (
  module: string,
  implementation?: ModuleImplementationConfig
): Promise<void> => {
  const { default: boxen } = await import("boxen");

  let dependenciesMessage;

  if (implementation?.dependencies?.length) {
    dependenciesMessage = chalk.yellow(
      "\nTo begin working with this component, you must install the following dependencies:"
    );
    dependenciesMessage = `${dependenciesMessage}\n\n$ pnpm install ${chalk.cyan(
      implementation.dependencies.join(" ")
    )}\n`;
  }

  const message = `
${chalk.green("✓")} Successfully added the ${chalk.cyan(module)} component
${dependenciesMessage ?? ""}
${chalk.cyan("What's next?")}
- Check out the added files to understand how they work
- Review the documentation at ${chalk.underline(
    "https://docs.spacedev.planetary.dev"
  )}
- Run your application to test the new component

${chalk.yellow("Happy coding! 🎉")}
`;

  console.log(
    boxen(message, {
      padding: 1,
      margin: 1,
      borderStyle: "round",
      borderColor: "green",
    })
  );
};

/**
 * Prints a message indicating that a app is under construction.
 * @param {string} app - The app that is under construction.
 */
export const printUnderConstructionMessage = async (
  app: string
): Promise<void> => {
  const { default: boxen } = await import("boxen");
  const message = `🚧 Implementation not yet available for ${chalk.yellow(
    app
  )}. We're working on it!`;

  console.log("");
  console.log(
    boxen(message, {
      padding: 1,
      borderColor: "yellow",
    })
  );
};

/**
 * Prints a step marker with an optional message and continues the flow line
 * @param {string} message - Message to display next to the step marker
 */
export const printStep = (message: string): void => {
  console.log("");
  console.log(chalk.cyan("○"), message);
  console.log(chalk.cyan("│"));
};
