import { useState, useEffect } from "react";
import init, { compile_code, MepaMachine } from "./pkg/mepa_rs.js";

const useMepaPack = () => {
	const [compiler, setCompiler] = useState({ compileCode: null });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const initializeWasm = async () => {
			try {
				// Inicia modulo WebAssembly
				await init();

				const compileCodeWrapper = (code) => {
					try {
						return compile_code(code);
					} catch (e) {
						console.error("Erro de compilação:", e);
						return JSON.stringify({
							mepa: { error: "Erro de compilação" },
							optimized: {
								error: "Otimização falhou por erro de compilação",
							},
						});
					}
				};

				setCompiler({ compileCode: compileCodeWrapper });
			} catch (err) {
				console.error("Falha ao iniciar modulo WASM:", err);
				setError(
					err instanceof Error ? err : new Error("Erro desconhecido")
				);
			} finally {
				setLoading(false);
			}
		};

		initializeWasm();
	}, []); // Dependency array vazio faz com que a função rode só uma vez, quando o componente é montado

	return { ...compiler, loading, error, MepaMachine };
};

export default useMepaPack;
