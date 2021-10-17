import React from "react";
import StepWizard from "react-step-wizard";

import EditorCreate from "./EditorCreate";
import EditorInsert from "./EditorInsert";
import EditorUpdate from "./EditorUpdate";
import EditorDelete from "./EditorDelete";
import EditorDrop from "./EditorDrop";
import EditorSelect from "./EditorSelect";
import EditorWizardNav from "./EditorWizardNav";

const EditorRemoteWizard = () => {
  return (
    <div className="container" style={{ marginTop: "2%" }}>
      <div className="row">
        <div className="col-md-12">
          <StepWizard
            nav={<EditorWizardNav />}
            initialStep={1}
            isHashEnabled={true}
          >
            <EditorCreate hashkey={"first"}></EditorCreate>
            <EditorInsert hashkey={"second"}></EditorInsert>
            <EditorDelete hashkey={"third"}></EditorDelete>
            <EditorUpdate hashkey={"fourth"}></EditorUpdate>
            <EditorDrop hashkey={"fifth"}></EditorDrop>
            <EditorSelect hashkey={"sixth"}></EditorSelect>
          </StepWizard>
        </div>
      </div>
    </div>
  );
};

export default EditorRemoteWizard;
