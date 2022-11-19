import React from 'react';
import AppContext from '../lib/app-context';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      account: '',
      signInOrsignUp: 'signIn'
    };
    this.handleChangeAuth = this.handleChangeAuth.bind(this);
    this.handleSubmitSignUp = this.handleSubmitSignUp.bind(this);
    this.handleSubmitSignIn = this.handleSubmitSignIn.bind(this);
  }

  handleChangeAuth(event) {
    const { name, value } = event.target;
    if (this.state.error) {
      this.setState({ error: '', [name]: value });
    }
    this.setState({ [name]: value });
  }

  handleSubmitSignUp(event) {
    event.preventDefault();
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    };
    fetch('/api/users/sign-up', req)
      .then(res => {
        if (!res.ok) {
          this.setState({ error: true });
        } else if (res.ok) {
          fetch('/api/users/sign-in', req)
            .then(res => res.json())
            .then(data => {
              if (data.user && data.token) {
                this.context.handleSignIn(data);
                this.setState({ error: '', account: '', username: '', passsword: '' });
                this.props.onClose();
              } else {
                this.setState({ error: true });
              }
            });
        }
      });
  }

  handleSubmitSignIn(event) {
    event.preventDefault();
    const req = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      })
    };
    fetch('/api/users/sign-in', req)
      .then(res => res.json())
      .then(data => {
        if (data.user && data.token) {
          this.context.handleSignIn(data);
          this.setState({ error: '', account: '', username: '', passsword: '' });
          this.props.onClose();
        } else {
          this.setState({ error: true });
        }
      });
  }

  modal(event) {
    if (!this.state.account && event.target.className === 'modal') {
      this.setState({ account: null });
      this.props.onClose();
    } else if (this.state.account) {
      this.setState({ account: true });
    }
  }

  handleClick(event) {
    if (this.state.signInOrsignUp === 'signIn') {
      this.setState({ signInOrsignUp: 'signUp', error: '', username: '', passsword: '' });
    } else if (this.state.signInOrsignUp === 'signUp') {
      this.setState({ signInOrsignUp: 'signIn', error: '', username: '', passsword: '' });
    }
  }

  render() {
    const typeOfError = this.state.signInOrsignUp === 'signIn' ? 'Invalid login' : 'Username must be unique';
    const error = this.state.error ? 'error-input' : '';
    const signInOrsignUp = this.state.signInOrsignUp === 'signIn' ? this.handleSubmitSignIn : this.handleSubmitSignUp;
    const signInOrsignUpHeader = this.state.signInOrsignUp === 'signIn' ? 'Sign-In' : 'Sign-Up';
    const signInOrsignUpAnchor = this.state.signInOrsignUp === 'signIn' ? 'Sign-Up' : 'Sign-In';
    return (
      <div onClick={event => this.modal(event)} className='transparent lucida-sans'>
        <form className='modal' onSubmit={signInOrsignUp}>
          <div className='modal-row'>
            <h2 className='auth-header font-gray'>{signInOrsignUpHeader}</h2>
            <input required onChange={this.handleChangeAuth} className={`auth-input ${error}`} type='text'
              placeholder='Username' name="username" value={this.state.username} />
            {this.state.error && <div className='error'>{typeOfError}</div>}
            <input required onChange={this.handleChangeAuth} className='auth-input' type='password'
              placeholder='Password' name="password" value={this.state.password} />
            <div className='modal-anchor-submit display-flex'>
              <a className='modal-anchor' onClick={event => this.handleClick(event)}>{signInOrsignUpAnchor}</a>
              <button type="submit" className='submit-auth cyan-background white'>Submit</button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
AuthForm.contextType = AppContext;
