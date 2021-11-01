import * as React from "react";
import { Box, Text } from "ink";
import { getRelease, readEntries } from "../common";
import { Entry } from "../models";
import { EMPTY_MESSAGE, NO_ENTRIES } from "../locale";

/**
 * A command to list (with filter arguments) all pending changelog entries.
 * @returns A list of pending changelog entries
 */
export function List(): React.ReactElement {
	const [entries, setEntries] = React.useState<Entry[]>([]);
	const [processing, setProcessing] = React.useState(true);

	const release = getRelease(entries);

	React.useEffect(() => {
		async function getEntries(): Promise<void> {
			const entries = await readEntries();
			setEntries(entries);
			setProcessing(false);
		}

		getEntries();
	}, []);

	const releaseColorMap: Record<Entry["release"], string> = {
		major: "#ff66cc",
		minor: "#ff9933",
		patch: "#00cc00",
	};

	if (processing) {
		return null;
	}

	if (!entries.length) {
		return <Text>{NO_ENTRIES}</Text>;
	}

	return (
		<Box marginTop={1} flexDirection="column">
			<Text>
				Next release: <Text bold>{release}</Text>
			</Text>
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
