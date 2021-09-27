import React from "react";
import { render } from "ink-testing-library";
import App from "./ui";

it("CLI renders correctly", () => {
	const { lastFrame } = render(<App severity="patch" />);

	expect(lastFrame()).toEqual(`Hello, World.`);
});
