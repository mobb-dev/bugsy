# Bugsy

Bugsy is a command-line interface (CLI) tool that provides automatic security vulnerability remediation for your code. It is the community edition version of [Mobb](https://www.mobb.dev), the first vendor-agnostic automatic security vulnerability remediation tool. Bugsy is designed to help developers easily identify and fix security vulnerabilities in their code.

<img width="750" alt="Screenshot 2023-03-27 at 5 23 19 PM" src="https://user-images.githubusercontent.com/96389636/228070025-2a1c3aae-6b40-427f-a1e9-2b10ef97b5ea.png">

## What is [Mobb](https://www.mobb.dev)?

[Mobb](https://www.mobb.dev) is the first vendor-agnostic automatic security vulnerability remediation tool. It ingests SAST results from Checkmarx, GitHub Advanced Security, and Snyk and produces code fixes for developers to review and commit to their code.

## What does Bugsy do?

-   Uses Snyk CLI tool to run a SAST analysis on a given open-source GitHub repo
-   Analyzes the vulnerability report to identify issues that can be remediated automatically
-   Produces the code fixes and redirects the user to the fix report page on the Mobb platform

## Disclaimer

This is a community edition version that only analyzes public GitHub repositories.
Snyk CLI is used to produce a SAST vulnerability report.

-   Only Java projects are supported at the moment.
-   Only SQLi, CMDi, XSS, XXE, and Path Traversal are currently supported.

## Usage

You can use Bugsy from the command line. To evaluate and remediate a new open-source repository, you can run the following command:

```shell
npx mobbdev scan -r https://github.com/mobb-dev/simple-vulnerable-java-project
```

Bugsy will automatically generate a fix for each supported vulnerability identified in the SAST results, present it to developers for review and commit to their code.

## Getting support

If you need support using Bugsy or just want to share your thoughts and learn more, you are more than welcome to join our [discord server](https://discord.gg/Jmpb5QUa)
