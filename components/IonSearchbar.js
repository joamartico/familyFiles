import { useEffect, useRef } from "react";

const IonSearchbar = (props) => {
	const ref = useRef();

	useEffect(() => {
		ref?.current?.addEventListener("ionChange", props.onChange);

		// cleanup this component
		return () => {
			ref?.current?.removeEventListener("ionChange", props.onChange);
		};
	}, []);

	return <ion-searchbar {...props} />;
};

export default IonSearchbar;
