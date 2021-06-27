import React, { useEffect, useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { types as appTypes, errors as appErrors } from "../constants";
import { Link } from "react-router-dom";

export default function FinishSignup() {
  const emailRef = React.useRef();
  const passwordRef = React.useRef();
  const passwordConfirmRef = React.useRef();
  const nameRef = React.useRef();
  const surnameRef = React.useRef();
  const { currentUser, isSignInLink, signInEmail, updatePassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [block, setBlock] = useState(false);
  const [stage, setStage] = useState(0);
  const [link, setLink] = useState("");
  const [userType, setUserType] = useState(null);

  // Stage:
  // 0 - not loged in, needs email to approve
  // 1 - email ok, set password
  // 2 - password saved, set user details
  // 3 - all done

  useEffect(() => {
    const link = window.location.href;
    console.log("Link:", link);
    setLink(link);
    if (!isSignInLink(link)) {
      console.log("Nepareiza saite");
      setError("Nepareiza saite");
      setBlock(true);
      return;
    }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (stage == 0) {
      const email = emailRef.current.value;
      try {
        await signInEmail(email, link);
        setStage(1);
      } catch (e) {
        console.log(e);
        setError("Neizdevās pieslēgties ar lietotāju");
      }
    } else if (stage == 1) {
      if (passwordRef.current.value !== passwordConfirmRef.current.value) {
        setError("Paroles ir atšķirīgas");
      } else {
        try {
          await updatePassword(passwordRef.current.value);
          setStage(2);
        } catch (e) {
          console.log(e);
          setError("Neizdevās iestatīt paroli");
        }
      }
    } else if (stage == 2) {
      // TODO: add validation
      if (!nameRef.current.value || !surnameRef.current.value) {
        setError("Jāaizpilda gan vārds, gan uzvārds");
      } else if (!currentUser) {
        setError("Neizdevās autentificēties");
        console.log("No current user");
      } else {
        try {
          var type = null;
          const invitation = await db
            .collection("invitations")
            .doc(emailRef.current.value)
            .get();
          if (!invitation.exists) {
            throw appErrors.noResource;
          }
          type = invitation.data().type;
          console.log("Type from invitation", type);
          if (
            type !== appTypes.userTypes.admin &&
            type !== appTypes.userTypes.student
          ) {
            throw appErrors.unexpectedValInternal;
          }
          setUserType(type);
          db.collection("users").doc(currentUser.uid).set({
            name: nameRef.current.value,
            surname: surnameRef.current.value,
            type: type,
            email: emailRef.current.value,
          });
          currentUser.updateProfile({
            displayName: `${nameRef.current.value} ${surnameRef.current.value}`,
          });
          setStage(3);
        } catch (e) {
          setError("Neizdevās saglabāt");
          console.log(e);
        }
      }
    }

    setLoading(false);
  }

  console.log("Stage:", stage);

  return (
    <>
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Reģistrācija</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group id="email">
              <Form.Label>Epasts</Form.Label>
              <Form.Control
                type="email"
                ref={emailRef}
                required
                disabled={stage > 0 ? true : false}
                isValid={stage > 0 ? true : false}
              />
            </Form.Group>
            {stage > 0 ? (
              <>
                <Form.Group id="password">
                  <Form.Label>Parole</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordRef}
                    required
                    disabled={stage > 1 ? true : false}
                    isValid={stage > 1 ? true : false}
                  />
                </Form.Group>
                <Form.Group id="passwordConfirm">
                  <Form.Label>Paroles apstiprināšana</Form.Label>
                  <Form.Control
                    type="password"
                    ref={passwordConfirmRef}
                    required
                    disabled={stage > 1 ? true : false}
                    isValid={stage > 1 ? true : false}
                  />
                </Form.Group>
              </>
            ) : (
              <></>
            )}
            {stage > 1 ? (
              <>
                <Form.Group id="name">
                  <Form.Label>Vārds</Form.Label>
                  <Form.Control
                    type="text"
                    ref={nameRef}
                    required
                    disabled={stage > 2}
                    isValid={stage > 2}
                  />
                </Form.Group>
                <Form.Group id="surname">
                  <Form.Label>Uzvārds</Form.Label>
                  <Form.Control
                    type="text"
                    ref={surnameRef}
                    required
                    disabled={stage > 2}
                    isValid={stage > 2}
                  />
                </Form.Group>
              </>
            ) : (
              <></>
            )}
            <Button
              variant={stage > 2 ? "success" : "primary"}
              disabled={loading || block || stage > 2}
              className="btn w-100 mt-4"
              type="submit"
            >
              {stage > 2 ? "Reģistrācija veigsmīgi pabeigta" : "Iesniegt"}
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="w-100 text-center mt-2">
        {stage > 2 ? (
          <p>
            Informācija saglabāta. Vari mēgināt ielogoties lietotnē
            {userType === appTypes.userTypes.admin ? (
              <Link to="/login"> vai Admin panelī</Link>
            ) : (
              ""
            )}
            .
          </p>
        ) : (
          ""
        )}
      </div>
    </>
  );
}
