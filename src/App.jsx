import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./comps/Header";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { Container } from "react-bootstrap";
import Images from "./comps/Images";
import { useState } from "react";
import Inspection from "./comps/Inspection";
import Data from "./comps/Data";
import Query from "./comps/Query";

export default function App() {
  const [data, setData] = useState({});
  return (
    <>
      <Header />
      <Container>
        <Tabs
          defaultActiveKey="images"
          transition={false}
          className="mt-3 mb-3"
          fill
        >
          <Tab eventKey="images" title="Bilder">
            <Images data={data} setData={setData} />
          </Tab>
          <Tab eventKey="data" title="Daten">
            <Data data={data} setData={setData} />
          </Tab>
          <Tab eventKey="inspection" title="Kontrolle">
            <Inspection data={data} setData={setData} />
          </Tab>
          <Tab eventKey="query" title="Abfrage">
            <Query data={data} setData={setData} />
          </Tab>
        </Tabs>
      </Container>
    </>
  );
}
