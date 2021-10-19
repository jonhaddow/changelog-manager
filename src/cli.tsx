import * as React from "react";
import { render } from "ink";

import { Command, Option } from "commander";
import { Add, List, Release } from "./commands";
import { Flags } from "./common";

const program = new Command("changelog-manager");

const add = program.command("add");

add
	.description("Adds a pending changelog entry")
	.addOption(
		new Option("-t, --type <type>", "The type of the change")
			.choices(["patch", "minor", "major"])
			.default("patch")
	)
	.requiredOption("-m, --message <msg>", "The message describing the change")
	.option("-g, --group <group>", "Group with other changes")
	.showHelpAfterError()
	.action((args: Flags) => {
		render(<Add type={args.type} message={args.message} group={args.group} />);
	});

const list = program.command("list");
list.description("Lists all pending changelog entries").action(() => {
	render(<List />);
});

const release = program.command("release");
release.description("Updates CHANGELOG.md with pending entries").action(() => {
	render(<Release />);
});

program.parse();
