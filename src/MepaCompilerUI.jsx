import { useState, useEffect } from "react";
import mepaIcon from "./assets/mepa-icon.png";
import useMepaCompiler from "./useMepaCompiler";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { EditorView, lineNumbers } from "@codemirror/view";
import { IoMdDownload } from "react-icons/io";

const MepaCompilerUI = () => {
	const { compileCode, loading, error: initError } = useMepaCompiler();

	const [iptCode, setIptCode] = useState(
		"// Exemplo de programa em ipt.\n// Experimente usar funções\n// (declaradas com fn, com um return no final),\n// ponteiros (com o tipo ptr) e arrays!\nfn main(){\n  int n, x[8];\n  n = 3;\n  read(x[n]);\n  print(x[n]);\n}"
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

	const downloadFile = (content, filename) => {
		const blob = new Blob([content], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const editorExtensions = [
		javascript(),
		keymap.of([indentWithTab]),
		EditorView.lineWrapping,
		EditorView.editable.of(true),
		// lineNumbers({
		// 	formatNumber: (n) => (n).toString(), // Start numbering at 0
		// }),
	];

	const readOnlyExtensions = [
		javascript(),
		EditorView.lineWrapping,
		EditorView.editable.of(false),
		lineNumbers({
			formatNumber: (n) => (n - 1).toString(),
		}),
	];

	return (
		<div className="container">
			<header className="mainHeader">
				<img src={mepaIcon} alt="mepa icon" className="mepaIcon" />
			</header>
			<div className="main">
				<div className="column">
					<header>
						<h1>Editor IPT</h1>
						<button
							className="downloadButton"
							onClick={() => downloadFile(iptCode, "code.ipt")}
						>
							<IoMdDownload />
						</button>
					</header>
					<CodeMirror
						value={iptCode}
						height="100%"
						extensions={editorExtensions}
						onChange={(value) => setIptCode(value)}
						theme="dark"
						basicSetup={{
							closeBrackets: true, // auto-closing brackets
						}}
						className="columnValueHolder"
					/>
				</div>
				<div className="column">
					<header>
						<h1>MEPA</h1>
						<button
							className="downloadButton"
							onClick={() =>
								downloadFile(mepaOutput, "code.mepa")
							}
						>
							<IoMdDownload />
						</button>
					</header>
					<CodeMirror
						height="100%"
						value={mepaOutput}
						extensions={readOnlyExtensions}
						theme="dark"
						editable={false}
						className="columnValueHolder"
					/>
				</div>
				<div className="column">
					<header>
						<h1>MEPA otimizado</h1>
						<button
							className="downloadButton"
							onClick={() =>
								downloadFile(optimizedOutput, "otimizado.mepa")
							}
						>
							<IoMdDownload />
						</button>
					</header>
					<CodeMirror
						height="100%"
						value={optimizedOutput}
						extensions={readOnlyExtensions}
						theme="dark"
						editable={false}
						className="columnValueHolder"
					/>
				</div>
			</div>
		</div>
	);
};

export default MepaCompilerUI;
