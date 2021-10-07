import * as React from "react";
import { Add, Release } from "./commands";
import { Flags } from "./common";
import { Text } from "ink";
import { NO_COMMAND, UNKNOWN_COMMAND } from "./locale";

type Command = "add" | "release";
const commandMap: { [key in Command]: (flags: Flags) => React.ReactElement } = {
	add: Add,
	release: Release,
};

interface AppProps extends Flags {
	command: string;
}

export function App({
	command,
	severity,
	message,
	group,
}: AppProps): React.ReactElement {
	if (!command) {
		return <Text>{NO_COMMAND}</Text>;
	}

	if (!Object.keys(commandMap).includes(command)) {
		return <Text>{UNKNOWN_COMMAND}</Text>;
	}

	return React.createElement<Flags>(commandMap[command], {
		severity,
		message,
		group,
	});
}
