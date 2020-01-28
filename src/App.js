import React from "react";
import produce from "immer";
import { Card } from "@material-ui/core";
import "./App.css";

function UploadArea({ name }) {
  return (
    <Card className="uploadRow">
      <h1>{name}</h1>
      <form>
        <input type="file" name="input" />
        <input type="hidden" name="type" value={name} />
        <input type="submit" />
      </form>
    </Card>
  );
}

function App() {
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
    <div>
      <div className="App">
        <UploadArea name="Apartments" />
        <UploadArea name="Houses" />
        <UploadArea name="Fields" />
      </div>

      <table>
        <thead>
          <tr>
            {colums.map(rc => (
              <th>
                {rc}
                <br />
                <select
                  onChange={e => {
                    dispatch({
                      type: "CHANGE_COLUMN",
                      column: rc,
                      actualColumn: e.target.value
                    });
                  }}
                >
                  {actualColumns.map(c => (
                    <option
                      value={c}
                      selected={columnMatching.results[rc].column === c}
                    >
                      {c}
                    </option>
                  ))}
                  <option
                    value="not-found"
                    selected={columnMatching.results[rc].column === null}
                  >
                    not found
                  </option>
                </select>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {columnMatching.actualColumns[actualColumns[0]].map((_, idx) => (
            <tr>
              {colums.map(c => (
                <td>
                  {columnMatching.results[c].found &&
                    columnMatching.actualColumns[
                      columnMatching.results[c].column
                    ][idx]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
