import React, { useState } from "react";
import ReactDOM from "react-dom";
import StateMachine from "javascript-state-machine";

import "./styles.css";

// enumarable
const Status = {
  INIT: "init",
  RUNNING: "running",
  END: "end"
};
Object.freeze(Status);

let fsm = new StateMachine({
  init: Status.INIT,
  transitions: [
    { name: "start", from: Status.INIT, to: Status.RUNNING },
    { name: "hit", from: Status.RUNNING, to: Status.END },
    { name: "play", from: Status.END, to: Status.INIT }
  ],
  methods: {
    onStart: function() {
      console.log("Jogo iniciado");
    },
    onHit: function() {
      console.log("Jogo finalizado");
    },
    onNew: function() {
      console.log("Novo Jogo");
    }
  }
});

function App(props) {
  // Hooks
  const [status, setStatus] = useState(Status.INIT);
  const [playerName, setPlayerName] = useState("");
  const [guess, setGuess] = useState(150);
  const [amount, setAmount] = useState(1);
  const [min, setMin] = useState(parseInt(props.downLimit, 10));
  const [max, setMax] = useState(parseInt(props.upLimit, 10));

  let inputText = React.createRef();

  const handleLess = () => {
    setAmount(amount + 1);
    setMax(guess);
    const nextGuess = Math.floor((guess - min) / 2) + min;
    setGuess(nextGuess);
  };

  const handleMore = () => {
    setAmount(amount + 1);
    setMin(guess);
    const nextGuess = Math.floor((max - guess) / 2) + guess;
    setGuess(nextGuess);
  };

  const handleHit = () => {
    console.log("hHit - 1: " + fsm.state);
    fsm.hit();
    setStatus(fsm.state);
    console.log("3 - " + status);
  };

  const handleStart = () => {
    const inputPlayerName = inputText.current.value;

    if (inputPlayerName) {
      setPlayerName(inputPlayerName);
      console.log("hstart - 1: " + fsm.state);
      fsm.start();
      setStatus(fsm.state);
      console.log("hstart - 2: " + fsm.state);
    } else {
      alert("Nome do Jogador inválido.");
    }
  };

  const handlePlay = () => {
    fsm.play();
    setStatus(fsm.state);
  };

  if (status === Status.INIT) {
    return (
      <>
        <div className="App">
          <h1>Seja Bem Vindo !</h1>
          <h3>
            Pense em um número entre {props.downLimit} e {props.upLimit}
          </h3>
          <small>Nome do Jogador</small>
          <br />
          <input ref={inputText} />
          <br />
          <br />
          <button onClick={handleStart}>Iniciar Jogo</button>
        </div>
      </>
    );
  }

  if (status === Status.END) {
    return (
      <>
        <div className="App">
          <p>
            <b>{playerName}</b>
            <br />0 número <b>{guess}</b>
            <br />
            eu acerto com <b>{amount}</b> palpites.
          </p>
          <button onClick={handlePlay}>Jogar</button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="App">
        <p>
          O número foi <b>{guess}</b> ?
        </p>
        <br />
        <button onClick={handleLess}>Menor</button>
        <button onClick={handleHit}>Acertou</button>
        <button onClick={handleMore}>Maior</button>
      </div>
    </>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App downLimit="0" upLimit="300" />, rootElement);
