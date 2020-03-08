import React from "react";
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
import BootstrapTooltip from "./BootstrapTooltip";
import "./Reports.css";

function reducer(state, action) {
  switch (action.type) {
    case "SET_REPORTS":
      return action.payload;
    case "TOGGLE_STATUS":
      const idx = action.payload;
      const newState = [...state];
      if (newState[idx].status === "fixed") {
        newState[idx].status = "notfixed";
      } else {
        newState[idx].status = "fixed";
      }
      fetch("/api/setReports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newState)
      });
      return newState;
    default:
      throw new Error();
  }
}

function ReportTable({ report, toggleStatus }) {
  const columns = Object.keys(report.row);
  const d = report.row;
  const results = report.matchingResults;

  return (
    <TableContainer component={Paper}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Actions</TableCell>
            {columns.map(c => (
              <TableCell key={c}>
                <BootstrapTooltip
                  title={results[c] ? results[c].column : "No Original Column"}
                >
                  <span>{c}</span>
                </BootstrapTooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
              <Button onClick={_ => toggleStatus()}>
                Mark as {report.status === "fixed" ? "not fixed" : "fixed"}
              </Button>
            </TableCell>
            {columns.map((c, idx_cell) => {
              if (d[c].type === "validated") {
                return (
                  <BootstrapTooltip
                    key={idx_cell}
                    title={`Original value was: ${d[c].originalValue}`}
                  >
                    <TableCell className={d[c].type}>{d[c].value}</TableCell>
                  </BootstrapTooltip>
                );
              } else {
                return (
                  <TableCell key={idx_cell} className={d[c].type}>
                    {d[c].value}
                  </TableCell>
                );
              }
            })}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Reports() {
  const [reports, dispatch] = React.useReducer(reducer, []);

  React.useEffect(_ => {
    const getReports = _ => {
      fetch("/api/getReports")
        .then(res => res.text())
        .then(body => {
          const json = JSON.parse(body);
          dispatch({ type: "SET_REPORTS", payload: json });
        });
    };
    getReports();
  }, []);

  console.log("rendering this shit");
  return (
    <div style={{ padding: "20px" }}>
      <h2>Reports</h2>
      <hr />
      {reports.map((r, idx) => (
        <div
          className={r.status === "fixed" ? "report fixed" : "report notfixed"}
          key={idx}
        >
          <p>
            -> <b>File</b>: {r.file}
          </p>
          <p>
            -> <b>Message</b>: {r.message}
          </p>
          <ReportTable
            report={r}
            toggleStatus={_ => {
              dispatch({ type: "TOGGLE_STATUS", payload: idx });
            }}
          />
          <br />
          <hr />
        </div>
      ))}
    </div>
  );
}

export default Reports;
