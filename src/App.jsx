import { useEffect, useState } from "react";
import styled from "styled-components";

const Background = styled.div`
  background: #16213e;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Board = styled.div`
  width: 420px;
  height: 420px;
  border: 1px solid white;
  display: grid;
  grid-template-columns: 140px 140px 140px;
  @media screen and (max-width: 425px) {
    width: 330px;
    margin-top: 4rem;
    height: 330px;
    grid-template-columns: 110px 110px 110px;
  }
`;

const Cell = styled.div`
  width: 140px;
  height: 140px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 425px) {
    width: 110px;
    height: 110px;
  }
`;

const Heading = styled.h1`
  font-size: 40px;
  margin-bottom: 20px;
  color: #f7f6dc;
`;

const Info = styled.h3`
  font-size: 20px;
  margin-bottom: 20px;
  color: #f7f6dc;
`;

const Image = styled.div`
  background-image: ${(props) =>
    props.state[props.index] === -1
      ? "none"
      : "url('" + props.map[props.state[props.index]] + "')"};
  background-repeat: no-repeat;
  background-size: cover;
  height: 100px;
  width: 100px;
  @media screen and (max-width: 425px) {
    width: 90px;
    height: 90px;
  }
`;

const Victory = styled.h1`
  color: #fecd70;
  font-weight: bold;
  margin-top: 25px;
  text-align: center;
`;

const Button = styled.button`
  background-color: lightgreen;
  padding: 5px 15px;
  margin-top: 15px;
  border-radius: 5px;
  font-size: 20px;
  font-weight: bold;
  border: 8px solid black;
`;

function App() {
  const initState = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
  const [turn, setTurn] = useState(0);
  const [state, setState] = useState(initState);
  const [winner, setWinner] = useState(-1);
  const clickAudio = new Audio("./sounds/click.wav");
  const startAudio = new Audio("./sounds/start.wav");

  const map = {
    0: "/assets/circle.png",
    1: "/assets/cross.png",
  };

  function gameDraw() {
    let res = true;
    for (let cell of state) if (cell === -1) res = false;
    return res;
  }

  function gameRow(index) {
    if (
      state[index] === state[index + 1] &&
      state[index + 1] === state[index + 2] &&
      state[index] !== -1
    )
      return true;
    return false;
  }

  function gameColumn(index) {
    if (
      state[index] === state[index + 3] &&
      state[index + 3] === state[index + 6] &&
      state[index] !== -1
    )
      return true;
    return false;
  }

  function gamePrimeDiagonal() {
    if (state[0] === state[4] && state[4] === state[8] && state[0] !== -1)
      return true;
    return false;
  }

  function gameSecDiagonal() {
    if (state[2] === state[4] && state[4] === state[6] && state[2] !== -1)
      return true;
    return false;
  }

  function checkWinner() {
    for (let i = 0; i <= 2; i++)
      if (gameColumn(i)) {
        setWinner(state[i]);
        startAudio.play();
        return;
      }

    for (let i = 0; i <= 6; i += 3)
      if (gameRow(i)) {
        setWinner(state[i]);
        startAudio.play();
        return;
      }

    if (gamePrimeDiagonal()) {
      setWinner(state[0]);
      startAudio.play();
      return;
    }
    if (gameSecDiagonal()) {
      setWinner(state[2]);
      startAudio.play();
      return;
    }
    if (winner === -1 && gameDraw()) {
      setWinner(3);
      startAudio.play();
    }
  }

  function handleCellClick(index) {
    if (state[index] === -1 && winner === -1) {
      state[index] = turn;
      checkWinner();
      setTurn((turn + 1) % 2);
      setState(state);
      clickAudio.play();
    }
  }
  return (
    <Background>
      <Heading>TIC TAC TOE</Heading>
      <Info>Player 1 is 'O'</Info>
      <Info>Player 2 is 'X'</Info>
      <Board>
        {state.map((_, index) => (
          <Cell key={index} onClick={() => handleCellClick(index)}>
            <Image index={index} state={state} map={map} />
          </Cell>
        ))}
      </Board>
      {winner !== -1 && (
        <>
          {winner === 3 ? (
            <Victory>Match drawn</Victory>
          ) : (
            <Victory>Player {winner + 1} won the match</Victory>
          )}
          <Button
            onClick={() => {
              setWinner(-1);
              setState(initState);
              setTurn(0);
            }}
          >
            Restart
          </Button>
        </>
      )}
    </Background>
  );
}

export default App;
