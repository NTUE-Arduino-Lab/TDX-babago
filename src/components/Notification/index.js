import { React, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import notiIcon from '../../asset/imgs/noti-icon.svg';

function Notification({ show, title, body }) {
  const Msg = () => (
    <div>
      <div>{title}</div>
      <div>{body}</div>
    </div>
  );

  useEffect(() => {
    if (show && title !== '' && body !== '') {
      toast.info(<Msg />, {
        icon: () => <img src={notiIcon} />,
        theme: 'light',
        type: 'info',
      });
    }
    console.log(title + body);
  }, [show, title, body]);

  return (
    <ToastContainer
      position="top-center"
      autoClose={8000}
      hideProgressBar
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable
      pauseOnHover={false}
      theme="colored"
      type="info"
    />
  );
}
Notification.defaultProps = {
  show: false,
  close: function () {},
  title: 'This is title',
  body: 'Some body',
};

Notification.propTypes = {
  show: PropTypes.bool,
  close: PropTypes.func,
  title: PropTypes.string,
  body: PropTypes.string,
};
export default Notification;
