import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './index';
import api from '../../services/api';

vi.mock('../../services/api', () => ({ default: { get: vi.fn() } }));
// Testes da Home isolam o roteador; navegação real deve ter teste de integração.
vi.mock('react-router-dom', () => ({
    Link: ({ to, children }) => <a href={to}>{children}</a>
}));

test('informa falha da API e encerra carregamento', async () => {
    api.get.mockRejectedValueOnce(new Error('offline'));
    render(<Home />);
    expect((await screen.findByRole('alert')).textContent).toContain('Não foi possível');
    expect(screen.queryByText('Carregando filmes...')).toBeNull();
});

test('mostra filme e link de detalhes após resposta', async () => {
    api.get.mockResolvedValueOnce({ data: { results: [{ id: 42, title: 'Filme teste', poster_path: '/poster.jpg' }] } });
    render(<Home />);
    await screen.findByText('Filme teste');
    expect(screen.getByRole('link', { name: 'Acessar' }).getAttribute('href')).toBe('/filme/42');
    expect(screen.queryByText('Carregando filmes...')).toBeNull();
});
