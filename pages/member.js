import {
	deleteObject,
	getDownloadURL,
	listAll,
	ref,
	uploadBytes,
} from "firebase/storage";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import IonSearchbar from "../components/IonSearchbar";
import { storage } from "../firebase";

const member = () => {
	const [selectedFile, setSelectedFile] = useState();
	const [files, setFiles] = useState([]);

	const inputFileRef = useRef()

	const router = useRouter();

	const familyName = router.query.familyName;
	const selectedMember = router.query.selectedMember;

	const familyRef = ref(storage, familyName + "/" + selectedMember + "/");

	useEffect(() => {
		listAll(familyRef).then((res) => {
			res.items.forEach((item) => {
				console.log("item", item);
				getDownloadURL(item).then((url) => {
					setFiles((prevFiles) => [
						...prevFiles,
						{ url, name: item.name },
					]);
				});
			});
		});
	}, [familyName, selectedMember]);

	function uploadFile() {
		if (!selectedFile) return;
		const fileRef = ref(
			storage,
			familyName + "/" + selectedMember + "/" + selectedFile.name
		);
		uploadBytes(fileRef, selectedFile)
			.then((snapshot) => {
				getDownloadURL(snapshot.ref).then((url) => {
					setFiles((prevFiles) => [...prevFiles, {url, name: selectedFile.name}]);
					setSelectedFile()
					inputFileRef.current.value = null
				});
				// alert("uploaded");
			})
			.catch((err) => {
				console.log("error uploading", err);
			});
	}

	function deleteFile(name) {
		const fileRef = ref(storage, familyName + "/" + selectedMember + "/" + name)
		deleteObject(fileRef)
			.then(() => {
				console.log("deleted")
				setFiles((prevFiles) => prevFiles.filter((file) => file.name !== name));
			})
			.catch((error) => {
				console.log("error", error)
			});
	}

	return (
		<>
			<ion-header translucent>
				<ion-toolbar>
					<ion-title>{selectedMember} Files</ion-title>

					<ion-buttons slot="start" onClick={() => router.push("/")}>
						<ion-button>Back</ion-button>
					</ion-buttons>
				</ion-toolbar>
			</ion-header>

			<ion-content >
				<ion-header collapse="condense" translucent>
					<ion-toolbar>
						<ion-title size="large">
							{selectedMember} Files
						</ion-title>
					</ion-toolbar>
					<ion-toolbar>
						<IonSearchbar
							// value={search}
							// onChange={(e) => setSearch(e.detail.value)}
							placeholder="Search"
						/>
					</ion-toolbar>
				</ion-header>

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
										setSelectedFile(e.target.files[0])
									}
									ref={inputFileRef}

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

					{files.map((file) => (
						<ion-item-sliding>
							<a href={file.url} target="_blank">
								<ion-item>
									<ion-thumbnail
										slot="start"
										style={{
											height: "100px",
											width: "100px",
										}}
									>
										<Img src={file.url} />
									</ion-thumbnail>

									<ion-label>
										{/* <h3>{url.split("/").pop()}</h3> */}
										<h3>{file.name}</h3>
										{/* <p>{url}</p> */}
									</ion-label>
								</ion-item>
							</a>

							<ion-item-options side="end">
								<ion-item-option onClick={() => deleteFile(file.name)} color="danger">
									Delete
								</ion-item-option>
							</ion-item-options>
						</ion-item-sliding>
					))}
				</ion-list>
			</ion-content>
		</>
	);
};

export default member;

const Img = styled.img`
	height: 100%;
`;

const UploadFile = styled.div`
	margin-top: 30px;
	margin-bottom: 30px;
`;
