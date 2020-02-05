import React from "react";
import produce from "immer";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper,
  Button
} from "@material-ui/core";
import EditableCell from "./EditableCell";
import BootstrapTooltip from "./BootstrapTooltip";
import { ServiceContext } from "./DataService";

function FinalTable() {
  const { finalDataInit } = React.useContext(ServiceContext);
  const columns = Object.keys(finalDataInit[0]);
  const [finalData, dispatch] = React.useReducer(
    (state, action) =>
      produce(state, draft => {
        switch (action.type) {
          case "EDIT_CELL":
            const { data_idx, col_idx, val } = action.payload;
            draft[data_idx][columns[col_idx]].value = val;
            break;
          default:
        }
      }),
    finalDataInit
  );

  const cellOnChange = (data_idx, col_idx) => val =>
    dispatch({
      type: "EDIT_CELL",
      payload: {
        data_idx,
        col_idx,
        val
      }
    });

  console.log("reredering");
  return (
    <div className="wrapper">
      <h2>Processed Data</h2>
      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map(c => (
                <TableCell key={c}>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {finalData.map((d, idx) => (
              <TableRow key={idx}>
                {columns.map((c, idx_cell) => {
                  if (d[c].type === "validated") {
                    return (
                      <BootstrapTooltip
                        key={idx_cell}
                        title={`Original value was: ${d[c].originalValue}`}
                      >
                        <TableCell className={d[c].type}>
                          <EditableCell
                            onChange={cellOnChange(idx, idx_cell)}
                            value={d[c].value}
                          />
                        </TableCell>
                      </BootstrapTooltip>
                    );
                  } else {
                    return (
                      <TableCell key={idx_cell} className={d[c].type}>
                        <EditableCell
                          onChange={cellOnChange(idx, idx_cell)}
                          value={d[c].value}
                        />
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
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
          var exportedFilenmae = "export.csv";

          var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
          if (navigator.msSaveBlob) {
            // IE 10+
            navigator.msSaveBlob(blob, exportedFilenmae);
          } else {
            var link = document.createElement("a");
            if (link.download !== undefined) {
              // feature detection
              // Browsers that support HTML5 download attribute
              var url = URL.createObjectURL(blob);
              link.setAttribute("href", url);
              link.setAttribute("download", exportedFilenmae);
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
    </div>
  );
}

export default FinalTable;
