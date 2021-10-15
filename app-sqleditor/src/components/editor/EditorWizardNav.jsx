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
          {i === 1 && <>CREATE</>}
          {i === 2 && <>INSERT</>}
          {i === 3 && <>DELETE</>}
          {i === 4 && <>UPDATE</>}
          {i === 5 && <>DROP</>}
          {i === 6 && <>SELECT</>}
        </h5>
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
