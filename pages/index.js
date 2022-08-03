import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import IonSearchbar from "../components/IonSearchbar";
import { db } from "../firebase";
import useAuthUser from "../hooks/useAuthUser";
import useGlobalState from "../hooks/useGlobalState";

export default function Home() {
	const [search, setSearch] = useState("");
	const [members, setMembers] = useState([]);

	const router = useRouter();

	useAuthUser();

	const { userLogged } = useGlobalState();
	const familyName = userLogged?.email?.split("@")[0];
	const familiesRef = collection(db, "families");

	useEffect(() => {
		getDocs(familiesRef).then((res) => {
			res.docs.map((doc) => {
				if (doc.data().name === familyName) {
					setMembers(doc.data().members);
				}
			});
		});
	}, [userLogged]);

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>{familyName} Files</ion-title>

					<ion-buttons slot="end">
						<ion-button>Order By</ion-button>
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
					{members.map((member) => (
						<ion-item
							onClick={() =>
								router.push({
									pathname: "/member",
									query: {
										selectedMember: member,
										familyName,
									},
								})
							}
						>
							<ion-label>{member}</ion-label>{" "}
						</ion-item>
					))}
				</ion-list>

				<ion-fab vertical="bottom" horizontal="end">
					<ion-fab-button>Add</ion-fab-button>
				</ion-fab>
			</ion-content>
		</>
	);
}
