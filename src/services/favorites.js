const key = '@primeflix';

export function lerFilmesSalvos() {
    try {
        const filmes = JSON.parse(localStorage.getItem(key));
        return Array.isArray(filmes) ? filmes.filter(filme =>
            filme && Number.isSafeInteger(filme.id) && filme.id > 0 && typeof filme.title === 'string'
        ) : [];
    } catch {
        return [];
    }
}

export function gravarFilmesSalvos(filmes) {
    try {
        localStorage.setItem(key, JSON.stringify(filmes));
        return true;
    } catch {
        return false;
    }
}
