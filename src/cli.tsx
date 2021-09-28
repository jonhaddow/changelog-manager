import React from "react";
import { render } from "ink";
import meow from "meow";
import { App } from "./ui";

const cli = meow(
	`
	Usage
	  $ changelog <command>

	Commands
		add        Adds a new changelog entry
		release    Creates a new release

	Options
		--severity, -s    Patch, Minor, or Major
		--message -m      Message describing your change
		--group, -g       Group with other changes (optional)

	Examples
	  $ changelog add -s patch -g project1 -m "Add feature x"
`,
	{
		flags: {
			severity: {
				type: "string",
				alias: "s",
				isRequired: true,
			},
			message: {
				type: "string",
				alias: "m",
				isRequired: true,
			},
			group: {
				type: "string",
				alias: "g",
				isRequired: false,
			},
		},
	}
);

render(<App command={cli.input[0]} {...cli.flags} />);
