import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useRouter } from "next/router";
import { useState } from "react";
import IonInput from "../components/IonInput";
import { auth, db } from "../firebase";
import useAuthUser from "../hooks/useAuthUser";

const login = () => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const router = useRouter();

	async function registerUser() {
		const familiesRef = collection(db, "families");

		const familyName = email?.split("@")[0];

		createUserWithEmailAndPassword(auth, email, password)
			.then((res) => {
				console.log("res", res);
				addDoc(familiesRef, { name: familyName })
					.then(() => {
						console.log("family added");
					})
					.catch((err) => {
						console.log("error adding family", err);
					});
			})
			.catch((err) => {
				console.log("err", err);
			});
	}

	function loginUser() {
		signInWithEmailAndPassword(auth, email, password)
			.then((res) => {
				console.log("res", res);
				router.push("/");
			})
			.catch((err) => {
				console.log("err", err);
			});
	}

	return (
		<ion-content class="ion-padding ">
			<ion-list lines="" class="ion-margin-bottom">
				<ion-list-header>
					<ion-label>Ingresa en tu cuenta familiar</ion-label>
				</ion-list-header>

				<ion-item>
					<ion-label position="stacked">Family Email</ion-label>
					<IonInput
						name="email"
						placeholder="lastname@gmail.com"
						onChange={(e) => setEmail(e.target.value)}
					/>
				</ion-item>

				<ion-item>
					<ion-label position="stacked">Password</ion-label>
					<IonInput
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Write your password"
						name="password"
					/>
				</ion-item>

				<ion-button expand="block" onClick={loginUser}>
					Sign In
				</ion-button>
			</ion-list>

			<ion-list lines="" class="ion-margin-top">
				<ion-list-header>
					<ion-label>Create a family account</ion-label>
				</ion-list-header>

				<ion-item>
					<ion-label position="stacked">Family Email</ion-label>
					<IonInput
						name="email"
						onChange={(e) => setEmail(e.target.value)}
						placeholder="lastname@gmail.com"
					/>
				</ion-item>

				<ion-item>
					<ion-label position="stacked">Password</ion-label>
					<IonInput
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Create a password"
						name="password"
					/>
				</ion-item>

				<ion-button
					fill="outline"
					expand="block"
					onClick={registerUser}
				>
					Sign Up
				</ion-button>
			</ion-list>
		</ion-content>
	);
};

export default login;
