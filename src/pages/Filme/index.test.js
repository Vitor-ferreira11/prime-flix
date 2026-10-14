import { act, fireEvent, render, screen } from '@testing-library/react';
import Filme from './index';
import api from '../../services/api';
import { toast } from 'react-toastify';

let mockParams = { id: '1' };
const mockNavigate = jest.fn();
jest.mock('../../services/api', () => ({ get: jest.fn() }));
jest.mock('react-router-dom', () => ({
    useParams: () => mockParams,
    useNavigate: () => mockNavigate
}));
jest.mock('react-toastify', () => ({ toast: { error: jest.fn(), warn: jest.fn(), success: jest.fn() } }));
afterEach(() => { jest.restoreAllMocks(); localStorage.clear(); });

test('troca de filme cancela a chamada anterior e ignora resposta atrasada', async () => {
    mockParams = { id: '1' };
    let resolver;
    api.get.mockImplementationOnce(() => new Promise(resolve => { resolver = resolve; }));
    api.get.mockResolvedValueOnce({ data: { id: 2, title: 'Novo filme', backdrop_path: '/novo.jpg' } });
    const { rerender } = render(<Filme />);
    const signal = api.get.mock.calls[0][1].signal;
    mockParams = { id: '2' };
    rerender(<Filme />);
    expect(signal.aborted).toBe(true);
    await screen.findByRole('heading', { name: 'Novo filme' });
    await act(async () => resolver({ data: { id: 1, title: 'Filme antigo' } }));
    expect(screen.queryByText('Filme antigo')).toBeNull();
    expect(screen.getByRole('heading', { name: 'Novo filme' })).toBeTruthy();
    expect(mockNavigate).not.toHaveBeenCalled();
});

test('falha de armazenamento mostra erro e não anuncia sucesso', async () => {
    mockParams = { id: '1' };
    api.get.mockResolvedValueOnce({ data: { id: 1, title: 'Filme', backdrop_path: '/filme.jpg' } });
    render(<Filme />);
    await screen.findByRole('heading', { name: 'Filme' });
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('bloqueado'); });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar' }));
    expect(toast.error).toHaveBeenCalled();
    expect(toast.success).not.toHaveBeenCalled();
});
