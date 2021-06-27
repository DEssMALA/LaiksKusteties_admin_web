import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { Link, useHistory } from "react-router-dom";

export default function UpdateProfile() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const reauthPasswordRef = useRef();
  const { currentUser, updateEmail, updatePassword, login } = useAuth();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    console.log("handleSubmit");

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setLoading(false);
      return setError("Paroles ir atšķirīgas");
    }

    try {
      await login(currentUser.email, reauthPasswordRef.current.value);
    } catch (e) {
      console.log("nepareiza esošā parole", e);
      setLoading(false);
      return setError("Neizdevās apstiprināt ar esošo paroli");
    }

    var promises = [];
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }
    console.log("Izmaiņas:", promises.length);

    if (promises.length) {
      Promise.all(promises)
        .then(() => {
          setSuccess("Darbība izdevās");
        })
        .catch((e) => {
          console.log(e.message);
          console.log(e.code);
          setError("Neizdevās saglabāt");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("Nav izmaiņu");
    }
  }

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Izmainīt lietotāja informāciju</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email" className="mb-4">
              <Form.Label>Epasts</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                defaultValue={currentUser.email}
              />
            </Form.Group>
            <Form.Group id="password" className="mb-4">
              <Form.Label>Parole</Form.Label>
              <Form.Control type="password" ref={passwordRef} />
            </Form.Group>
            <Form.Group id="passwordConfirm" className="mb-4">
              <Form.Label>Paroles apstiprināšana</Form.Label>
              <Form.Control type="password" ref={passwordConfirmRef} />
            </Form.Group>
            <Form.Group id="reauthPasswordConfirm" className="mb-4">
              <Form.Label>Apstiprini izmaiņas ar esošo paroli</Form.Label>
              <Form.Control type="password" ref={reauthPasswordRef} required />
            </Form.Group>
            <Button disabled={loading} className="w-100" type="submit">
              Saglabāt
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
