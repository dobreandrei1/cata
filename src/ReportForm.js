import React from "react";

import { Button, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  wrapper: {
    padding: "20px",
    display: "flex",
    flexDirection: "column"
  },
  message: {
    padding: "10px",
    backgroundColor: "#BBD5AE",
    color: "green",
    border: "1px solid green"
  }
}));

function ReportForm({ file, row, matchingResults }) {
  const classes = useStyles();
  const [message, setMessage] = React.useState("");
  const [messageSent, setMessageSent] = React.useState(false);

  return (
    <div className={classes.wrapper}>
      <h3>Report incorrect row/cell</h3>
      {messageSent && (
        <p className={classes.message}>
          Report was sent. Press Esc to close this pop-up.
        </p>
      )}
      <TextField
        multiline
        label="Message"
        value={message}
        onChange={e => {
          setMessage(e.target.value);
          setMessageSent(false);
        }}
      />
      <br />
      <Button
        disabled={message === ""}
        onClick={_ => {
          console.log();
          fetch("/api/sendReport", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              message,
              file,
              row,
              matchingResults
            })
          }).then(res => {
            setMessageSent(true);
            setMessage("");
          });
        }}
      >
        Send
      </Button>
    </div>
  );
}

export default ReportForm;
