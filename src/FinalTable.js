import React from "react";
import produce from "immer";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Paper
} from "@material-ui/core";
import EditableCell from "./EditableCell";
import BootstrapTooltip from "./BootstrapTooltip";
import ModalButton from "./ModalButton";
import DownloadValidatedFile from "./DownloadValidatedFile";
import ReportForm from "./ReportForm";
import { ServiceContext } from "./DataService";

function FinalTable() {
  const { inputFile, columnMatchingData, finalDataInit } = React.useContext(
    ServiceContext
  );

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

  return (
    <div className="wrapper">
      <h2>Processed Data</h2>
      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Actions</TableCell>
              {columns.map(c => (
                <TableCell key={c}>
                  <BootstrapTooltip
                    title={
                      columnMatchingData.results[c]
                        ? columnMatchingData.results[c].column
                        : "No Original Column"
                    }
                  >
                    <span>{c}</span>
                  </BootstrapTooltip>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {finalData.map((d, idx) => (
              <TableRow key={idx}>
                <TableCell>
                  <ModalButton width={400} title="Report">
                    <ReportForm
                      file={inputFile}
                      row={d}
                      matchingResults={columnMatchingData.results}
                    />
                  </ModalButton>
                </TableCell>
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
      <DownloadValidatedFile columns={columns} finalData={finalData} />
    </div>
  );
}

export default FinalTable;
