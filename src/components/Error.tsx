import React, { ReactElement } from "react";
import { Text } from "ink";

interface ErrorProps {
	msg: string;
}

export function Error({ msg }: ErrorProps): ReactElement {
	return <Text>{msg}</Text>;
}
