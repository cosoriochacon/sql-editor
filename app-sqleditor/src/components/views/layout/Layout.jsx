import React from "react";
import LayoutNav from "./LayoutNav";

const Layout = (props) => {
  return (
    <div>
      <LayoutNav />
      {props.children}
    </div>
  );
};

export default Layout;
