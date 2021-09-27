import React, { FC } from "react";
import { Text } from "ink";

interface AppProps {
	severity: string;
	group?: string;
	message?: string;
}

const App: FC<AppProps> = () => <Text>Hello, World.</Text>;

export default App;
