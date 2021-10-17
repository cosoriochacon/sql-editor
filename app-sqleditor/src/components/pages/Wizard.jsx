import React from "react";
import StepWizard from "react-step-wizard";

import Output from "../pages/Output";
import Results from "../pages/Results";
import WizardNav from "../pages/WizardNav";

const Wizard = (props) => {
  return (
    <div className="container" style={{ marginTop: "2%" }}>
      <div className="row">
        <div className="col-md-12">
          <StepWizard nav={<WizardNav />} initialStep={1} isHashEnabled={true}>
            <Output hashkey={"first"} logs={props.logs}></Output>
            <Results hashkey={"second"} table={props.table}></Results>
          </StepWizard>
        </div>
      </div>
    </div>
  );
};

export default Wizard;
