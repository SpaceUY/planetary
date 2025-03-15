import * as fs from "fs-extra";
import * as path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import simpleGit from "simple-git";

interface CreateOptions {
  template?: string;
  destination?: string;
  repository: string;
}

export async function createProject(options: CreateOptions): Promise<void> {
  try {
    // Collect missing information through interactive prompts
    const answers = await promptMissingOptions(options);
    const { template, destination, repository } = answers;

    // Create a temporary directory to clone the repository
    const tempDir = path.join(process.cwd(), ".space-cli-temp");
    await fs.ensureDir(tempDir);

    // Clone the repository
    const spinner = ora("Cloning template repository...").start();
    const git = simpleGit();

    try {
      await git.clone(repository, tempDir, ["--depth", "1"]);
      spinner.succeed("Repository cloned successfully");
    } catch (error) {
      spinner.fail(`Failed to clone repository: ${error}`);
      await fs.remove(tempDir);
      return;
    }

    // Check if the template exists in the repository
    const templateDir = path.join(tempDir, template);
    if (!(await fs.pathExists(templateDir))) {
      console.error(
        chalk.red(`Template '${template}' not found in the repository.`)
      );
      await fs.remove(tempDir);
      return;
    }

    // Create destination directory if it doesn't exist
    const destPath = path.resolve(destination);
    await fs.ensureDir(destPath);

    // Copy template files to destination
    spinner.start(`Copying ${template} template to ${destPath}...`);
    await fs.copy(templateDir, destPath, { overwrite: false });
    spinner.succeed(`Project created successfully at ${chalk.green(destPath)}`);

    // Clean up temporary directory
    await fs.remove(tempDir);

    console.log("\n" + chalk.green("✓") + " Project setup complete!");
    console.log(chalk.cyan("\nNext steps:"));
    console.log(`  cd ${path.relative(process.cwd(), destPath)}`);
    console.log("  npm install");
    console.log("  npm start\n");
  } catch (error) {
    console.error(chalk.red("Error creating project:"), error);
  }
}

async function promptMissingOptions(
  options: CreateOptions
): Promise<Required<CreateOptions>> {
  const questions = [];

  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Which template would you like to use?",
      choices: ["nest", "react", "react-native"],
    });
  }

  if (!options.destination) {
    questions.push({
      type: "input",
      name: "destination",
      message: "Where would you like to create your project?",
      default: "./my-project",
    });
  }

  const answers = await inquirer.prompt(questions);

  return {
    template: options.template || answers.template,
    destination: options.destination || answers.destination,
    repository: options.repository,
  };
}
