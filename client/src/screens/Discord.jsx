export default function Play() {
  const [history, setHistory] = useState(Array(9).fill(null));
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [renderSquares, setRenderSquares] = useState(Array(9).fill(null));
  const [currentMove, setCurrentMove] = useState(0);
  const [piece, setPiece] = useState("X"); // X or O
  const [xIsNext, setXIsNext] = useState(true);
  const { LogOut, socket, userEmail, rivalEmail, opponent, secondPlayer } =
    useContext(FormContextProvider);

  const roomnameRef = useRef(secondPlayer ? rivalEmail : userEmail);

  // when the game starts, assign the pieces to first and second players
  useEffect(() => {
    if (secondPlayer) {
      setPiece("O");
      console.log("game start received", xIsNext, piece);
    } else {
      setPiece("X");
    }
  }, []);

  // check whether the socket is still connected to the server
  setInterval(() => {
    if (socket.connected) {
      console.log("Socket is connected to the server.");
    } else {
      console.log("Socket is not connected to the server.");
    }
  }, 10000);

  // render the <Cross /> and <Circle /> components on the screen
  useEffect(() => {
    console.log("squares", squares);
    const newSquares = squares.map((square) => {
      if (!square) return square;
      else if (square === "X") return <Cross />;
      else return <Circle />;
    });
    setRenderSquares(newSquares);
  }, [squares]);

  // ignore for now

  // triggers whenever you click on the button
  // sends an event "move" to the server
  function handleClick(i) {
    try {
      socket.emit("getRoomMembers", roomnameRef.current);
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      const renderSquaresCopy = renderSquares.slice();
      const squaresCopy = squares.slice();
      if (xIsNext) {
        renderSquaresCopy[i] = <Cross />;
        squaresCopy[i] = "X";
      } else {
        squaresCopy[i] = "O";
        renderSquaresCopy[i] = <Circle />;
      }
      setSquares(squaresCopy);
      setXIsNext(!xIsNext);
      const payload = {
        squares: squaresCopy,
        X: !xIsNext,
        piece,
        roomname: roomnameRef.current,
      };
      console.log(payload);
      socket.emit("move", payload);
    } catch (error) {
      console.log("error on axios", error);
    }
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // function to calculate winner
  function calculateWinner(squares) {}

  // to check if a button should be disabled
  const disabled = (index) => {};

  socket.on("play", (payload) => {
    console.log("play received");
    console.log("payload", payload);
    setXIsNext(payload.X);
    console.log(payload.squares);
    payload.squares ? setSquares(payload.squares) : null;
    console.log(payload);
    setPiece(payload.piece === "X" ? "O" : "X");
  });

  return (
    <form className="card flex flex-col text-left relative h-full w-full">
      <div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <button disabled={disabled(0)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(0);
              }}
            >
              <Square>{renderSquares[0]}</Square>
            </button>
            <button
              disabled={disabled(1)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(1);
              }}
            >
              <Square>{renderSquares[1]}</Square>
            </button>
            <button
              disabled={disabled(2)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(2);
              }}
            >
              <Square>{renderSquares[2]}</Square>
            </button>
          </div>
          <div className="flex justify-between">
            <button
              disabled={disabled(3)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(3);
              }}
            >
              <Square>{renderSquares[3]}</Square>
            </button>
            <button
              disabled={disabled(4)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(4);
              }}
            >
              <Square>{renderSquares[4]}</Square>
            </button>
            <button
              disabled={disabled(5)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(5);
              }}
            >
              <Square>{renderSquares[5]}</Square>
            </button>
          </div>
          <div className="flex justify-between">
            <button
              disabled={disabled(6)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(6);
              }}
            >
              <Square>{renderSquares[6]}</Square>
            </button>
            <button
              disabled={disabled(7)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(7);
              }}
            >
              <Square>{renderSquares[7]}</Square>
            </button>
            <button
              disabled={disabled(8)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(8);
              }}
            >
              <Square>{renderSquares[8]}</Square>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
