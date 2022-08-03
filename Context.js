import { useState, createContext } from "react";

export const Context = createContext();

const ContextComponent = (props) => {
	const [userLogged, setUserLogged] = useState(false);

	return (
		<Context.Provider
			value={{
				userLogged,
				setUserLogged,
			}}
		>
			{props.children}
		</Context.Provider>
	);
};

export default ContextComponent;
