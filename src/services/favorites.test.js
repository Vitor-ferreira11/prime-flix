import { vi } from 'vitest';
import { lerFilmesSalvos, gravarFilmesSalvos } from './favorites';

afterEach(() => { vi.restoreAllMocks(); localStorage.clear(); });

test('mantém filmes válidos e rejeita JSON ou formatos inválidos', () => {
    for (const dados of ['{', '{}', 'null', '123']) {
        localStorage.setItem('@primeflix', dados);
        expect(lerFilmesSalvos()).toEqual([]);
    }
    localStorage.setItem('@primeflix', JSON.stringify([null, {}, { id: 1, title: 'Filme' }, { id: -1, title: 'Inválido' }]));
    expect(lerFilmesSalvos()).toEqual([{ id: 1, title: 'Filme' }]);
});

test('tolera bloqueio ao ler e sinaliza falha ao gravar', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('bloqueado'); });
    expect(lerFilmesSalvos()).toEqual([]);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('sem espaço'); });
    expect(gravarFilmesSalvos([{ id: 1, title: 'Filme' }])).toBe(false);
});

test('persiste e recupera a lista', () => {
    expect(gravarFilmesSalvos([{ id: 1, title: 'Filme' }])).toBe(true);
    expect(lerFilmesSalvos()).toEqual([{ id: 1, title: 'Filme' }]);
});
