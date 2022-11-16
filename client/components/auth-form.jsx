import React from 'react';

export default class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const req = {
      method: 'POST',
      body: JSON.stringify(this.state)
    };
    fetch('/api/users/', req);
  }

  render() {
    return (
      <div onClick={event => this.modal(event)} className='transparent lucida-sans this.props.view'>
        <div className='modal'>
          <div className='modal-row'>
            <h2 className='auth-header font-gray'>Sign-Up</h2>
            <input onChange={this.handleChange} className='auth-input' type='text' placeholder='Username' value={this.state.username} />
            <input onChange={this.handleChange} className='auth-input' type='text' placeholder='Password' value={this.state.password}/>
            <div className='submit-auth-column cyan-background'>
              <a onSubmit={this.handleSubmit} className='submit-auth  white'>Submit</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
