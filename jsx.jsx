/* the cat is not real */

class Cycle25 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      breakLength: 5,
      sessionLength: 25,
      timerLabel: "Session",
      timeLeft: 1500, // 25 minutes in seconds
      isRunning: false,
    };
    this.phaseSwitch = false; // ✅ properly declared outside of state
    this.handleReset = this.handleReset.bind(this);

  }

  formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  }

  handleReset() {
    this.setState({
      breakLength: 5,
      sessionLength: 25,
      timerLabel: "Session",
      timeLeft: 1500,
      isRunning: false,
    });
    clearInterval(this.timer);
    this.phaseSwitch = false;

    const beep = document.getElementById("beep");
    if (beep) {
      beep.pause();
      beep.currentTime = 0;
    }
  }

  handleBreakDecrement = () => {
    if (this.state.breakLength > 1) {
      this.setState((prevState) => ({
        breakLength: prevState.breakLength - 1,
      }));
    }
  };

  handleBreakIncrement = () => {
    if (this.state.breakLength < 60) {
      this.setState((prevState) => ({
        breakLength: prevState.breakLength + 1,
      }));
    }
  };

  handleSessionIncrement = () => {
    if (this.state.sessionLength < 60) {
      this.setState((prevState) => {
        const newSession = prevState.sessionLength + 1;
        return {
          sessionLength: newSession,
          timeLeft:
            !prevState.isRunning && prevState.timerLabel === "Session"
              ? newSession * 60
              : prevState.timeLeft
        };
      });
    }
  };

  handleSessionDecrement = () => {
    if (this.state.sessionLength > 1) {
      this.setState((prevState) => {
        const newSession = prevState.sessionLength - 1;
        return {
          sessionLength: newSession,
          timeLeft:
            !prevState.isRunning && prevState.timerLabel === "Session"
              ? newSession * 60
              : prevState.timeLeft
        };
      });
    }
  };

  
handleStartStop = () => {
  if (!this.state.isRunning) {
    this.timer = setInterval(() => {
      this.setState((prevState) => {
        if (prevState.timeLeft > 0) {
          return { timeLeft: prevState.timeLeft - 1 };
        } else if (prevState.timeLeft === 0 && !this.phaseSwitch) {
          const beep = document.getElementById("beep");
          if (beep) {
            beep.currentTime = 0;
            beep.play().catch(() => {});
          }
          this.phaseSwitch = true;
          return {}; // hold at 00:00
        } else {
          const isSession = prevState.timerLabel === "Session";
          const newTime = isSession
            ? prevState.breakLength * 60
            : prevState.sessionLength * 60;
          this.phaseSwitch = false;
          return {
            timerLabel: isSession ? "Break" : "Session",
            timeLeft: newTime,
          };
        }
      });
    }, 1000);

    this.setState({ isRunning: true });
  } else {
    clearInterval(this.timer);
    this.setState({ isRunning: false });
  }
};
  
  toggleTheme = () => {
  document.body.classList.toggle("light-mode");
};

  render() {
    return (
      <div className="cycle25">
       <div className="innerone">
        <div className="innerbreak">
         <div id="break-label">Break Length:</div>
         <div id="break-length">{this.state.breakLength}</div>
         <div className="break-text">minutes</div>
        </div>
        <button id="break-decrement" onClick={this.handleBreakDecrement}>-</button>
        <button id="break-increment" onClick={this.handleBreakIncrement}>+</button>
       </div>
       <div className="innertwo">
        <div className="innersession">
         <div id="session-label">Session Length:</div>
         <div id="session-length">{this.state.sessionLength}</div>
          <div className="session-text">minutes</div>
        </div>
         <button id="session-decrement" onClick={this.handleSessionDecrement}>-</button>
         <button id="session-increment" onClick={this.handleSessionIncrement}>+</button>
       </div>
        <div id="timer-label">{this.state.timerLabel}</div>
        <div id="time-left">{this.formatTime(this.state.timeLeft)}</div>
        <button id="start_stop" onClick={this.handleStartStop}>Start / Pause</button>
        <button id="reset" onClick={this.handleReset}>Reset</button>
        <button onClick={this.toggleTheme}>Toggle dark / light mode</button>
        <audio
          id="beep"
          preload="auto"
          src="https://www.soundjay.com/misc/sounds/bell-ringing-05.mp3"
        />
      </div>
    );
  }
}

ReactDOM.render(<Cycle25 />, document.getElementById("root"));
