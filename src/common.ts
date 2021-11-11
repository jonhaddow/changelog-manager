import { join } from "path";
import { readdir, readFile } from "fs/promises";
import { Entry } from "./models";
import yaml from "js-yaml";

export interface Flags {
	type?: "patch" | "minor" | "major";
	message: string;
	group?: string;
}

export function getEntryDirectory(): string {
	const dir = process.cwd();
	return join(dir, ".changelog", "unreleased");
}

async function readEntry(location: string): Promise<Entry> {
	try {
		const contents = await readFile(location, "utf8");
		const entry = yaml.load(contents) as Entry;
		return entry;
	} catch (ex) {
		console.error("Failed to read file", ex);
	}
}

export async function readEntries(): Promise<Entry[]> {
	const pendingDir = getEntryDirectory();

	const entries: Entry[] = [];
	try {
		const allFiles = await readdir(pendingDir);
		for (const file of allFiles) {
			entries.push(await readEntry(join(pendingDir, file)));
		}
	} catch (ex) {
		console.error("Failed to read files", ex);
	}

	return entries;
}

export function getRelease(entries: Entry[]): Entry["release"] {
	if (entries.some((x) => x.release == "major")) return "major";
	if (entries.some((x) => x.release == "minor")) return "minor";
	return "patch";
}
