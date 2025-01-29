import transferService from '../services/TransferService';

// Mock de la fonction fetch
global.fetch = jest.fn();

describe('TransferService', () => {
    afterEach(() => {
        jest.clearAllMocks(); // Réinitialiser les mocks après chaque test
    });

    describe('rechercherSegments', () => {
        it('devrait retourner les segments lorsque la requête réussit', async () => {
            const mockResponse = [{ id: 1, name: 'Segment1' }, { id: 2, name: 'Segment2' }];
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const result = await transferService.rechercherSegments('France', 'Allemagne');

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/api/demandeTransfert/recherche?paysDepart=France&paysArrivee=Allemagne',
                { method: 'POST' }
            );
            expect(result).toEqual(mockResponse);
        });

        it('devrait lancer une erreur si la réponse du serveur n\'est pas OK', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                statusText: 'Internal Server Error',
            });

            await expect(transferService.rechercherSegments('France', 'Allemagne')).rejects.toThrow('Erreur lors de la recherche des segments: Internal Server Error');
        });

        it('devrait lancer une erreur en cas de problème réseau', async () => {
            fetch.mockRejectedValueOnce(new Error('Erreur réseau'));

            await expect(transferService.rechercherSegments('France', 'Allemagne')).rejects.toThrow('Erreur réseau');
        });
    });

    describe('enregistrerChaine', () => {
        it('devrait retourner les données lorsque la requête réussit', async () => {
            const mockResponse = { success: true };
            fetch.mockResolvedValueOnce({
                ok: true,
                json: jest.fn().mockResolvedValue(mockResponse),
            });

            const segmentsChoisis = [{ id: 1, name: 'Segment1' }, { id: 2, name: 'Segment2' }];
            const result = await transferService.enregistrerChaine(segmentsChoisis);

            expect(fetch).toHaveBeenCalledWith(
                'http://localhost:8080/api/demandeTransfert/enregistrer',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(segmentsChoisis),
                }
            );
            expect(result).toEqual(mockResponse);
        });

        it('devrait lancer une erreur si la réponse du serveur n\'est pas OK', async () => {
            fetch.mockResolvedValueOnce({
                ok: false,
                status: 400,
                json: jest.fn().mockResolvedValue({ message: 'Données invalides' }),
            });

            const segmentsChoisis = [{ id: 1, name: 'Segment1' }];

            await expect(transferService.enregistrerChaine(segmentsChoisis)).rejects.toThrow('Données invalides');
        });

        it('devrait lancer une erreur si les segmentsChoisis sont invalides', async () => {
            await expect(transferService.enregistrerChaine([])).rejects.toThrow("Aucun segment n'a été choisi.");
        });
    });
});
