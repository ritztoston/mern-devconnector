import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

const SubmitButton = ({
   type,
   loading,
   disabled
                      }) => {

  return (
     <div>
       <button disabled={disabled} type={type} className={classnames('btn btn-info btn-block mt-4 ld-ext-right', {'running': loading})}>
         Submit
         <div className="ld ld-ring ld-spin"> </div>
       </button>
     </div>
  )
};

SubmitButton.defaultProps = {
  type: "submit",
  disabled: "false"
};

SubmitButton.propTypes = {
  type: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired
};

export default SubmitButton;