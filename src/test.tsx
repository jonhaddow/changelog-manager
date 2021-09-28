import React from "react";
import { render } from "ink-testing-library";
import { App } from "./ui";

it("CLI renders correctly", () => {
	const { lastFrame } = render(
		<App command="add" severity="patch" message="Add feature x" />
	);

	expect(lastFrame()).toEqual(`File added.`);
});
