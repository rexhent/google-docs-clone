import TextEditor from "./TextEditor";
import DocumentSelect from "./DocumentSelect";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { v4 as uuidV4 } from "uuid";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/new/" exact>
          <Redirect to={`/documents/${uuidV4()}`} />
        </Route>
        <Route path="/documents/:id" exact>
          <TextEditor />
        </Route>
        <Route path="/" exact>
          <DocumentSelect />
        </Route>
      </Switch>
    </Router>
  );
}
