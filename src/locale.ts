export const HELP_TEXT = `
Usage
$ changelog <command>

Commands
	add        Adds a new changelog entry
	release    Creates a new release
	list       Lists all pending changelog entries

Options
	--release, -r    patch, minor, or major
	--message -m      Message describing your change
	--group, -g       Group with other changes (optional)

Examples
$ changelog add -s patch -g project1 -m "Add feature x"
$ changelog list
$ changelog release
`;

export const NO_COMMAND = `
Action is required. See \`--help\` for example use.
`;

export const UNKNOWN_COMMAND = `
Unknown action. See \`--help\` for example use.
`;

export const INVALID_RELEASE = `
You need to provide a valid release type for the change. Either patch, minor or major.
`;

export const PROCESSING_NEW_ENTRY = `
Adding change log entry...
`;

export const ADDED_NEW_ENTRY = `
Changelog entry added.
`;

export const PROCESSING_RELEASE = `
Updating changelog...
`;

export const NO_ENTRIES = `
No entries found.
`;

export const CHANGELOG_UPDATED = `
Changelog updated.
`;

export const FAILED_TO_UPDATE_CHANGELOG = `
Failed to update changelog.
`;

export const EMPTY_MESSAGE = `<<Empty message>>`;
