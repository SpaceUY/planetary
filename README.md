# Planetary CLI

A command-line tool for internal usage that copies specific folders from the template (boilerplate) folders into a chosen folder of a destination project. This is designed to work similarly to ShadCN - the copies are independent from the template, and can be modified and customized at will.

This tool aims at helping streamline project setup by providing common functionality in the form of components for NestJS, React, and React Native apps.

## Registry login

To work with `planetary`, you'll first need to log into the `@SpaceUY` scope. For this, you'll need a **github token**.

These tokens are personal - generated for each developer's Github account. To generate a token, go to **Settings** on your Github account, and scroll down until you see **Developer Settings** on the left sidebar. Click on that, and then on **Personal access tokens > Tokens (classic)**. Then, **Generate new token > Generate new token (classic)**.

You'll need to add a small note to the token, and select an appropriate expiration time, but what's important is that you check the **write:packages** checkbox. Then, go ahead and click **Generate token** at the bottom of the form.

Once you create the token, it will be displayed on your screen. Copy it, as you'll not be able to see it again otherwise.

To round things up, execute this command on your machine:

```bash
$ npm login --scope=@SpaceUY --auth-type=legacy --registry=https://npm.pkg.github.com
```

You'll be prompted for your Github username, and a password. The password is actually the token you just created!

> Don't be fooled by the spinner when the password is displayed, you actually need to input the token, and hit enter.

What this will do is create an `~/.npmrc` file, which should contain your token. This will be used by `npm` to access packages in Github registries.

## Installation

Once logged in, installation is as simple as:

```
$ npm install -g @SpaceUY/planetary
```

After which `planetary` should be available as a global command.

## Publishing

Publishing also requires logging into the registry first. But once there, simply run:

```bash
$ npm version patch
$ npm publish
```

> [!NOTE]
> For more information on package publishing & installation, see [this](https://docs.github.com/en/packages/managing-github-packages-using-github-actions-workflows/publishing-and-installing-a-package-with-github-actions#upgrading-a-workflow-that-accesses-a-registry-using-a-personal-access-token).

# Usage

## Installing a module

One of `planetary`'s core functionalities is the ability to install modules for different types of projects on demand. This pulls from pre-established repositories, directly into the folder of your choice.

You can get started by simply running `$ planetary` on your command line, and following the different prompts along the way. You'll be prompted for:
- Project type
- Module to install
- (Optionally) If there are multiple implementations available, you'll be asked to select which one you want.

In addition to this, you can expand `planetary`'s start command to streamline you experience, if you know what you want in advance.

You can input:
- The project type, via: `$ planetary <PROJECT_TYPE>`. Available values for `PROJECT_TYPE` at the time are:
    - `nestjs`
    - `react`
    - `react-native`
- Flags, for specific purposes (all of them are optional):
    - `-b, --branch`: Select the specific branch of the remote repository to fetch from. Defaults to the main branch.
    - `-m, --module`: The module to copy. Use this if you already know the module in advance.
    - `-d, --destination`: Destination folder. If not specified, defaults to the present working directory (PWD).
 
> [!NOTE]
> You can see the same information using the `-h` flag.

Once installed, a module is **fully owned by the new project**, as it is a full copy of the original source code.
You can modify this copy to fit your needs in the project.

---

# Contributing

Contributing is split into two parts: boilerplate (or template) contributions, and planetary contributions.

## Boilerplate contributions

Each boilerplate or template for the different project types is located at different repositories; to contribute to them, make sure you submit a PR to the corresponding repo, and reach out to the maintaining team if you have any doubts about the procedure to follow.

## Planetary contributions

Planetary is an internal SpaceDev tool, so contributions must be discussed with the team beforehand to ensure the effectiveness of any change made. Reach out to fellow team members in our Mattermost channels, and plan before executing any meaningful changes!
