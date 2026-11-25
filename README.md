# mepa-web

Interface web para o [mepa-rs](https://github.com/titoco3000/mepa-rs): compilador de IPT para MEPA, otimizador e máquina virtual MEPA, tudo rodando no navegador via WebAssembly.

**Disponível em:** <https://titoco3000.github.io/mepa-web/>.

## O que faz

- Compila código IPT para MEPA enquanto você digita.
- Mostra lado a lado o MEPA gerado e sua versão otimizada.
- Executa qualquer código MEPA passo a passo, exibindo a memória `M`, o registro de nível `D` e a saída.
- Permite baixar o código de cada painel.

A MEPA (Máquina de Execução para Pascal) é uma linguagem de pilha didática, definida por Tomasz Kowaltowski em *Implementação de Linguagens de Programação*. O botão ⓘ no site traz um resumo da máquina e a lista de instruções.

## Desenvolvimento

Requer Node.js.

```bash
npm install
npm run dev
```

Outros scripts:

| Comando           | Descrição                               |
| ----------------- | --------------------------------------- |
| `npm run build`   | gera o site estático em `dist/`         |
| `npm run preview` | serve o build localmente                |
| `npm run lint`    | roda o ESLint                           |
| `npm run deploy`  | faz o build e publica no GitHub Pages   |


## Atualizando o compilador

`src/pkg/` é gerado a partir do repositório [mepa-rs](https://github.com/titoco3000/mepa-rs) com [wasm-pack](https://rustwasm.github.io/wasm-pack/):

```bash
# no repositório mepa-rs
wasm-pack build --target web
# supondo-se que os repositórios estejam na mesma pasta
cp pkg/mepa_rs* pkg/package.json ../mepa-web/src/pkg/
```
