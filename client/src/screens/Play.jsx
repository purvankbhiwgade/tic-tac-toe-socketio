import React, { useContext, useState, useEffect, useRef } from "react";
import FormContextProvider from "../context/FormContextProvider";
import backButton from "../assets/public/icons8-back-50.png";
import Cross from "../components/Cross";
import Circle from "../components/Circle";
import SmallCircle from "../components/SmallCircle";
import SmallCross from "../components/SmallCross";
import Square from "../components/Square";
import Axios from "axios";
import Cookies from "universal-cookie";

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

  socket.on("play_game", (payload) => {
    console.log("play received");
    console.log("payload", payload);
    setXIsNext(payload.X);
    console.log(payload.squares);
    payload.squares ? setSquares(payload.squares) : null;
    console.log(payload);
    // setPiece(payload.piece === "X" ? "O" : "X");
  });

  useEffect(() => {
    console.log("userEmail", userEmail);
    console.log("rivalEmail", rivalEmail);
    console.log("opponent", opponent);
    console.log("secondplayer", secondPlayer);
  }, []);

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
  // setInterval(() => {
  //   if (socket.connected) {
  //     console.log("Socket is connected to the server.");
  //     const roomId = socket.rooms;
  //     console.log("Room ID:", roomId);
  //   } else {
  //     console.log("Socket is not connected to the server.");
  //   }
  // }, 10000);

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
  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }


  // triggers whenever you click on the button
  // sends an event "move" to the server 
  function handleClick(i) {
    try {
      console.log("handling");
      // socket.emit("getRoomMembers", roomnameRef.current);
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
      // setRenderSquares(renderSquaresCopy)
      setXIsNext(!xIsNext);
      console.log("handling");
      console.log(roomnameRef.current.value)
      console.log(roomnameRef.current)
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
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    console.log("winner", squares);
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[a];
      }
    }
    return null;
  }

  const disabled = (index) => {
    const temp =
      (piece === "X" && !xIsNext) ||
      (piece === "O" && xIsNext) ||
      renderSquares[index]
        ? true
        : false;
    return false;
  };

  

  return (
    <form className="card flex flex-col text-left relative h-full w-full">
      <button
        onClick={(e) => {
          e.preventDefault();
          socket.emit("getRoomMembers", roomnameRef.current);
          socket.emit("move", {
            squares: [null, "x"],
            X: !xIsNext,
            roomname: "dishabhiwgade@gmail.com",
          });
        }}
      >
        send
      </button>
      <button className="absolute w-15 h-10 left-60" onClick={LogOut}>
        LogOut
      </button>
      <img src={backButton} className="w-5 pt-2" />
      <p className="text-2.5xl font-bold mb-4 mt-7">{`Game with ${opponent}`}</p>
      <p className="text-sm leading-4 mb-2">Your piece</p>
      <div className="pl-3 pt-[23px]">
        {piece === "X" ? <SmallCross /> : <Circle />}
      </div>
      <div>
        <div className="text-xl w-full bg-[#FFE79E] h-[54px] flex items-center justify-center mt-[22px]">
          {!((piece === "X" && !xIsNext) || (piece === "O" && xIsNext))
            ? "Your"
            : "Their"}{" "}
          move
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between">
            <button
              disabled={disabled(0)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(0);
              }}
              className={`w-[105px] h-[105px] flex flex-1 justify-center items-center border-b-[3px] border-r-[3px] border-[#FFE79E] box-content ${
                disabled(0) ? null : "hover:bg-slate-100"
              }`}
            >
              <Square>{renderSquares[0]}</Square>
            </button>
            <button
              disabled={disabled(1)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(1);
              }}
              className={`w-[105px] h-[105px] flex flex-1 justify-center items-center border-b-[3px] border-r-[3px] border-l-[3px] border-[#FFE79E] box-content ${
                disabled(1) ? null : "hover:bg-slate-100"
              }`}
            >
              <Square>{renderSquares[1]}</Square>
            </button>
            <button
              disabled={disabled(2)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(2);
              }}
              className={`w-[105px] h-[105px] flex flex-1 justify-center items-center border-b-[3px] border-l-[3px] border-[#FFE79E] box-content ${
                disabled(2) ? null : "hover:bg-slate-100"
              }`}
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
              className={`w-[105px] h-[105px] flex flex-1 justify-center items-center border-t-[3px] border-[#FFE79E] border-b-[3px] border-r-[3px] box-content ${
                disabled(3) ? null : "hover:bg-slate-100"
              }`}
            >
              <Square>{renderSquares[3]}</Square>
            </button>
            <button
              disabled={disabled(4)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(4);
              }}
              className={`w-[105px] h-[105px] flex flex-1 justify-center items-center border-t-[3px] border-[#FFE79E] border-b-[3px] border-r-[3px] border-l-[3px] box-content ${
                disabled(4) ? null : "hover:bg-slate-100"
              }`}
            >
              <Square>{renderSquares[4]}</Square>
            </button>
            <button
              disabled={disabled(5)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(5);
              }}
              className={`w-[105px] h-[105px] flex flex-1 justify-center items-center border-t-[3px] border-[#FFE79E] border-b-[3px] border-l-[3px] box-content ${
                disabled(5) ? null : "hover:bg-slate-100"
              }`}
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
              className={`w-[105px] h-[105px] flex flex-1 justify-center items-center border-t-[3px] border-[#FFE79E] border-r-[3px] box-content ${
                disabled(6) ? null : "hover:bg-slate-100"
              }`}
            >
              <Square>{renderSquares[6]}</Square>
            </button>
            <button
              disabled={disabled(7)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(7);
              }}
              className={`w-[105px] h-[105px] flex flex-1 justify-center items-center border-t-[3px] border-[#FFE79E] border-r-[3px] border-l-[3px] box-content ${
                disabled(7) ? null : "hover:bg-slate-100"
              }`}
            >
              <Square>{renderSquares[7]}</Square>
            </button>
            <button
              disabled={disabled(8)}
              onClick={(e) => {
                e.preventDefault();
                handleClick(8);
              }}
              className={`w-[105px] h-[105px] flex flex-1 justify-center items-center border-t-[3px] border-[#FFE79E] border-l-[3px] box-content ${
                disabled(8) ? null : "hover:bg-slate-100"
              }`}
            >
              <Square>{renderSquares[8]}</Square>
            </button>
          </div>
        </div>
      </div>
      <a
        className={`btn ${
          !((piece === "X" && !xIsNext) || (piece === "O" && xIsNext))
            ? "bg-[#F2C94C]"
            : "bg-[#E0E0E0]"
        } text-white block rounded-lg flex items-center justify-center font-bold mt-11 absolute bottom-0`}
      >
        {!((piece === "X" && !xIsNext) || (piece === "O" && xIsNext))
          ? "Submit!"
          : "Waiting for player..."}
      </a>
    </form>
  );
}
