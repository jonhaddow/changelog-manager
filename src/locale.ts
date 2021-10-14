export const HELP_TEXT = `
Usage
$ changelog <command>

Commands
	add        Adds a new changelog entry
	release    Creates a new release

Options
	--severity, -s    patch, minor, or major
	--message -m      Message describing your change
	--group, -g       Group with other changes (optional)

Examples
$ changelog add -s patch -g project1 -m "Add feature x"
`;

export const NO_COMMAND = `
Action is required. See \`--help\` for example use.
`;

export const UNKNOWN_COMMAND = `
Unknown action. See \`--help\` for example use.
`;

export const INVALID_SEVERITY = `
You need to provide a valid severity for the change. Either patch, minor or major.
`;

export const PROCESSING_NEW_ENTRY = `
Adding change log entry...
`;

export const ADDED_NEW_ENTRY = `
Changelog entry added.
`;
