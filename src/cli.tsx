import * as React from "react";
import { render } from "ink";

import { Command } from "commander";
import { Add, List, Release } from "./commands";

const program = new Command("changelog-manager");

const add = program.command("add");

add
	.description("Adds a pending changelog entry")
	.option("--patch", "For a bug fix (default)")
	.option("--minor", "This change is for new functionality")
	.option("--major", "This change is a breaking change")
	.requiredOption("-m, --message <msg>", "The message describing the change")
	.option("-g, --group <group>", "Group with other changes")
	.showHelpAfterError()
	.action(
		(args: {
			patch?: boolean;
			minor?: boolean;
			major?: boolean;
			message: string;
			group?: string;
		}) => {
			render(
				<Add
					type={args.major ? "major" : args.minor ? "minor" : "patch"}
					message={args.message}
					group={args.group}
				/>
			);
		}
	);

const list = program.command("list");
list.description("Lists all pending changelog entries").action(() => {
	render(<List />);
});

const release = program.command("release");
release.description("Updates CHANGELOG.md with pending entries").action(() => {
	render(<Release />);
});

program.parse();
