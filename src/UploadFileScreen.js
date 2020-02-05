import React from "react";
import { Card } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { ServiceContext } from "./DataService";

function UploadArea({ name, next }) {
  const { setColumnMatchingData, setLoading } = React.useContext(
    ServiceContext
  );
  const onDrop = React.useCallback(
    acceptedFiles => {
      setLoading(true);

      const data = new FormData();
      data.append("file", acceptedFiles[0]);
      data.append("type", name);

      fetch("http://localhost:5000/titles", {
        method: "POST",
        body: data
      })
        .then(response => response.text())
        .then(body => {
          setColumnMatchingData(body.replace(/NaN/g, "null"));
          next();
          setLoading(false);
        });
    },
    [name, next, setColumnMatchingData, setLoading]
  );

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

function UploadFileScreen({ next }) {
  return (
    <div className="uploaders">
      <UploadArea next={next} name="Apartments" />
      <UploadArea next={next} name="Houses" />
      <UploadArea next={next} name="Fields" />
    </div>
  );
}

export default UploadFileScreen;
