import React, { useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function Dashboard() {
  const [error, setError] = useState("");
  const { currentUser, logout } = useAuth();
  const history = useHistory();

  async function handleLogout() {
    setError("");

    try {
      await logout();
      history.push("/login");
    } catch {
      setError("Neizdevās iziet");
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <strong>Epasts:</strong> {currentUser.email}
          <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
            Atjaunot profila informāciju
          </Link>
          <Link to="/add-user" className="btn btn-primary w-100 mt-3">
            Pievienot lietotāju
          </Link>
          <Link to="/users" className="btn btn-primary w-100 mt-3">
            Lietotāju saraksts
          </Link>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Button variant="link" onClick={handleLogout}>
          Iziet
        </Button>
      </div>
    </>
  );
}
