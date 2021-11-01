import * as React from "react";
import { Text } from "ink";
import { Entry } from "../models";
import { readFile, readdir, writeFile, unlink } from "fs/promises";
import { getEntryDirectory, getRootDirectory, readEntries } from "../common";
import path from "path";
import {
	CHANGELOG_UPDATED,
	FAILED_TO_UPDATE_CHANGELOG,
	NO_ENTRIES,
} from "../locale";

function getRelease(entries: Entry[]): Entry["release"] {
	if (entries.some((x) => x.release == "major")) return "major";
	if (entries.some((x) => x.release == "minor")) return "minor";
	return "patch";
}

function groupBy<TItem>(xs: TItem[], key: string): { [key: string]: TItem[] } {
	return xs.reduce((rv, x) => {
		(rv[x[key]] = rv[x[key]] || []).push(x);
		return rv;
	}, {});
}

function prepareHeaderLine(release: Entry["release"]): string {
	const now = new Date();
	now.getUTCFullYear();

	return `## [${release}] - ${now.getUTCFullYear()}-${
		now.getUTCMonth() + 1
	}-${now.getUTCDate()}`;
}

function prepareContentFromEntries(entries: Entry[]): string {
	let content = "";
	const rootEntries = entries.filter((x) => x.group === null);

	rootEntries.forEach((entry) => {
		content += `* ${entry.message}\n`;
	});

	const nonRootEntries = entries.filter((x) => x.group !== null);
	const allGroupedEntries = groupBy(nonRootEntries, "group");
	for (const group in allGroupedEntries) {
		content += `* ${group}\n`;
		const groupedEntries = allGroupedEntries[group];
		groupedEntries.forEach((entry) => {
			content += `\t* ${entry.message}\n`;
		});
	}

	return content;
}

async function prependToChangelog(
	content: string
): Promise<string | undefined> {
	const root = await getRootDirectory();
	const changelogLocation = path.join(root, "CHANGELOG.md");
	let existingContent = "";
	try {
		existingContent = await readFile(changelogLocation, "utf8");
	} catch (ex) {
		// Changelog doesn't exist. Don't throw, we can create one.
	}

	try {
		const newContent = `${content}\n${existingContent}`;
		await writeFile(changelogLocation, newContent);
	} catch (ex) {
		return FAILED_TO_UPDATE_CHANGELOG;
	}
}

async function deleteEntries(): Promise<void> {
	const pendingDir = await getEntryDirectory();
	try {
		const allFiles = await readdir(pendingDir);
		for (const file of allFiles) {
			await unlink(path.join(pendingDir, file));
		}
	} catch (ex) {
		console.error("Failed to delete files", ex);
	}
}

export function Release(): React.ReactElement | null {
	const [processing, setProcessing] = React.useState(true);
	const [error, setError] = React.useState<string>();

	React.useEffect(() => {
		async function updateChangelog(): Promise<void> {
			const entries = await readEntries();

			if (!entries.length) {
				setError(NO_ENTRIES);
			} else {
				const release = getRelease(entries);
				const header = prepareHeaderLine(release);
				const changelogUpdate = `${header}\n\n${prepareContentFromEntries(
					entries
				)}`;
				const error = await prependToChangelog(changelogUpdate);

				if (error) {
					setError(error);
				} else {
					await deleteEntries();
				}
			}

			setProcessing(false);
		}

		updateChangelog();
	}, []);

	if (processing) {
		return null;
	}

	return (
		<Text color={error ? "red" : "green"}>{error ?? CHANGELOG_UPDATED}</Text>
	);
}
