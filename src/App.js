import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import './assets/css/App.css';

const CODE_LENGTH_ALLOWED = new Array(6).fill(0);

class App extends Component {
  input = React.createRef();
  state = {
    value: "",
    focused: false,
    isValid: true,
    isShouldShowMessage: false,
  };

  handleClick = () => {
    this.input.current.focus();
  };
  handleFocus = () => {
    this.setState({ focused: true });
  };
  handleBlur = () => {
    this.setState({
      focused: false,
      isValid: true,
      isShouldShowMessage: false,
    });
  };
  handleKeyUp = e => {
    if (e.key === "Backspace") {
      this.setState(state => {
        return {
          value: state.value.slice(0, state.value.length - 1),
          isValid: true, 
          isShouldShowMessage: false,
          errorMessage: '',
        };
      });
    }
  };
  
  handleChange = e => {
    const value = e.target.value;
    const regexNumberOnly = new RegExp('[0-9]');

    this.setState({
        isValid: true,
        isShouldShowMessage: false,
        errorMessage: null,
    });

    if (!regexNumberOnly.test(value)) {
        this.setState({
            isValid: false,
            isShouldShowMessage: true,
            errorMessage: 'Only number allowed'
        })
        return false;
    }

    this.setState(state => {
      if (state.value.length >= CODE_LENGTH_ALLOWED.length) return null;
      return {
        value: (state.value + value).slice(0, CODE_LENGTH_ALLOWED.length),
      };
    });
  };

  handleButtonClick = () => {
    const values = this.state.value.split('');

    if (!values.length || values.length !== 6) {
      this.setState({
          isShouldShowMessage: true,
          errorMessage: 'Should fill six digit code',
      });

      return false;
    }

    axios.post(`${process.env.REACT_APP_SERVER_URL}`, {
      code: this.state.value,
    }, { headers: {
      'Content-Type': 'application/json',
    }}).then((res) => {
      if (!res.status || !res.data.status) {
        swal('Error', 'Verification Error', 'error');
        return true;
      }

      swal('Success', 'Verified', 'success').then(() => this.props.history.push('./success'));
    }).catch((reason) => {
      swal('Verification Error', `${reason.response.data.message || 'Error'}`, 'error');

      return false;
    });
  }
  render() {
    const {
        value,
        focused,
        isValid,
        isShouldShowMessage,
        errorMessage,
    } = this.state;

    const values = value.split('');
    
    const selectedIndex =
      values.length < CODE_LENGTH_ALLOWED.length ? values.length : CODE_LENGTH_ALLOWED.length - 1;

    const hideInput = !(values.length < CODE_LENGTH_ALLOWED.length);

    return (
      <div>
        <center>
        <h3>
            Blys Verification App
        </h3>
        </center>
        {
        isShouldShowMessage && (
            <div>
                <p className="number-only">* {errorMessage}</p>
            </div>
        )}

      <div className="App">
        <div className="wrap" onClick={this.handleClick}>
          <input
            value=""
            ref={this.input}
            onChange={this.handleChange}
            onKeyUp={this.handleKeyUp}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            className="input"
            style={{
              width: "32px",
              top: "0px",
              bottom: "0px",
              left: `${selectedIndex * 32}px`,
              opacity: hideInput ? 0 : 1,
              outlineColor: 'red',
            }}
          />
          {CODE_LENGTH_ALLOWED.map((v, index) => {
            const selected = values.length === index;
            const filled = values.length === CODE_LENGTH_ALLOWED.length && index === CODE_LENGTH_ALLOWED.length - 1;

            return (
              <div className="display" key={index}>
                {values[index]}
                {(isValid && (selected || filled)) && focused && <div className="shadows" />}
                {(!isValid && (selected || filled)) && focused && <div className="highlighted" />}
              </div>
            );
          })}
        </div>
      </div>
      <button onClick={this.handleButtonClick} className="submit">Submit</button>
      </div>
    );
  }
}

export default App;