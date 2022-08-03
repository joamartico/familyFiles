import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import useGlobalState from "./useGlobalState";

const useAuthUser = () => {
	const { userLogged, setUserLogged } = useGlobalState();

	const router = useRouter();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (!user) {
				setUserLogged(false);
				router.push("/login");
			} else {
				console.log("user", user);
				setUserLogged(user);
				if (router.pathname == "/login") {
					router.push("/");
				}
			}
		});

		// return () => unsubscribe()
	}, []);
};

export default useAuthUser;
