# 📃 Changelog Manager

A CLI tool for managing a changelog within large development teams.

## Problem

When you have many developers working within a project, you will often find merge conflicts within the CHANGELOG.md file as each developer adds a pending entry to the top of the file.

## Solution

This CLI tool will allow developers to add new entries stored in separate files. When a new release of the software is prepared, this tool can enable the developer to collect each pending entry and append to the CHANGELOG automatically.

## Install

```bash
$ npm install --global @jonhaddow/changelog-manager
```

## Usage

To add a changelog entry:

```
$ changelog-manager add --minor -m "Improve button styling within form"
```

This will create a new file under `.changelog/unreleased` containing the change details.
Type `changelog-manager add --help` to see other options available like grouping entries, and the options for change severities.

To construct a new release:

```
$ changelog-manager release
```

This will append the changes to the CHANGELOG.md.

## Local development

To compile changes run `npm start`. This will watch and compile TypeScript files.

To test the CLI, run `npx changelog-manager`.
