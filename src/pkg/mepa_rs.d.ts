/* tslint:disable */
/* eslint-disable */
/**
 * @param {string} input
 * @returns {string}
 */
export function compile_code(input: string): string;
export class MepaMachine {
  free(): void;
  /**
   * @param {string} input
   */
  constructor(input: string);
  /**
   * Call this after `new` to check why it failed
   * @returns {string | undefined}
   */
  get_error(): string | undefined;
  /**
   * @param {number | undefined} [input]
   * @returns {any}
   */
  step(input?: number): any;
  /**
   * @returns {any}
   */
  get_state(): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly compile_code: (a: number, b: number) => Array;
  readonly __wbg_mepamachine_free: (a: number, b: number) => void;
  readonly mepamachine_new: (a: number, b: number) => number;
  readonly mepamachine_get_error: (a: number) => Array;
  readonly mepamachine_step: (a: number, b: number, c: number) => Array;
  readonly mepamachine_get_state: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_export_2: WebAssembly.Table;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
