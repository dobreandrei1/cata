import React from "react";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ServiceContext, ServiceProvider } from "./DataService";

import UploadFileScreen from "./UploadFileScreen";
import ColumnsCheckTable from "./ColumnsCheckTable";
import FinalTable from "./FinalTable";
import Reports from "./Reports";

import "./App.css";

function DataProcessing() {
  const { loading } = React.useContext(ServiceContext);
  const [step, setStep] = React.useState(0);
  const next = () => setStep(step + 1);
  const stepScreen = [
    <UploadFileScreen next={next} />,
    <ColumnsCheckTable next={next} />,
    <FinalTable next={next} />
  ];
  return (
    <div className="App">
      {loading ? (
        <div className="progressWrapper">
          <CircularProgress />{" "}
        </div>
      ) : (
        stepScreen[step]
      )}
    </div>
  );
}

function App() {
  return (
    <ServiceProvider>
      <Router>
        <div>
          <Route exact path="/" component={DataProcessing} />
          <Route exact path="/reports" component={Reports} />
        </div>
      </Router>
    </ServiceProvider>
  );
}

export default App;
