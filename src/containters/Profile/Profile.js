import React, { Component } from 'react';
import { connect } from 'react-redux'

import { toggleModal } from '../../store/actions/welcome'

import Modal from '../../components/UI/Modal/Modal'

import styles from './Profile.module.css'

class Profile extends Component {

   render() {
      let modal = <Modal show={this.props.modalShown} toggleModal={this.props.onModalToggle}>
         <h4>Your nickname</h4>
         <input type="text" />
         <h4>Confirm your nickname</h4>
         <input type="text" />
         <button>Change</button>
      </Modal>

      return (
         <React.Fragment>
            {modal}
            < div className={styles.Profile} >
               <div className={styles.Stats}>
                  <img src="https://image.shutterstock.com/image-illustration/male-default-placeholder-avatar-profile-260nw-582509551.jpg" alt="profile-image" />
                  <p><strong>Nick</strong></p>
                  <p>registered on</p>
                  <p>completed todos</p>
               </div>
               <div className={styles.Settings}>
                  <p onClick={this.props.onModalToggle}>Change your nickname</p>
                  <p>Change your password</p>
                  <p>Change your profile image</p></div>
            </div >
         </React.Fragment>
      )
   }
}

const mapStateToProps = (state) => ({
   modalShown: state.welcome.modalShown
})

const mapDispatchToProps = (dispatch) => {
   return {
      onModalToggle: (e) => { dispatch(toggleModal(e)) }
   }
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile)