import React, { ReactElement } from "react";
import { Text } from "ink";
import { Add, Release } from "./commands";
import { Flags } from "./common";

type Command = "add" | "release";
const commandMap: { [key in Command]: (flags: Flags) => ReactElement } = {
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
}: AppProps): ReactElement {
	if (Object.keys(commandMap).includes(command)) {
		return React.createElement<Flags>(commandMap[command], {
			severity,
			message,
			group,
		});
	} else {
		return <Text>Command unsupported.</Text>;
	}
}
