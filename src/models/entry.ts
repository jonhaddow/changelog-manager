export interface Entry {
	/**
	 * The release of a changelog entry.
	 */
	release: "patch" | "minor" | "major";

	/**
	 * The group an entry belongs to.
	 */
	group: string;

	/**
	 * The message describing the changelog.
	 */
	message: string;
}
