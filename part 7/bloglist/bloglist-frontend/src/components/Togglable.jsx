import PropTypes from "prop-types";
import { forwardRef, useImperativeHandle, useState } from "react";

const Togglable = forwardRef(
  ({ buttonLabel, cancelLabel = "cancel", children }, ref) => {
    const [visible, setVisible] = useState(false);

    const hideWhenVisible = { display: visible ? "none" : "" };
    const showWhenVisible = { display: visible ? "" : "none" };

    const toggleVisibility = () => {
      setVisible(!visible);
    };

    useImperativeHandle(ref, () => {
      return {
        toggleVisibility,
      };
    });

    return (
      <>
        <button
          style={hideWhenVisible}
          onClick={toggleVisibility}
          className="button"
        >
          {buttonLabel}
        </button>

        <div style={showWhenVisible} className="togglable">
          {children}
          <button onClick={toggleVisibility} className="button">
            {cancelLabel}
          </button>
        </div>
      </>
    );
  }
);

Togglable.displayName = "Togglable";

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
  cancelLabel: PropTypes.string,
  children: PropTypes.node,
};

export default Togglable;
