import { useState, useEffect } from "react";
import mepaIcon from "../assets/mepa-icon.png";
import useMepaPack from "../useMepaPack";
import CodeEditor from "./CodeEditor";

const MepaCompilerUI = () => {
	const { compileCode, loading, error: initError } = useMepaPack();

	const [iptCode, setIptCode] = useState(
		"// Exemplo de programa em ipt\nfn main(){\n  int x[3];\n  ptr h;\n  h = x;\n  read(h[0]);\n  print(*x);\n  return 0;\n}"
	);
	const [mepaOutput, setMepaOutput] = useState("");
	const [optimizedOutput, setOptimizedOutput] = useState("");

	useEffect(() => {
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
		}, 1000);
		return () => clearTimeout(handler);
	}, [iptCode, compileCode]);

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
				<CodeEditor
					titulo="Editor IPT"
					tituloArquivo="code.ipt"
					type="ipt"
					value={iptCode}
					onChange={(value) => setIptCode(value)}
				/>
				<CodeEditor
					titulo="MEPA"
					tituloArquivo="code.mepa"
					value={mepaOutput}
					onChange={(value) => setMepaOutput(value)}
				/>
				<CodeEditor
					titulo="MEPA otimizado"
					tituloArquivo="otimizado.mepa"
					value={optimizedOutput}
				/>
			</div>
		</div>
	);
};

export default MepaCompilerUI;
