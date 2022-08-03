import {
	addDoc,
	collection,
	doc,
	getDoc,
	getDocs,
	updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import IonInput from "../components/IonInput";
import IonSearchbar from "../components/IonSearchbar";
import { db } from "../firebase";
import useAuthUser from "../hooks/useAuthUser";
import useGlobalState from "../hooks/useGlobalState";

export default function Home() {
	const [search, setSearch] = useState("");
	const [members, setMembers] = useState([]);
	const [familyId, setFamilyId] = useState();
	const [editing, setEditing] = useState(false);
	const [newMembers, setNewMembers] = useState([]);

	const { userLogged } = useGlobalState();
	const router = useRouter();
	useAuthUser();

	const familyName = userLogged?.email?.split("@")[0];
	const familiesRef = collection(db, "families");

	const newMembs = [...members];


	useEffect(() => {
		getDocs(familiesRef).then((res) => {
			res.docs.map((doc) => {
				if (doc.data().name === familyName) {
					setMembers(doc.data().members);
					setFamilyId(doc.id);
				}
			});
		});
	}, [userLogged, editing]);

	function onAddMember() {
		const familyRef = doc(familiesRef, familyId);
		updateDoc(familyRef, {
			members: [...members, "New Member"],
		})
			.then(() => {
				console.log("member added");
			})
			.catch((err) => {
				console.log("error adding member", err);
			});
		setMembers([...newMembers, "New Member"]);
		setNewMembers([...newMembers, "New Member"]);
	}

	function onUpdateMembers(members) {
		if (members.length == 0) return;
		const familyRef = doc(familiesRef, familyId);
		console.log("familyRef", familiesRef);
		updateDoc(familyRef, {
			members,
		})
			.then(() => {
				console.log("member updated");
			})
			.catch((err) => {
				console.log("error updating member", err);
			});
	}

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>{familyName} Files</ion-title>

					<ion-buttons slot="end">
						<ion-button
							onClick={() => {
								onUpdateMembers(newMembers);
								setEditing((prev) => !prev);
							}}
						>
							{editing ? "Done" : "Edit"}
						</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense" translucent>
					<ion-toolbar>
						<ion-title size="large">{familyName} Files</ion-title>
					</ion-toolbar>
					<ion-toolbar>
						<IonSearchbar
							value={search}
							onChange={(e) => setSearch(e.detail.value)}
							placeholder="Search"
						/>
					</ion-toolbar>
				</ion-header>

				<ion-list>
					{members.map((member, i) => (
						<ion-item
							onClick={() => {
								if (!editing) {
									router.push({
										pathname: "/member",
										query: {
											selectedMember: member,
											familyName,
										},
									});
								}
							}}
						>
							{/* <ion-label>{member}</ion-label>{" "} */}
							<IonInput
								onChange={(e) => {
									newMembs[i] = e.detail.value;
									console.log("newMembers", newMembs);
									setNewMembers(newMembs);
									// onUpdateMembers(newMembers);
									// updateDoc(familyRef, {
									// 	members: newMembers,
									// })
									// 	.then(() => {
									// 		console.log("member updated");
									// 	})
									// 	.catch((err) => {
									// 		console.log(
									// 			"error updating member",
									// 			err
									// 		);
									// 	});
								}}
								value={member}
							/>
						</ion-item>
					))}
				</ion-list>

				<ion-fab vertical="bottom" horizontal="end">
					<ion-fab-button onClick={onAddMember}>Add</ion-fab-button>
				</ion-fab>
			</ion-content>
		</>
	);
}
