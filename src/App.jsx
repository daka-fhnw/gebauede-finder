import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Header from "./comps/Header";
import Images from "./comps/Images";
import Data from "./comps/Data";
import Inspection from "./comps/Inspection";
import Query from "./comps/Query";
import { useState } from "react";

export default function App() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  return (
    <>
      <Header page={page} setPage={setPage} />
      <Container className="mt-3 mb-3">
        <div className={page !== 0 ? "d-none" : ""}>
          <Images data={data} setData={setData} />
        </div>
        <div className={page !== 1 ? "d-none" : ""}>
          <Data data={data} setData={setData} />
        </div>
        {page === 2 && <Inspection data={data} setData={setData} />}
        <div className={page !== 3 ? "d-none" : ""}>
          <Query data={data} setData={setData} />
        </div>
      </Container>
    </>
  );
}
