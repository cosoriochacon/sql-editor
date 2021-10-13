import React from "react";
import StepWizard from "react-step-wizard";

import EditorWizardNav from "../pages/EditorWizardNav";
import EditorSqlCreate from "./EditorSqlCreate";
import EditorSqlInsert from "./EditorSqlInsert";

const EditorWizard = () => {
  return (
    <div className="container" style={{ marginTop: "2%" }}>
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-success" role="alert">
            <h3>Local</h3>
          </div>
          <StepWizard
            nav={<EditorWizardNav />}
            initialStep={1}
            isHashEnabled={true}
          >
            <EditorSqlCreate hashkey={"first"}></EditorSqlCreate>
            <EditorSqlInsert hashkey={"second"}></EditorSqlInsert>
          </StepWizard>
        </div>
      </div>
    </div>
  );
};

export default EditorWizard;
