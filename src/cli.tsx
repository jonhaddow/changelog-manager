import React from "react";
import { render } from "ink";
import meow from "meow";
import App from "./ui";

const cli = meow(
	`
	Usage
	  $ changelog-manager

	Options
		--severity, -s    Patch, Minor, or Major
		--group, -g       Group with other changes
		--message -m      Message describing your change

	Examples
	  $ changelog-manager -s patch -g project1
`,
	{
		flags: {
			severity: {
				type: "string",
				alias: "s",
				isRequired: true,
			},
			group: {
				type: "string",
				alias: "g",
				isRequired: false,
			},
			message: {
				type: "string",
				alias: "m",
				isRequired: false,
			},
		},
	}
);

render(<App {...cli.flags} />);
