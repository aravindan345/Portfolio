import React, { Fragment, useState } from "react";
import emailjs from "@emailjs/browser";
import { Prompt } from "react-router-dom";
import classes from "./contactForm.module.css";
import Button from "../UI/Button";
import useInput from "../../hooks/useInput";
import { useSelector } from "react-redux";

const Contact = () => {
  const [isEntering, setIsEntering] = useState(false);
  const [btnText, setBtnText] = useState("Send Message");
  const [isSent, setIsSent] = useState(false);
  const [enteredLName, setEnteredLName] = useState("");
  const [enteredTitle, setEnteredTitle] = useState("");

  // ✅ Input Validations
  const {
    value: enteredName,
    hasError: nameInputHasError,
    isValid: enteredNameIsValid,
    valueChangeHandler: nameChangedHandler,
    inputBlurHandler: nameBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: enteredPhone,
    hasError: phoneInputHasError,
    isValid: enteredPhoneIsValid,
    valueChangeHandler: phoneChangedHandler,
    inputBlurHandler: phoneBlurHandler,
  } = useInput((value) => value.trim().length >= 10);

  const {
    value: enteredEmail,
    hasError: emailInputHasError,
    isValid: enteredEmailIsValid,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput((value) => value.includes("@"));

  const {
    value: enteredMessage,
    hasError: messageInputHasError,
    isValid: enteredMessageIsValid,
    valueChangeHandler: messageChangedHandler,
    inputBlurHandler: messageBlurHandler,
  } = useInput((value) => value.trim().length >= 10);

  let formIsValid = false;
  if (
    enteredNameIsValid &&
    enteredEmailIsValid &&
    enteredMessageIsValid &&
    enteredPhoneIsValid &&
    enteredTitle.trim() !== ""
  ) {
    formIsValid = true;
  }

  // ✅ Last Name
  const lastNameChangeHandler = (event) => {
    setEnteredLName(event.target.value);
  };

  // ✅ Title
  const titleChangeHandler = (event) => {
    setEnteredTitle(event.target.value);
  };

  // ✅ Submit Form
  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (!formIsValid) return;

    const message = {
      name: enteredName + " " + enteredLName,
      email: enteredEmail,
      phone: enteredPhone,
      title: enteredTitle,
      message: enteredMessage,
    };

    finishEnteringHandler();
    await sendMessageHandler(message);
  };

  // ✅ Send Message via EmailJS
  const sendMessageHandler = async (message) => {
    setBtnText("Sending...");

    try {
      await emailjs.send(
        "service_ne557bb", // 🔑 Your Service ID
        "template_ex9cn51", // 🔑 Your Template ID
        {
          title: message.title,   // ✅ Subject
          name: message.name,     // ✅ Full name
          email: message.email,   // ✅ Email
          phone: message.phone,   // ✅ Phone
          message: message.message, // ✅ Message
        },
        "VnA3xbHbVPMP_wkZo" // 🔑 Your Public Key
      );

      alert("Message sent successfully ✅");
      setBtnText("Message Sent");
      setIsSent(true);
    } catch (error) {
      console.error("FAILED...", error);
      alert("Message failed ❌. Please try again.");
      setBtnText("Send Message");
    }
  };

  const finishEnteringHandler = () => {
    setIsEntering(false);
  };

  const formFocussedHandler = () => {
    setIsEntering(true);
  };

  // ✅ Styling
  const nameInputClasses = nameInputHasError
    ? `${classes.Inputs} ${classes.invalidInput}`
    : classes.Inputs;
  const emailInputClasses = emailInputHasError
    ? `${classes.Inputs} ${classes.invalidInput}`
    : classes.Inputs;
  const phoneInputClasses = phoneInputHasError
    ? `${classes.Inputs} ${classes.invalidInput}`
    : classes.Inputs;
  const messageInputClasses = messageInputHasError
    ? `${classes.Inputs} ${classes.invalidInput}`
    : classes.Inputs;
  const formClasses = isSent
    ? `${classes.contactForm} ${classes.sent}`
    : classes.contactForm;

  const nonThemeColor = useSelector((state) => state.nonThemeColor);

  return (
    <Fragment>
      <Prompt
        when={isEntering && !isSent}
        message={() =>
          "Are You Sure You Want To Leave? All your entered data will be lost!"
        }
      />
      <div className={classes.contactFormCard}>
        <h1 style={{ color: nonThemeColor }}>Leave A Message</h1>
        <form
          onFocus={formFocussedHandler}
          onSubmit={formSubmitHandler}
          className={formClasses}
        >
          <input
            value={enteredName}
            onBlur={nameBlurHandler}
            onChange={nameChangedHandler}
            type="text"
            className={nameInputClasses}
            placeholder="First Name"
            disabled={isSent}
          />
          <input
            type="text"
            id="lName"
            value={enteredLName}
            onChange={lastNameChangeHandler}
            className={classes.Inputs}
            placeholder="Last Name (optional)"
            disabled={isSent}
          />
          <input
            value={enteredEmail}
            onBlur={emailBlurHandler}
            onChange={emailChangedHandler}
            type="email"
            className={emailInputClasses}
            placeholder="Email"
            disabled={isSent}
          />
          <input
            value={enteredPhone}
            onBlur={phoneBlurHandler}
            onChange={phoneChangedHandler}
            type="text"
            className={phoneInputClasses}
            placeholder="Phone"
            minLength={10}
            maxLength={12}
            disabled={isSent}
          />
          <input
            type="text"
            value={enteredTitle}
            onChange={titleChangeHandler}
            className={classes.Inputs}
            placeholder="Subject / Title"
            disabled={isSent}
          />
          <br />
          <textarea
            value={enteredMessage}
            onBlur={messageBlurHandler}
            onChange={messageChangedHandler}
            className={messageInputClasses}
            name="message"
            placeholder="Message"
            disabled={isSent}
          ></textarea>
          <div className={classes.sendBtn}>
            <Button type="submit" disabled={!formIsValid || isSent}>
              {btnText}
            </Button>
          </div>
        </form>
      </div>
    </Fragment>
  );
};

export default Contact;
