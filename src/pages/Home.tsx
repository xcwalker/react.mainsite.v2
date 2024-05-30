import { useState } from "react";
import Section from "../components/Section";
import Hero from "./home/Hero";
import Button from "../components/Button";
import SecurityWarning from "../components/Security/Warning";
import Projects from "./home/Projects";

export default function Home() {
  const [modalVisibility, setModalVisibility] = useState(false);
  return (
    <>
      <Hero />
      <Section id="test">Home</Section>
      Home
      <Projects />
      <SecurityWarning visibility={modalVisibility} setVisibility={setModalVisibility} />
      <Button
        onClick={() => {
          setModalVisibility(true);
        }}
      >
        ShowModal
      </Button>
    </>
  );
}
