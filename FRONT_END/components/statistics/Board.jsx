import * as React from "react";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";

function preventDefault(event) {
  event.preventDefault();
}

var key = 0;

export default function Board(props) {
  return (
    <React.Fragment>
      <Title>{props.title}</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            {Object.keys(props.data[0]).map((d) => {
              return <TableCell key={d}>{d}</TableCell>;
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => {
            return (
              <TableRow key={row[Object.keys(props.data[0])[0]]}>
                {Object.keys(row).map((cell) => {
                  return <TableCell key={key++}> {row[cell]}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
