import React from 'react';

export default class ConnectionError extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      something: null
    };
  }

  render() {
    return (
      <div className="error-message">
        <div className="modal-container">
          <h1 className="title-header lucida-sans">Sorry, there was an error connecting to the network! Please check your internet connection and try again.</h1>
        </div>
      </div>
    );
  }
}
