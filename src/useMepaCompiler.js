import { useState, useEffect } from "react";
// Adjust the path to where you have the wasm-generated JS file
import init, { compile_code } from "./pkg/mepa_rs.js";

/**
 * Custom hook to initialize and use the MEPA-RS Wasm compiler.
 *
 * This hook manages the loading state of the WebAssembly module
 * and exposes the `compileCode` function to be used in your components.
 *
 * @returns {{
 * compileCode: ((code: string) => string) | null;
 * loading: boolean;
 * error: Error | null;
 * }} An object containing the compile function, loading state, and any initialization error.
 */
const useMepaCompiler = () => {
	const [compiler, setCompiler] = useState({ compileCode: null });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const initializeWasm = async () => {
			try {
				// Initialize the WebAssembly module
				await init();

				/**
				 * A wrapper around the Wasm function to handle potential errors during compilation.
				 *
				 * @param {string} code The code to be compiled.
				 * @returns {string} The result of the compilation as a JSON string.
				 */
				const compileCodeWrapper = (code) => {
					try {
						// Call the exported 'compile_code' function from Wasm
						return compile_code(code);
					} catch (e) {
						console.error("Error during compilation:", e);
						// Return a structured error message if compilation fails
						return JSON.stringify({
							mepa: { error: "Compilation failed inside Wasm." },
							optimized: {
								error: "Optimization failed due to compilation error.",
							},
						});
					}
				};

				setCompiler({ compileCode: compileCodeWrapper });
			} catch (err) {
				console.error("Failed to initialize Wasm module:", err);
				setError(
					err instanceof Error
						? err
						: new Error(
								"An unknown error occurred during Wasm initialization"
						  )
				);
			} finally {
				setLoading(false);
			}
		};

		initializeWasm();
	}, []); // The empty dependency array ensures this effect runs only once when the component mounts

	return { ...compiler, loading, error };
};

export default useMepaCompiler;
