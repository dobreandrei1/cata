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
  Button,
  Select,
  MenuItem
} from "@material-ui/core";
import { ServiceContext } from "./DataService";

function ColumnsCheckTable({ next }) {
  const {
    setFinalData,
    columnMatchingData,
    setColumnMatchingData,
    setLoading
  } = React.useContext(ServiceContext);

  const [columnMatching, dispatch] = React.useReducer(
    (state, action) =>
      produce(state, draft => {
        switch (action.type) {
          case "CHANGE_COLUMN":
            if (action.actualColumn !== "not-found") {
              draft.results[action.column].column = action.actualColumn;
              draft.results[action.column].found = true;
            } else {
              draft.results[action.column].found = false;
            }
            break;
          default:
        }
      }),
    columnMatchingData
  );

  const colums = Object.keys(columnMatching.results);
  const actualColumns = Object.keys(columnMatching.actualColumns);

  return (
    <div className="wrapper">
      <h2>Matched Columns</h2>
      <TableContainer component={Paper}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              {colums.map(rc => (
                <TableCell key={rc} className="head">
                  {rc}
                  <br />
                  <Select
                    value={
                      columnMatching.results[rc].column != null
                        ? columnMatching.results[rc].column
                        : "not-found"
                    }
                    onChange={e => {
                      dispatch({
                        type: "CHANGE_COLUMN",
                        column: rc,
                        actualColumn: e.target.value
                      });
                    }}
                  >
                    {actualColumns.map(c => (
                      <MenuItem
                        key={c}
                        value={c}
                        selected={columnMatching.results[rc].column === c}
                      >
                        {c}
                      </MenuItem>
                    ))}
                    <MenuItem
                      value="not-found"
                      selected={columnMatching.results[rc].column === null}
                    >
                      not found
                    </MenuItem>
                  </Select>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {columnMatching.actualColumns[actualColumns[0]].map((_, idx) => (
              <TableRow key={idx}>
                {colums.map((c, c_idx) => (
                  <TableCell key={c_idx}>
                    {columnMatching.results[c].found &&
                      columnMatching.actualColumns[
                        columnMatching.results[c].column
                      ][idx]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Button
        onClick={_ => {
          setLoading(true);
          setColumnMatchingData(columnMatching);
          const r = {};
          Object.keys(columnMatching.results).forEach(
            k => (r[k] = columnMatching.results[k].column)
          );
          fetch("/api/goodTitles", {
            method: "POST",
            body: JSON.stringify(r),
            headers: {
              "Content-Type": "application/json"
            }
          })
            .then(res => res.text())
            .then(body => {
              // console.log(body);
              setFinalData(JSON.parse(body.replace(/NaN/g, "null")));
              next();
              setLoading(false);
            });
        }}
      >
        Confirm Columns and Validate file
      </Button>
    </div>
  );
}

export default ColumnsCheckTable;
