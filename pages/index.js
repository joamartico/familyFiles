import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";
import { db, storage } from "../firebase";
import useAuthUser from "../hooks/useAuthUser";
import useGlobalState from "../hooks/useGlobalState";

export default function Home() {
	const [search, setSearch] = useState("");
	const [selectedFile, setSelectedFile] = useState();
	const [files, setFiles] = useState([]);
	const [members, setMembers] = useState([]);
	const [selectedMember, setSelectedMember] = useState();
	useAuthUser();

	const { userLogged } = useGlobalState();
	const familyName = userLogged?.email?.split("@")[0];
	const familyRef = ref(storage, familyName + "/" + selectedMember + "/");
	const familiesRef = collection(db, "families");

	function uploadFile() {
		if (!selectedFile) return;
		const fileRef = ref(storage, familyName + "/" + selectedMember + "/" + selectedFile.name);
		uploadBytes(fileRef, selectedFile)
			.then((snapshot) => {
				getDownloadURL(snapshot.ref).then((url) => {
					setFiles((prevFiles) => [...prevFiles, url]);
				});
				alert("uploaded");
			})
			.catch((err) => {
				console.log("error uploading", err);
			});
	}

	useEffect(() => {
		listAll(familyRef).then((res) => {
			res.items.forEach((item) => {
				getDownloadURL(item).then((url) => {
					setFiles((prevFiles) => [...prevFiles, url]);
				});
			});
		});

		getDocs(familiesRef).then((res) => {
			res.docs.map((doc) => {
				if (doc.data().name === familyName) {
					setMembers(doc.data().members);
				}
			});
		});
	}, [userLogged, selectedMember]);

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>{selectedMember || familyName} Files</ion-title>

					<ion-buttons slot="end">
						<ion-button>Order By</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content fullscreen>
				<ion-header collapse="condense" translucent>
					<ion-toolbar>
						<ion-title size="large">{selectedMember || familyName} Files</ion-title>
					</ion-toolbar>
					<ion-toolbar>
						<IonSearchbar
							value={search}
							onChange={(e) => setSearch(e.detail.value)}
							placeholder="Search"
						/>
					</ion-toolbar>
				</ion-header>

				{!selectedMember && (
					<ion-list>
						{members.map((member) => (
							<ion-item onClick={() => setSelectedMember(member)}>
								<ion-label>{member}</ion-label>{" "}
							</ion-item>
						))}
					</ion-list>
				)}

				{selectedMember && (
					<>
						<UploadFile>
							<ion-list-header>
								<h2>Upload a file</h2>
							</ion-list-header>

							<ion-list>
								<ion-item lines="none">
									<ion-label>
										<input
											slot="start"
											type="file"
											onChange={(e) =>
												setSelectedFile(
													e.target.files[0]
												)
											}
										/>
									</ion-label>

									{selectedFile && (
										<ion-button
											size="medium"
											slot="end"
											onClick={(e) => uploadFile()}
										>
											Upload
										</ion-button>
									)}
								</ion-item>
							</ion-list>
						</UploadFile>
						<ion-list>
							<ion-list-header>
								<h2>Files</h2>
							</ion-list-header>

							{files.map((url) => (
								<a href={url} target="_blank">
									<ion-item>
										<ion-thumbnail
											slot="start"
											style={{
												height: "100px",
												width: "100px",
											}}
										>
											<Img src={url} />
										</ion-thumbnail>

										<ion-label>
											<h3>{url.split("/").pop()}</h3>
											<p>{url}</p>
										</ion-label>
									</ion-item>
								</a>
							))}
						</ion-list>
					</>
				)}
			</ion-content>
		</>
	);
}

const Img = styled.img`
	height: 100%;
`;

const UploadFile = styled.div`
	margin-top: 30px;
	margin-bottom: 30px;
`;
