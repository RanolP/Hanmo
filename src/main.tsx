import { render } from "preact";
import { App } from "./App.tsx";
import "./index.css";

// rome-ignore lint/style/noNonNullAssertion: <explanation>
const app = document.getElementById("app"!)!;
render(<App />, app);
