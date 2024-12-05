import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<h1>Upload CSV File</h1>
				<input
					type="file"
					accept=".csv"
					onChange={async (e) => {
						const file = e.target.files[0];
						if (file) {
							const formData = new FormData();
							formData.append("file", file);

							const response = await fetch("/upload", {
								method: "POST",
								body: formData,
							});

							if (response.ok) {
								alert("File uploaded successfully");
							} else {
								alert("File upload failed");
							}
						}
					}}
				/>
			</div>
		</>
	);
}

export default App;
