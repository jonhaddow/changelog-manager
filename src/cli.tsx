import * as React from "react";
import { render } from "ink";
import meow from "meow";
import { App } from "./App";
import { HELP_TEXT } from "./locale";

const cli = meow(HELP_TEXT, {
	flags: {
		severity: {
			type: "string",
			alias: "s",
			isRequired: false,
		},
		message: {
			type: "string",
			alias: "m",
			isRequired: false,
		},
		group: {
			type: "string",
			alias: "g",
			isRequired: false,
		},
	},
});

render(<App command={cli.input[0]} {...cli.flags} />);
