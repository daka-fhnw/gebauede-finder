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
  const [images, setImages] = useState([]);
  const [data, setData] = useState([]);
  const [results, setResults] = useState([]);
  return (
    <>
      <Header page={page} setPage={setPage} />
      <Container className="mt-3 mb-3">
        <div className={page !== 0 ? "d-none" : ""}>
          <Images setImages={setImages} setResults={setResults} />
        </div>
        <div className={page !== 1 ? "d-none" : ""}>
          <Data setData={setData} setResults={setResults} />
        </div>
        <div className={page !== 2 ? "d-none" : ""}>
          <Query images={images} setResults={setResults} />
        </div>
        {page === 3 && (
          <Inspection images={images} data={data} results={results} />
        )}
      </Container>
    </>
  );
}
