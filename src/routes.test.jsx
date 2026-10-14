import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import api from './services/api';

vi.mock('./services/api', () => ({ default: { get: vi.fn() } }));

afterEach(() => { localStorage.clear(); window.history.replaceState({}, '', '/'); });

test('roteador real navega de favoritos para os detalhes e volta ao catálogo', async () => {
    localStorage.setItem('@primeflix', JSON.stringify([{ id: 42, title: 'Filme salvo' }]));
    window.history.replaceState({}, '', '/favoritos');
    api.get.mockResolvedValueOnce({ data: { id: 42, title: 'Detalhes do filme', backdrop_path: '/imagem.jpg' } });
    api.get.mockResolvedValueOnce({ data: { results: [{ id: 7, title: 'Filme do catálogo', poster_path: '/poster.jpg' }] } });
    render(<App />);
    expect(screen.getByRole('heading', { name: 'Meus filmes' })).toBeTruthy();
    fireEvent.click(screen.getByRole('link', { name: 'Ver detalhes' }));
    await screen.findByRole('heading', { name: 'Detalhes do filme' });
    expect(window.location.pathname).toBe('/filme/42');
    fireEvent.click(screen.getByRole('link', { name: 'Prime flix' }));
    await screen.findByText('Filme do catálogo');
    expect(window.location.pathname).toBe('/');
});
