import { dirname, join } from "path";
import { constants, promises } from "fs";
import { readdir, readFile } from "fs/promises";
import { Entry } from "./models";
import yaml from "js-yaml";

export interface Flags {
	type?: "patch" | "minor" | "major";
	message: string;
	group?: string;
}

export async function getRootDirectory(): Promise<string | undefined> {
	for (const path of module.paths) {
		try {
			const prospectivePkgJsonDir = dirname(path);
			await promises.access(path, constants.F_OK);
			return prospectivePkgJsonDir;
			// eslint-disable-next-line no-empty
		} catch {}
	}
}

export async function getEntryDirectory(): Promise<string | undefined> {
	const dir = await getRootDirectory();
	return join(dir, "unreleased");
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
	const pendingDir = await getEntryDirectory();

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
