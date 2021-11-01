import React from "react";
import { Table, Card } from "react-bootstrap";

const Results = (props) => {
  if (!props.table) {
    return null;
  }
  return (
    <div style={{ height: "400px" }}>
      {Object.keys(props.table).length > 0 ? (
        <Card
          elevation={6}
          className="overflow-auto"
          style={{ width: "370px", height: "400px" }}
        >
          <Table style={{ minWidth: 100 }}>
            <thead>
              <tr>
                {props.table.columns.map((item, ind) => (
                  <th className="pl-sm-24" key={ind}>
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {props.table.data.length > 0 ? (
                <>
                  {props.table.data.map((item, ind) => (
                    <tr key={ind}>
                      {props.table.columns.map((value, index) => (
                        <td
                          key={index}
                          className="pl-sm-24 capitalize"
                          align="left"
                        >
                          {item[index]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </>
              ) : (
                <p className="text-muted">Not results</p>
              )}
            </tbody>
          </Table>
        </Card>
      ) : (
        <p className="text-muted">Not results</p>
      )}
    </div>
  );
};

export default Results;
