import React from 'react';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      error: '',
      account: ''
    };
    this.handleChangeAuth = this.handleChangeAuth.bind(this);
    this.handleSubmitAuth = this.handleSubmitAuth.bind(this);
  }

  handleChangeAuth(event) {
    const { name, value } = event.target;
    if (this.state.error) {
      this.setState({ error: '', [name]: value });
    }
    this.setState({ [name]: value });
  }

  handleSubmitAuth(event) {
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
    fetch('/api/users/', req)
      .then(res => {
        if (!res.ok) {
          this.setState({ error: true });
        } else if (res.ok) {
          this.setState({ error: '', account: '', username: '', password: '' });
          this.props.onClose();
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

  render() {
    const error = this.state.error ? 'error-input' : '';
    return (
      <div onClick={event => this.modal(event)} className='transparent lucida-sans'>
        <form className='modal' onSubmit={this.handleSubmitAuth}>
          <div className='modal-row'>
            <h2 className='auth-header font-gray'>Sign-Up</h2>
            <input required onChange={this.handleChangeAuth} className={`auth-input ${error}`} type='text'
              placeholder='Username' name="username" value={this.state.username} />
            {this.state.error && <div className='error'>Username must be unique</div>}
            <input required onChange={this.handleChangeAuth} className='auth-input' type='password'
              placeholder='Password' name="password" value={this.state.password} />
            <button type="submit" className='submit-auth cyan-background white'>Submit</button>
          </div>
        </form>
      </div>
    );
  }
}
