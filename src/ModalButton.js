import React from "react";
import { Modal, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = width =>
  makeStyles(theme => ({
    paper: {
      position: "absolute",
      width: width,
      backgroundColor: theme.palette.background.paper
    }
  }));

function ModalButton({ title, children, width = 1200 }) {
  const classes = useStyles(width)();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const modalStyle = {
    top: `50%`,
    left: `50%`,
    transform: `translate(-50%, -50%)`
  };

  return (
    <div>
      <Modal open={open} onClose={handleClose}>
        <div style={modalStyle} className={classes.paper}>
          {children}
        </div>
      </Modal>
      <Button onClick={handleOpen}>{title}</Button>
    </div>
  );
}

export default ModalButton;
