import React from "react";

const ServiceContext = React.createContext();

const ServiceProvider = ({ children }) => {
  const [columnMatchingData, setColumnMatchingData] = React.useState();
  const [finalDataInit, setFinalData] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [inputFile, setInputFile] = React.useState();

  return (
    <ServiceContext.Provider
      value={{
        columnMatchingData,
        setColumnMatchingData,
        finalDataInit,
        setFinalData,
        loading,
        setLoading,
        inputFile,
        setInputFile
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export { ServiceContext, ServiceProvider };
