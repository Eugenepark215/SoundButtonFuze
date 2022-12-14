import React from 'react';
import Redirect from './redirect';
export default class SignOut extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      signOut: null
    };
  }

  signOut(event) {
    window.localStorage.removeItem('react-context-jwt');
    this.setState({ signOut: true });
  }

  render() {
    if (this.state.signOut === true) {
      return <Redirect to="#" />;
    }
    return (
      <div className='display-flex justify-content-center'>
        <button onClick={event => this.signOut(event)} className='sign-out drop-shadow border-radius-5px white lucida-sans cyan-background border-none'>Sign-Out</button>
      </div>
    );
  }

}
