import React from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ServiceContext, ServiceProvider } from "./DataService";

import UploadFileScreen from "./UploadFileScreen";
import ColumnsCheckTable from "./ColumnsCheckTable";
import FinalTable from "./FinalTable";

import "./App.css";

function Router() {
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
      <Router />
    </ServiceProvider>
  );
}

export default App;
