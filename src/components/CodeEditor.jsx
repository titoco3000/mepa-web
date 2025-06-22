import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { EditorView, lineNumbers } from "@codemirror/view";
import { IoMdDownload } from "react-icons/io";
import { SiCompilerexplorer } from "react-icons/si";
import { IoClose } from "react-icons/io5";
import MepaMachineComponent from "./MepaMachineComponent";

import { useState } from "react";

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

const CodeEditor = ({
	value = "",
	type = "mepa",
	titulo = "Editor",
	tituloArquivo = "file.mepa",
	editable = true,
	onChange = () => {},
}) => {
	const [executing, setExecuting] = useState(false);

	const editorExtensions =
		type == "mepa"
			? [
					javascript(),
					EditorView.editable.of(editable),
					lineNumbers({
						formatNumber: (n) => (n - 1).toString(),
					}),
			  ]
			: [
					javascript(),
					keymap.of([indentWithTab]),
					EditorView.lineWrapping,
					EditorView.editable.of(editable),
			  ];

	return (
		<div className="column">
			<header>
				<h1>{titulo}</h1>
				<div className="codeBoxControls">
					{executing ? (
						<button
							title="encerrar"
							className="stopExecutionButton"
							onClick={() => setExecuting(false)}
						>
							<IoClose />
						</button>
					) : (
						<>
							{type == "mepa" && (
								<button
									title="executar"
									className="executeButton"
									onClick={() => setExecuting(true)}
								>
									<SiCompilerexplorer />
								</button>
							)}
							<button
								title="download"
								className="downloadButton"
								onClick={() =>
									downloadFile(value, tituloArquivo)
								}
							>
								<IoMdDownload />
							</button>
						</>
					)}
				</div>
			</header>
			<div className="CodeContainer">
				{executing ? (
					<MepaMachineComponent mepaCode={value} />
				) : (
					<div className="ScrollBox">
						<CodeMirror
							value={value}
							height="100%"
							extensions={editorExtensions}
							onChange={onChange}
							theme="dark"
							basicSetup={{
								closeBrackets: true,
							}}
							className="columnValueHolder"
						/>
					</div>
				)}
			</div>
		</div>
	);
};

export default CodeEditor;
