import * as React from "react";
import { Box, Text } from "ink";
import { Flags, getEntryDirectory } from "../common";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { ADDED_NEW_ENTRY } from "../locale";

function generateFileContents(
	release: string,
	message: string,
	group?: string
): string {
	return `# The release type for the change. \`patch\`, \`minor\`, or \`major\`.
release: ${release}

# The (optional) group this change should belong to. (e.g. \`Project A\`)
group: ${group ?? null}

# The message describing this change.
message: ${message ?? null}
`;
}

/**
 * Add a new file to the "<root>/unreleased" folder.
 * @param contents The contents of the file.
 */
async function addFile(contents: string): Promise<string> {
	const pendingDir = await getEntryDirectory();
	const pendingFile = path.join(pendingDir, `${Date.now()}.yml`);

	try {
		await mkdir(pendingDir, { recursive: true });
		await writeFile(pendingFile, contents);

		return pendingFile;
	} catch (ex) {
		console.error("Failed to write file", ex);
	}
}

export function Add({
	type: release,
	message,
	group,
}: Flags): React.ReactElement | null {
	const [processing, setProcessing] = React.useState(true);
	const [fileLocation, setFileLocation] = React.useState("");

	React.useEffect(() => {
		async function createFile(): Promise<void> {
			const fileContents = generateFileContents(release, message, group);
			const location = await addFile(fileContents);
			setProcessing(false);
			setFileLocation(location);
		}

		createFile();
	}, [group, message, release]);

	if (processing) {
		return null;
	}

	return (
		<Box justifyContent="center" flexDirection="column">
			<Text color="cyan">{ADDED_NEW_ENTRY}</Text>
			<Text color="grey">{fileLocation}</Text>
		</Box>
	);
}
