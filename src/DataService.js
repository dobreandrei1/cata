import React from "react";

const ServiceContext = React.createContext();

const ServiceProvider = ({ children }) => {
  const [columnMatchingData, setColumnMatchingData] = React.useState();
  const [finalDataInit, setFinalData] = React.useState();
  const [loading, setLoading] = React.useState(false);

  return (
    <ServiceContext.Provider
      value={{
        columnMatchingData,
        setColumnMatchingData,
        finalDataInit,
        setFinalData,
        loading,
        setLoading
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export { ServiceContext, ServiceProvider };
