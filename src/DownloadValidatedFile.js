import React from "react";
import { Button, TextField } from "@material-ui/core";

function DownloadValidatedFile({ columns, finalData }) {
  const [downloadFileName, setDownloadFileName] = React.useState("export.csv");
  return (
    <div>
      <Button
        onClick={_ => {
          const csv =
            // "data:text/csv;charset=utf-8," +
            columns.join(",") +
            "\n" +
            finalData
              .map(r => columns.map(c => r[c].value).join(","))
              .join("\n");
          // console.log(csv);

          // const encodedUri = encodeURI(csv);
          // window.open(encodedUri);

          var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, downloadFileName);
          } else {
            var link = document.createElement("a");
            if (link.download !== undefined) {
              // feature detection
              // Browsers that support HTML5 download attribute
              var url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", downloadFileName);
              link.style.visibility = "hidden";
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }
        }}
      >
        Download Validated File
      </Button>
      <br />
      <TextField
        label="Downloaded File Name"
        defaultValue={downloadFileName}
        onChange={e => setDownloadFileName(e.target.value)}
      />
    </div>
  );
}

export default DownloadValidatedFile;
