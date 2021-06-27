import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";
import { db } from "../firebase";
import { types as appTypes } from "../constants";

export default function AddUser() {
  const emailRef = React.useRef();
  const typeRef = React.useRef();

  const { sendInvite, currentUser } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccess("");
    setError("");
    const email = emailRef.current.value;
    const type = typeRef.current.value;
    console.log(email);
    console.log(type);

    async function recordInvitation(email, type) {
      return db.collection("invitations").doc(email).set({
        type: type,
      });
    }

    try {
      await sendInvite(email);
      console.log("Invitation sent");
      await recordInvitation(email, type);
      console.log("User type saved");
      setSuccess("Ielūgums veiksmīgi nosūtīts");
    } catch (e) {
      console.log(e);
      setError("Neizdevās nosūtīt ielūgumu");
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Jauns lietotājs</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="mb-4">
              <Form.Label>Epasts</Form.Label>
              <Form.Control type="email" ref={emailRef} required />
            </Form.Group>
            <Form.Group controlId="userType" className="mb-4">
              <Form.Label>Lietotāja tips</Form.Label>
              <Form.Control as="select" ref={typeRef}>
                <option value={appTypes.userTypes.admin}>Admins</option>
                <option value={appTypes.userTypes.student}>Skolēns</option>
              </Form.Control>
            </Form.Group>
            <Button disabled={loading} className="w-100 mb-4" type="submit">
              Ielūgt
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        <Link to="/">Atpakaļ</Link>
      </div>
    </>
  );
}
