import { useEffect } from 'react';
import { X } from 'lucide-react';

const TCC_PDF_URL = `https://titoco.dev/docs/tcc-mepa.pdf`;

// [código, argumentos, descrição, efeito]
const GRUPOS = [
  [
    'Gerenciamento de Memória',
    [
      ['CRCT', 'k', 'carrega constante', 's+=1; M[s]=k'],
      ['CRVL', 'm n', 'carrega valor', 's+=1; M[s]=M[D[m]+n]'],
      ['CREN', 'm n', 'carrega endereço', 's+=1; M[s]=D[m]+n'],
      ['ARMZ', 'm n', 'armazena', 'M[D[m]+n]=M[s]; s-=1'],
      ['CRVI', 'm n', 'carrega indiretamente', 's+=1; M[s]=M[M[D[m]+n]]'],
      ['ARMI', 'm n', 'armazena indiretamente', 'M[M[D[m]+n]]=M[s]; s-=1'],
      ['AMEM', 'n', 'aloca memória', 's+=n'],
      ['DMEM', 'n', 'desaloca memória', 's-=n'],
    ],
  ],
  [
    'Lógica e Aritmética',
    [
      ['SOMA', '', 'soma', 'M[s-1] += M[s]; s-=1'],
      ['SUBT', '', 'subtrai', 'M[s-1] -= M[s]; s-=1'],
      ['MULT', '', 'multiplica', 'M[s-1] *= M[s]; s-=1'],
      ['DIVI', '', 'divide', 'M[s-1] /= M[s]; s-=1'],
      ['INVR', '', 'inverte o sinal', 'M[s] = -M[s]'],
      ['CONJ', '', 'e', 'M[s-1] = M[s-1] && M[s]; s-=1'],
      ['DISJ', '', 'ou', 'M[s-1] = M[s-1] || M[s]; s-=1'],
      ['NEGA', '', 'não', 'M[s] = 1-M[s]'],
    ],
  ],
  [
    'Comparação',
    [
      ['CMME', '', 'menor', 'M[s-1] = M[s-1] < M[s]; s-=1'],
      ['CMMA', '', 'maior', 'M[s-1] = M[s-1] > M[s]; s-=1'],
      ['CMIG', '', 'igual', 'M[s-1] = M[s-1] == M[s]; s-=1'],
      ['CMDG', '', 'diferente', 'M[s-1] = M[s-1] != M[s]; s-=1'],
      ['CMEG', '', 'menor ou igual', 'M[s-1] = M[s-1] <= M[s]; s-=1'],
      ['CMAG', '', 'maior ou igual', 'M[s-1] = M[s-1] >= M[s]; s-=1'],
    ],
  ],
  [
    'Desvios',
    [
      ['DSVS', 'p', 'desvia sempre', 'i=p'],
      ['DSVF', 'p', 'desvia se falso', 'se M[s]==0: i=p; s-=1'],
    ],
  ],
  [
    'Entrada e saída',
    [
      ['LEIT', '', 'lê um valor', 's+=1; M[s]=entrada'],
      ['IMPR', '', 'imprime', 'imprime M[s]; s-=1'],
    ],
  ],
  [
    'Procedimentos',
    [
      ['CHPR', 'p', 'chama', 's+=1; M[s]=i+1; i=p'],
      ['ENPR', 'k', 'entra', 's+=1; M[s]=D[k]; D[k]=s+1'],
      ['RTPR', 'k n', 'retorna', 'D[k]=M[s]; i=M[s-1]; s-=n+2'],
    ],
  ],
  [
    'Marcadores',
    [
      ['INPP', '', 'inicia o programa', 's=-1; D[0]=0'],
      ['NADA', '', 'não faz nada', '—'],
      ['PARA', '', 'encerra o programa', '—'],
    ],
  ],
];

const AboutModal = ({ onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className='aboutOverlay' onClick={onClose}>
      <div
        className='aboutModal'
        role='dialog'
        aria-modal='true'
        aria-label='Sobre'
        onClick={(e) => e.stopPropagation()}
      >
        <button className='aboutClose' title='fechar' onClick={onClose}>
          <X size={18} />
        </button>

        <p className='aboutLead'>
          Compilador de IPT para MEPA e máquina virtual MEPA, rodando no
          navegador.
        </p>
        <p>
          O código IPT digitado à esquerda é compilado para MEPA e otimizado.
          Qualquer painel MEPA pode ser executado passo a passo, mostrando a
          memória e a saída a cada instrução.
        </p>

        <h3>MEPA</h3>
        <p>
          A Máquina de Execução para Pascal é uma linguagem de pilha didática,
          criada por Tomasz Kowaltowski em{' '}
          <em>Implementação de Linguagens de Programação</em>. Só trabalha com
          inteiros.
        </p>
        <dl className='aboutRegs'>
          <dt>M</dt>
          <dd>memória (pilha)</dd>
          <dt>D</dt>
          <dd>registro de nível, usado por procedimentos</dd>
          <dt>i</dt>
          <dd>próxima instrução</dd>
          <dt>s</dt>
          <dd>topo da pilha em M</dd>
        </dl>
        <p>
          Procedimentos podem ser recursivos, mas não aninhados. Funções são
          simuladas com uma variável de retorno. Desvios e chamadas aceitam
          endereço ou rótulo.
        </p>

        <details>
          <summary>Instruções</summary>
          <table className='aboutTable'>
            {GRUPOS.map(([grupo, instrucoes]) => (
              <tbody key={grupo}>
                <tr>
                  <th colSpan={3}>{grupo}</th>
                </tr>
                {instrucoes.map(([cod, args, desc, efeito]) => (
                  <tr key={cod}>
                    <td className='aboutCode'>
                      {cod} <span>{args}</span>
                    </td>
                    <td>{desc}</td>
                    <td className='aboutEffect'>{efeito}</td>
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </details>

        <a
          className='aboutPdf'
          href={TCC_PDF_URL}
          target='_blank'
          rel='noreferrer'
        >
          Ler o TCC (PDF)
        </a>
      </div>
    </div>
  );
};

export default AboutModal;
