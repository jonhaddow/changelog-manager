import React, { ReactElement } from "react";
import { Text } from "ink";
import { Entry } from "../models";
import { readFile, readdir, writeFile, unlink } from "fs/promises";
import yaml from "js-yaml";
import { getEntryDirectory, getRootDirectory } from "../common";
import path from "path";
import {
	CHANGELOG_UPDATED,
	FAILED_TO_UPDATE_CHANGELOG,
	NO_ENTRIES,
	PROCESSING_RELEASE,
} from "../locale";
import { inc } from "semver";

async function readEntry(location: string): Promise<Entry> {
	try {
		const contents = await readFile(location, "utf8");
		const entry = yaml.load(contents) as Entry;
		return entry;
	} catch (ex) {
		console.error("Failed to read file", ex);
	}
}

async function readEntries(): Promise<Entry[]> {
	const pendingDir = await getEntryDirectory();

	const entries: Entry[] = [];
	try {
		const allFiles = await readdir(pendingDir);
		for (const file of allFiles) {
			entries.push(await readEntry(path.join(pendingDir, file)));
		}
	} catch (ex) {
		console.error("Failed to read files", ex);
	}

	return entries;
}

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

async function detectCurrentSemVer(): Promise<string> {
	const root = await getRootDirectory();
	const pgkJson = path.join(root, "package.json");
	try {
		const contents = await readFile(pgkJson, "utf8");
		const json = JSON.parse(contents) as Record<string, string>;
		return json.version;
	} catch (ex) {
		console.error("Failed to read package.json");
	}
}

async function prepareHeaderLine(release: Entry["release"]): Promise<string> {
	const now = new Date();
	now.getUTCFullYear();

	const getCurrentVersion = await detectCurrentSemVer();

	const nextVersion = inc(getCurrentVersion, release);

	return `## [${nextVersion}] - ${now.getUTCFullYear()}-${
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
	try {
		const existingContent = await readFile(changelogLocation, "utf8");
		const newContent = `${content}\n\n${existingContent}`;
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

export function Release(): ReactElement {
	const [processing, setProcessing] = React.useState(true);
	const [response, setResponse] = React.useState<string>();

	React.useEffect(() => {
		async function updateChangelog(): Promise<void> {
			const entries = await readEntries();

			if (!entries.length) {
				setResponse(NO_ENTRIES);
			} else {
				const release = getRelease(entries);
				const header = await prepareHeaderLine(release);
				const changelogUpdate = `${header}\n\n${prepareContentFromEntries(
					entries
				)}`;
				const error = await prependToChangelog(changelogUpdate);

				if (error) {
					setResponse(error);
				} else {
					setResponse(CHANGELOG_UPDATED);

					await deleteEntries();
				}
			}

			setProcessing(false);
		}

		updateChangelog();
	}, []);

	if (processing) {
		return <Text>{PROCESSING_RELEASE}</Text>;
	}

	return <Text>{response}</Text>;
}
