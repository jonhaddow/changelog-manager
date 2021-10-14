import { dirname, join } from "path";
import { constants, promises } from "fs";

export interface Flags {
	release?: string;
	message?: string;
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
