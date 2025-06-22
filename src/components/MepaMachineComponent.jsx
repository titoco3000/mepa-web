import { useEffect, useRef, useState } from "react";
import useMepaPack from "../useMepaPack";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import {
	EditorView,
	lineNumbers,
	Decoration,
	ViewPlugin,
} from "@codemirror/view";
import { IoMdSend } from "react-icons/io";
import { VscDebugStepOver } from "react-icons/vsc";
import { FaPlay, FaPause } from "react-icons/fa6";
import { RangeSetBuilder } from "@codemirror/state";

const highlightLine = (lineNumber) =>
	ViewPlugin.fromClass(
		class {
			constructor(view) {
				this.decorations = this.createDecoration(view);
			}
			update(update) {
				if (
					update.docChanged ||
					update.viewportChanged ||
					update.transactions.length
				) {
					this.decorations = this.createDecoration(update.view);
				}
			}
			createDecoration(view) {
				const builder = new RangeSetBuilder();
				const line = view.state.doc.line(lineNumber + 1);
				builder.add(
					line.from,
					line.from,
					Decoration.line({ class: "cm-current-line" })
				);

				// Scroll to this line
				setTimeout(() => {
					view.dispatch({
						effects: EditorView.scrollIntoView(line.from, {
							y: "center",
						}),
					});
				}, 0); // Delay to avoid conflict with layout pass

				return builder.finish();
			}
		},
		{
			decorations: (v) => v.decorations,
		}
	);

const MepaMachineComponent = ({ mepaCode }) => {
	const { error: initError, MepaMachine } = useMepaPack();
	const machineRef = useRef(null);
	const [M, setM] = useState([]);
	const [s, setS] = useState(0);
	const [D, setD] = useState([]);
	const [output, setOutput] = useState([]);
	const [waitingForInput, setWaitingForInput] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [isRunning, setIsRunning] = useState(false);
	const runInterval = useRef(null);
	const inputRef = useRef(null);

	// Immutable MEPA code
	const frozenMepaCode = useRef(mepaCode);

	const [currentLine, setCurrentLine] = useState(0);
	const [editorExtensions, setEditorExtensions] = useState([]);

	useEffect(() => {
		const extensions = [
			javascript(),
			EditorView.editable.of(false),
			lineNumbers({
				formatNumber: (n) => (n - 1).toString(),
			}),
		];
		if (currentLine !== null) {
			extensions.push(highlightLine(currentLine));
		}
		setEditorExtensions(extensions);
	}, [currentLine]);

	useEffect(() => {
		try {
			const machine = new MepaMachine(frozenMepaCode.current);
			machineRef.current = machine;
			updateState(machine);
		} catch (error) {
			console.error("Failed to initialize MEPA machine:", error);
		}
	}, []);

	const updateState = (machine) => {
		const state = machine.get_state();
		setM([...state.m]);
		setD([...state.d]);
		setCurrentLine(state.i);
		setS(state.s);
	};

	const handleStep = (input = null) => {
		if (!machineRef.current) return;
		try {
			const result = machineRef.current.step(input);
			if (typeof result === "number") {
				setOutput((prev) => [...prev, result]);
			}
			updateState(machineRef.current);
			setWaitingForInput(false);
		} catch (err) {
			if (err.MissingInput != undefined) {
				inputRef.current.focus();
				setWaitingForInput(true);
			} else {
				console.error("Step error:", err);
				stopRunLoop();
			}
		}
	};

	const startRunLoop = () => {
		if (isRunning || !machineRef.current) return;
		setIsRunning(true);
		runInterval.current = setInterval(() => {
			const error = machineRef.current.get_error();
			if (error) {
				console.warn("Runtime error:", error);
				stopRunLoop();
				return;
			}
			handleStep(null);
		}, 300);
	};

	const stopRunLoop = () => {
		setIsRunning(false);
		if (runInterval.current) {
			clearInterval(runInterval.current);
			runInterval.current = null;
		}
	};

	const toggleRun = () => {
		isRunning ? stopRunLoop() : startRunLoop();
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		const input = parseInt(inputValue, 10);
		if (!isNaN(input)) {
			handleStep(input);
			setInputValue("");
		}
	};

	return (
		<div className="MepaMachine">
			<CodeMirror
				value={frozenMepaCode.current}
				height="100%"
				extensions={editorExtensions}
				theme="dark"
				basicSetup={{ closeBrackets: true }}
				className="MepaMachineCodeViewer"
			/>
			<div className="MepaMachineColumn">
				<form className="MepaMachineInputForm" onSubmit={handleSubmit}>
					<div
						className={`MepaMachineFlowButtons${
							waitingForInput ? " MepaMachineDisabledInput" : ""
						}`}
					>
						<button
							type="button"
							title="Dar passo"
							onClick={() => handleStep(null)}
						>
							<VscDebugStepOver />
						</button>
						<button
							type="button"
							title={isRunning ? "Pausar" : "Executar"}
							onClick={toggleRun}
						>
							{isRunning ? <FaPause /> : <FaPlay />}
						</button>
					</div>
					<div
						className={`MepaMachineNumberInput${
							waitingForInput ? "" : " MepaMachineDisabledInput"
						}`}
					>
						<input
							type="number"
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							ref={inputRef}
						/>
						<button type="submit" title="Enviar input">
							<IoMdSend />
						</button>
					</div>
				</form>

				<div className="MepaMachineData">
					<div className="MepaMachineDataColumn">
						<div className="MepaMachineDataTable">
							<h3>M</h3>
							{M.map((v, i) => (
								<p
									key={`m-${i}`}
									className={
										i > s
											? "MepaMachineOutOfBoundsMemory"
											: ""
									}
								>
									{v}
								</p>
							))}
						</div>
					</div>
					<div className="MepaMachineDataColumn">
						<div className="MepaMachineDataTable">
							<h3>D</h3>
							{D.map((v, i) => (
								<p key={`d-${i}`}>{v}</p>
							))}
						</div>
						{output.length > 0 && (
							<div className="MepaMachineOutputBox">
								<h3>OUTPUT</h3>
								{output.map((v, i) => (
									<p key={`out-${i}`}>{v}</p>
								))}
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MepaMachineComponent;
