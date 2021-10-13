import React from "react";
import StepWizard from "react-step-wizard";

import EditorRemoteCreate from "./EditorRemoteCreate";
import EditorRemoteInsert from "./EditorRemoteInsert";
import EditorRemoteDelete from "./EditorRemoteDelete";
import EditorWizardNav from "../editor/EditorWizardNav";

const EditorRemoteWizard = () => {
  return (
    <div className="container" style={{ marginTop: "2%" }}>
      <div className="row">
        <div className="col-md-12">
          <div className="alert alert-success" role="alert">
            <h3>Remote</h3>
          </div>
          <StepWizard
            nav={<EditorWizardNav />}
            initialStep={1}
            isHashEnabled={true}
          >
            <EditorRemoteCreate hashkey={"first"}></EditorRemoteCreate>
            <EditorRemoteInsert hashkey={"second"}></EditorRemoteInsert>
            <EditorRemoteDelete hashkey={"third"}></EditorRemoteDelete>
          </StepWizard>
        </div>
      </div>
    </div>
  );
};

export default EditorRemoteWizard;
