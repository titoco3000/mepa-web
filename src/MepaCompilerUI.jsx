import { useState, useEffect } from "react";
import mepaIcon from "./assets/mepa-icon.png";
// Adjust the path to your custom hook
import useMepaCompiler from "./useMepaCompiler";

const MepaCompilerUI = () => {
	// 1. Initialize the Wasm compiler hook
	const { compileCode, loading, error: initError } = useMepaCompiler();

	const [iptCode, setIptCode] = useState(
		"fn  main(){\n    int x[8];\n    read(x[3]);\n    print(x[3]);\n}"
	);
	const [mepaOutput, setMepaOutput] = useState("");
	const [optimizedOutput, setOptimizedOutput] = useState("");

	// 3. Debounce effect for compilation
	useEffect(() => {
		// Don't do anything if the compiler is not ready or the input is empty
		if (!compileCode || !iptCode.trim()) {
			setMepaOutput("");
			setOptimizedOutput("");
			return;
		}

		const handler = setTimeout(() => {
			console.log("Compiling...");
			const resultString = compileCode(iptCode);
			try {
				const result = JSON.parse(resultString);
				console.log(result);

				setMepaOutput(
					result.mepa
						? result.mepa.Ok
							? result.mepa.Ok
							: result.mepa.Err
						: ""
				);

				setOptimizedOutput(
					result.optimized
						? result.optimized.Ok
							? result.optimized.Ok
							: result.optimized.Err
						: ""
				);
			} catch (e) {
				console.error("Failed to parse compiler output:", e);
				setMepaOutput("Error: Failed to parse compiler output.");
				setOptimizedOutput("Error: Failed to parse compiler output.");
			}
		}, 1000); // 2-second delay

		// Cleanup function: clear the timer if the user types again
		return () => {
			clearTimeout(handler);
		};
	}, [iptCode, compileCode]); // Rerun this effect if input or compiler changes

	// Handle Wasm module loading and initialization errors
	if (loading) {
		return <div>Initializing WebAssembly Compiler...</div>;
	}

	if (initError) {
		return (
			<div style={{ color: "red" }}>
				Fatal Error: Could not initialize compiler: {initError.message}
			</div>
		);
	}

	return (
		<div className="container">
			<header className="mainHeader">
				<img src={mepaIcon} alt="mepa icon" className="mepaIcon" />
			</header>
			<div className="main">
				<div className="column">
					<header>
						<h1>Editor IPT</h1>
					</header>
					<textarea
						className="columnValueHolder"
						value={iptCode}
						onChange={(e) => setIptCode(e.target.value)}
						placeholder="Código IPT aqui"
						spellCheck="false"
					/>
				</div>
				<div className="column">
					<header>
						<h1>MEPA</h1>
					</header>
					<textarea
						className="columnValueHolder"
						value={mepaOutput}
						readOnly
					/>
				</div>
				<div className="column">
					<header>
						<h1>MEPA otimizado</h1>
					</header>
					<textarea
						className="columnValueHolder"
						value={optimizedOutput}
						readOnly
					/>
				</div>
			</div>
		</div>
	);
};

export default MepaCompilerUI;
