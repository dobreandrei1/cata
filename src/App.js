import React from "react";
import produce from "immer";
import { Card, Button } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import EditableCell from "./EditableCell";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";

import "./App.css";

function UploadArea({ name, next }) {
  const onDrop = React.useCallback(acceptedFiles => {
    console.log(acceptedFiles);
    next();
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <Card className="uploadRow">
      <h1>{name}</h1>
      <div className="uploadArea" {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </Card>
  );
}

function FinalTable() {
  const [finalData, dispatch] = React.useReducer(
    (state, action) => produce(state, draft => {}),
    [
      {
        "Numar Camere": { type: "validated", value: "4", originalValue: "4r" },
        "Suprafata Utila": {
          type: "validated",
          value: "80mp",
          originalValue: "80mp2"
        },
        Strada: { type: "invalid", value: "huk ja" },
        Oras: { type: "correct", value: "Bucuresti" },
        Etaj: { type: "correct", value: 5 }
      }
    ]
  );

  const columns = Object.keys(finalData[0]);

  return (
    <div className="wrapper">
      <h2>Processed Data</h2>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map(c => (
                <TableCell>{c}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {finalData.map(d => (
              <TableRow>
                {columns.map(c => (
                  <TableCell className={d[c].type}>
                    <EditableCell value={d[c].value} />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Button>Download Validated File</Button>
    </div>
  );
}

function ColumnsCheckTable({ next }) {
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
    {
      actualColumns: {
        "nr cam": [2, 3, 1, 2, 3],
        "sup util": [50, 70, 30, 55, 77],
        "str.ada": [
          "Baciului",
          "Ciocarliei",
          "Adevarul",
          "Vasile Milea",
          "Paris"
        ],
        oras: ["Bucuresti", "Brasov", "Bucuresti", "Bucuresti", "Arad"]
      },

      results: {
        "Numar Camere": { found: true, column: "nr cam" },
        "Suprafata Utila": { found: true, column: "sup util" },
        Strada: { found: true, column: "str.ada" },
        Oras: { found: true, column: "oras" },
        Etaj: { found: false, column: null }
      }
    }
  );

  const colums = Object.keys(columnMatching.results);
  const actualColumns = Object.keys(columnMatching.actualColumns);

  return (
    <div className="wrapper">
      <h2>Matched Columns</h2>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {colums.map(rc => (
                <TableCell>
                  {rc}
                  <br />
                  <Select
                    value={columnMatching.results[rc].column}
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
              <TableRow>
                {colums.map(c => (
                  <TableCell>
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
      <Button onClick={next}>Confirm Columns and Validate file</Button>
    </div>
  );
}

function UploadFileScreen({ next }) {
  return (
    <div className="uploaders">
      <UploadArea next={next} name="Apartments" />
      <UploadArea next={next} name="Houses" />
      <UploadArea next={next} name="Fields" />
    </div>
  );
}

function App() {
  const [step, setStep] = React.useState(0);
  const next = () => setStep(step + 1);
  const stepScreen = [
    <UploadFileScreen next={next} />,
    <ColumnsCheckTable next={next} />,
    <FinalTable next={next} />
  ];

  return <div className="App">{stepScreen[step]}</div>;
}

export default App;
