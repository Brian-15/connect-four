describe('makeBoard()', () => {
    beforeAll(makeBoard);
    it('should create a board matrix filled with null values', () => {
        expect(board.every(arr => arr.every(element => element === null))).toBe(true);
    });

    it('should create a board matrix of HEIGHT x WIDTH dimensions', () => {
        expect(board.length).toBe(HEIGHT);
        expect(board.every(arr => arr.length === WIDTH)).toBe(true);
    });

    afterAll(makeBoard);
});

// describe('makeHtmlBoard()', () => {
//     it('should crea')
// });

describe('findSpotForCol(x)', () => {

    beforeEach(makeBoard);

    it('should return top empty y coordinate given column x', () => {
        expect(findSpotForCol(0)).toBe(5);
        expect(findSpotForCol(1)).toBe(5);
        expect(findSpotForCol(2)).toBe(5);
        expect(findSpotForCol(3)).toBe(5);
    });

    it('should return null if column x is full', () => {
        board.forEach(row => row[0] = 2);
        expect(findSpotForCol(0)).toBe(null);
    });

    it('should throw an error if input is out of bounds or negative', () => {
        expect(() => findSpotForCol(-1)).toThrowError();
        expect(() => findSpotForCol(100)).toThrowError();
    });

    afterEach(() => board.splice(0, board.length));
});

describe('placeInTable(y, x)', () => {

    it('should update DOM by placing a piece into the table', () => {
        placeInTable(0, 0);
        const place = document.getElementById(`${0}-${0}`);
        expect(place.firstChild.classList.contains('piece')).toBe(true);
        place.firstChild.remove();
    });

    it('should throw an error if invalid coordinates are given', () => {
        expect(() => placeInTable(-1, 0)).toThrowError();
        expect(() => placeInTable(0, -1)).toThrowError();
        expect(() => placeInTable(-1, -1)).toThrowError();
        expect(() => placeInTable(200, 0)).toThrowError();
        expect(() => placeInTable(0, 200)).toThrowError();
    });

});

describe('endGame(msg)', () => {
    it('should throw an alert message', () => {
        // testing alerts with help of https://newbedev.com/testing-javascript-alerts-with-jasmine
        spyOn(window, 'alert');
        endGame('GAME OVER');
        expect(window.alert).toHaveBeenCalledWith('GAME OVER');
    });
});

describe('checkForTie()', () => {

    beforeEach(makeBoard);

    it('should return true when all cells are filled', () => {
        board.forEach(arr => arr.fill(2));
        expect(checkForTie()).toBe(true);
    });

    describe('should return false when', () => {
        it('board is empty', () => {
            expect(checkForTie()).toBe(false);
        });

        it('board is partially full', () => {
            board[board.length - 1].fill(1);
            expect(checkForTie()).toBe(false);
        });
    });

    afterEach(makeBoard);
});

describe('checkForWin()', () => {

    const base = board.length - 1;

    beforeAll(makeBoard);

    describe('should announce winner when:', () => {
        
        it('horizontal 4 coins in a row', () => {
            for (let i = 0; i < 4; i++) {
                board[base][i] = 1;
            }
            expect(checkForWin()).toBe(true);
        });

        it('vertical 4 coins in a column', () => {
            for (let i = 3; i >= 0; i--) {
                board[i][0] = 1;
            }
            expect(checkForWin()).toBe(true);
        });

        it ('diagonal (ascending)', () => {
            const base = board.length - 1;
            for (let i = 0; i < 4; i++) {
                board[base - i][i] = 1;
            }
            expect(checkForWin()).toBe(true);
        });

        it ('diagonal (descending)', () => {
            const base = board.length - 1;
            for (let i = 0; i < 4; i++) {
                board[base - 3 + i][i] = 1;
            }
            expect(checkForWin()).toBe(true);
        });

    });

    describe('should not announce winner when:', () => {

        it('board is empty', () => {
            expect(checkForWin()).not.toBe(true);
        });

        it('4 coins in a row are of different colors', () => {
            [board[base][0], board[base][1]] = [1, 1];
            [board[base][2], board[base][3]] = [2, 2];
            expect(checkForWin()).not.toBe(true);
        });
    });

    afterEach(makeBoard);
});