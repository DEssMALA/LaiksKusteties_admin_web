import React, { useEffect, useState } from "react";
import { MDBDataTable, MDBRow, MDBCol } from "mdbreact";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";

export default function Login() {
  const [userData, setUserData] = useState(null);

  useEffect(async () => {
    const columns = [
      {
        label: "Vārds",
        field: "name",
      },
      {
        label: "Uzvārds",
        field: "surname",
      },
      {
        label: "Epasts",
        field: "email",
      },
      {
        label: "Tips",
        field: "type",
        sort: "asc",
      },
    ];
    var rows = [];
    await db
      .collection("users")
      .get()
      .then((snap) => {
        snap.forEach((s) => {
          const user = s.data();
          if (!user.email) return;
          rows.push({
            name: user.name,
            surname: user.surname,
            email: user.email,
            type: user.type,
            clickEvent: () => console.log("row clicked", s.id),
          });
        });
      })
      .catch((e) => {
        console.log(e);
      });
    setUserData({ columns: columns, rows: rows });
  }, []);

  console.log(userData);

  return !userData ? (
    <></>
  ) : (
    <MDBDataTable striped bordered hover data={userData} />
  );
}
