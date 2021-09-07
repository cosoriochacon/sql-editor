import React from "react";
import { classList } from "../../@utils";

const EditorWizardNav = (props) => {
  const dots = [];
  for (let i = 1; i <= props.totalSteps; i += 1) {
    const isActive = props.currentStep === i;
    dots.push(
      <div
        key={i}
        className={classList({
          "cursor-pointer": !isActive,
          "p-2 px-3 pt-0": i !== 1,
          "p-2 px-3 pl-0 pt-0": i === 1,
          "step-active": isActive,
        })}
        onClick={() => props.goToStep(i)}
      >
        <h5
          className={classList({
            "m-0 mb-1 text-14": true,
            "text-primary": isActive,
          })}
        >
          Step {i}
        </h5>
        {i === 1 && <small className="text-muted">CREATE</small>}
        {i === 2 && <small className="text-muted">INSERT</small>}
      </div>
    );
  }
  return (
    <div
      className="d-flex flex-wrap form-wizard mb-3"
      style={{ cursor: "pointer" }}
    >
      {dots}
    </div>
  );
};

export default EditorWizardNav;
