import React from "react";
import { render } from "ink-testing-library";
import { App } from "./App";

it("CLI renders correctly", () => {
	const { lastFrame } = render(
		<App command="add" severity="patch" message="Add feature x" />
	);

	expect(lastFrame()).toEqual(`\nAdding change log entry...\n`);
});
