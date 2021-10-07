import React, { ReactElement, useEffect } from "react";
import { Box, Text } from "ink";
import { Flags, getRootDirectory } from "../common";
import { Error } from "../components";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {
	ADDED_NEW_ENTRY,
	INVALID_SEVERITY,
	PROCESSING_NEW_ENTRY,
} from "../locale";

function generateFileContents(
	severity: string,
	message: string,
	group?: string
): string {
	return `---
severity: ${severity}
group: ${group ?? null}
---
${message ?? ""}

# Here is where you can author a message to be added to the changelog.
# Any commented lines will be omitted.
`;
}

/**
 * Add a new file to the "<root>/unreleased" folder.
 * @param contents The contents of the file.
 */
async function addFile(contents: string): Promise<string> {
	const dir = await getRootDirectory();
	const pendingDir = path.join(dir, "unreleased");
	const pendingFile = path.join(pendingDir, `${Date.now()}.md`);

	try {
		await mkdir(pendingDir, { recursive: true });
		await writeFile(pendingFile, contents);

		return pendingFile;
	} catch (ex) {
		console.error("Failed to write file", ex);
	}
}

const acceptableSeverityTypes = ["patch", "minor", "major"];

export function Add({ severity, message, group }: Flags): ReactElement {
	const [processing, setProcessing] = React.useState(true);
	const [fileLocation, setFileLocation] = React.useState("");

	const validSeverity = severity && acceptableSeverityTypes.includes(severity);

	useEffect(() => {
		async function createFile(): Promise<void> {
			const fileContents = generateFileContents(severity, message, group);
			const location = await addFile(fileContents);
			setProcessing(false);
			setFileLocation(location);
		}

		if (validSeverity) {
			createFile();
		}
	}, [group, message, severity, validSeverity]);

	if (!validSeverity) {
		return <Error msg={INVALID_SEVERITY} />;
	}

	if (processing) {
		return <Text>{PROCESSING_NEW_ENTRY}</Text>;
	}

	return (
		<Box justifyContent="center" flexDirection="column">
			<Text color="green">{ADDED_NEW_ENTRY}</Text>
			<Text color="grey">{fileLocation}</Text>
		</Box>
	);
}
