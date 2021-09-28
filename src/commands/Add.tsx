import React, { ReactElement, useEffect } from "react";
import { Text } from "ink";
import { Flags, getRootDirectory } from "../common";
import { Error } from "../components";
import { writeFile, access, mkdir } from "fs/promises";
import path from "path";

function generateFileContents(
	severity: string,
	message: string,
	group?: string
): string {
	return `---
severity: ${severity}
group: ${group ?? null}
---
${message}
`;
}

async function addFile(contents: string): Promise<void> {
	const dir = await getRootDirectory();
	const pendingDir = path.join(dir, "unreleased");

	await mkdir(dir, { recursive: true });

	try {
		await writeFile(path.join(pendingDir, `${Date.now()}.md`), contents);
	} catch (ex) {
		console.error("Failed to write file", ex);
	}
}

const acceptableSeverityTypes = ["patch", "minor", "major"];

export function Add({ severity, message, group }: Flags): ReactElement {
	useEffect(() => {
		const fileContents = generateFileContents(severity, message, group);
		void addFile(fileContents);
	}, [group, message, severity]);

	if (!severity || !acceptableSeverityTypes.includes(severity)) {
		return (
			<Error msg="You need to provide a severity for the change. Either patch, minor or major." />
		);
	}
	if (!message) {
		return <Error msg="You need to provide a message describing your change" />;
	}

	return <Text>File added.</Text>;
}
