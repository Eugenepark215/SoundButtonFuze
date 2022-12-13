import React from 'react';
export default class SignOut extends React.Component {

  signOut(event) {
    window.localStorage.removeItem('react-context-jwt');
  }

  render() {
    return (
      <div className='display-flex justify-content-center'>
        <button onClick={event => this.signOut(event)} className='sign-out drop-shadow border-radius-5px white lucida-sans cyan-background border-none'>Sign-Out</button>
      </div>
    );
  }

}
