    document.addEventListener('DOMContentLoaded', () => {
    // Variables globales
    const canvas = document.getElementById('puzzleCanvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = 'imagenes/torre_eiffel_puzzle.jpg'; // Ruta de la imagen para el puzzle
    const rows = 3; // Número de filas
    const cols = 3; // Número de columnas
    let pieces = [];
    let pieceWidth, pieceHeight;
    let selectedPiece = null;
    let isPuzzleCompleted = false;

    // Configuración inicial
    img.onload = () => {
        canvas.width = img.width;  // Ajustar el ancho del canvas al de la imagen
        canvas.height = img.height; // Ajustar el alto del canvas al de la imagen
        pieceWidth = canvas.width / cols;
        pieceHeight = canvas.height / rows;
        setupPuzzle();
    };
    

    function setupPuzzle() {
        pieces = [];
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                pieces.push({
                    x: col * pieceWidth,
                    y: row * pieceHeight,
                    order: row * cols + col
                });
            }
        }
        shufflePuzzle();
    }

    function shufflePuzzle() {
        pieces = pieces.sort(() => Math.random() - 0.5); // Desordenar las piezas
        pieces.forEach((piece, index) => {
            // Colocar las piezas en posiciones aleatorias
            piece.x = (index % cols) * pieceWidth;
            piece.y = Math.floor(index / cols) * pieceHeight;
        });
        drawPuzzle();
    }

    function drawPuzzle() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach((piece, index) => {
            ctx.drawImage(
                img,
                (piece.order % cols) * pieceWidth, Math.floor(piece.order / cols) * pieceHeight,
                pieceWidth, pieceHeight,
                piece.x, piece.y,
                pieceWidth, pieceHeight
            );
        });
        checkPuzzleComplete();
    }

    function checkPuzzleComplete() {
        const tolerance = 5; // Define la tolerancia en píxeles
        isPuzzleCompleted = pieces.every(piece =>
            Math.abs(piece.x - (piece.order % cols) * pieceWidth) < tolerance &&
            Math.abs(piece.y - Math.floor(piece.order / cols) * pieceHeight) < tolerance
        );
    
        if (isPuzzleCompleted) {
            document.getElementById('puzzleMessage').textContent = "¡Felicidades! Has completado el puzzle. 🎉";
        } else {
            document.getElementById('puzzleMessage').textContent = "";
        }
    }
    

    canvas.addEventListener('mousedown', (e) => {
        if (isPuzzleCompleted) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        selectedPiece = pieces.find(piece =>
            x >= piece.x && x <= piece.x + pieceWidth &&
            y >= piece.y && y <= piece.y + pieceHeight
        );

        if (selectedPiece) {
            canvas.addEventListener('mousemove', movePiece);
        }
    });

    function movePiece(e) {
        const rect = canvas.getBoundingClientRect();
        selectedPiece.x = e.clientX - rect.left - pieceWidth / 2;
        selectedPiece.y = e.clientY - rect.top - pieceHeight / 2;
        drawPuzzle();
    }

    canvas.addEventListener('mouseup', () => {
        if (selectedPiece) {
            const targetPiece = pieces.find(piece =>
                Math.abs(selectedPiece.x - piece.x) < pieceWidth / 2 &&
                Math.abs(selectedPiece.y - piece.y) < pieceHeight / 2
            );

            if (targetPiece && targetPiece !== selectedPiece) {
                const tempX = targetPiece.x;
                const tempY = targetPiece.y;
                targetPiece.x = selectedPiece.x;
                targetPiece.y = selectedPiece.y;
                selectedPiece.x = tempX;
                selectedPiece.y = tempY;
            }

            selectedPiece = null;
            canvas.removeEventListener('mousemove', movePiece);
            drawPuzzle();
        }
    });

    document.getElementById('startPuzzle').addEventListener('click', () => {
        setupPuzzle(); // Configura las piezas del puzzle
        shufflePuzzle(); // Desordena las piezas
        document.getElementById('puzzleMessage').textContent = ""; // Limpia el mensaje de "¡Felicidades!"
    });
    
});
