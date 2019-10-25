import React, { Component } from 'react';

import styles from './Modal.module.css'

import Backdrop from '../Backdrop/Backdrop'

class Modal extends Component {
   render() {
      return (
         <React.Fragment>
            <Backdrop show={this.props.show} clicked={this.props.toggleModal} />
            <div className={styles.Modal}
               style={{
                  transform: this.props.show ? 'translate(-50%, -50%)' : 'translate(-50% ,-100vh)',
                  opacity: this.props.show ? '1' : '0'
               }}>
               {this.props.children}
            </div>
         </React.Fragment>

      )
   }
}

export default Modal