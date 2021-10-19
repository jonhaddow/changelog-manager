import * as React from "react";
import { Box, Text } from "ink";
import { readEntries } from "../common";
import { Entry } from "../models";
import { EMPTY_MESSAGE, NO_ENTRIES } from "../locale";

/**
 * A command to list (with filter arguments) all pending changelog entries.
 * @returns A list of pending changelog entries
 */
export function List(): React.ReactElement {
	const [entries, setEntries] = React.useState<Entry[]>([]);
	const [processing, setProcessing] = React.useState(true);

	React.useEffect(() => {
		async function getEntries(): Promise<void> {
			const entries = await readEntries();
			setEntries(entries);
			setProcessing(false);
		}

		getEntries();
	}, []);

	const releaseColorMap: Record<Entry["release"], string> = {
		major: "#ec407a",
		minor: "#b39ddb",
		patch: "#b2ebf2",
	};

	if (processing) {
		return null;
	}

	if (!entries.length) {
		return <Text>{NO_ENTRIES}</Text>;
	}

	return (
		<Box marginTop={1} flexDirection="column">
			<Text>Pending changes</Text>
			<Box padding={1} flexDirection="column">
				{entries.map((x, idx) => (
					<Box key={idx}>
						<Box marginRight={2}>
							<Text color="gray">{idx + 1}.</Text>
						</Box>
						<Box marginRight={1}>
							<Text color={releaseColorMap[x.release]}>{x.release}</Text>
						</Box>
						<Box marginRight={1}>
							<Text color="gray">-</Text>
						</Box>
						<Text>{x.message ?? EMPTY_MESSAGE}</Text>
					</Box>
				))}
			</Box>
		</Box>
	);
}
