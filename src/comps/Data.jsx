import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import Papa from "papaparse";
import { useState } from "react";
import { unflattenObject } from "../util/object_util";

export default function Data({ setData }) {
  const [dataFile, setDataFile] = useState(null);
  const [fileHeader, setFileHeader] = useState("dateiname");
  const [nameHeader, setNameHeader] = useState("name");
  const [countryHeader, setCountryHeader] = useState("land");
  const [localityHeader, setLocalityHeader] = useState("ortschaft");
  const [latitudeHeader, setLatitudeHeader] = useState("breitengrad");
  const [longitudeHeader, setLongitudeHeader] = useState("laengengrad");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const handleLoading = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    const headerMap = {
      [fileHeader]: "filename",
      [nameHeader]: "data.name",
      [countryHeader]: "data.country",
      [localityHeader]: "data.locality",
      [latitudeHeader]: "data.coordinate.lat",
      [longitudeHeader]: "data.coordinate.lon",
    };
    if (dataFile) {
      Papa.parse(dataFile, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header) => {
          const key = header.trim();
          return headerMap[header.trim()] ?? key;
        },
        complete: (result) => {
          const newData = result.data.map(unflattenObject).map((entry) => ({
            filename: entry.filename,
            data: entry.data,
          }));
          console.log(newData);
          setData(newData);
          setSuccess(`${newData.length} Zeilen erfolgreich geladen.`);
        },
        error: (err) => {
          console.err(err.message);
          setError("Laden durch Fehler abgebo");
        },
      });
    } else {
      setError("Keine Datei ausgewählt.");
    }
    setLoading(false);
  };
  return (
    <>
      <h2>Daten</h2>
      <Form.Group controlId="formDataFile" className="mb-3">
        <Form.Label>CSV-Datei auswählen</Form.Label>
        <Form.Control
          type="file"
          accept=".csv,text/csv"
          onChange={(event) => setDataFile(event.target.files?.[0] ?? null)}
          disabled={loading}
        />
      </Form.Group>
      <div className="mb-3">Header-Mappings</div>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="formFileHeader" className="mb-3">
            <Form.Label>Dateiname</Form.Label>
            <Form.Control
              type="text"
              value={fileHeader}
              onChange={(event) => setFileHeader(event.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="formNameHeader" className="mb-3">
            <Form.Label>Gebäudename</Form.Label>
            <Form.Control
              type="text"
              value={nameHeader}
              onChange={(event) => setNameHeader(event.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="gormCountryHeader" className="mb-3">
            <Form.Label>Land</Form.Label>
            <Form.Control
              type="text"
              value={countryHeader}
              onChange={(event) => setCountryHeader(event.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="formLocalityHeader" className="mb-3">
            <Form.Label>Ortschaft</Form.Label>
            <Form.Control
              type="text"
              value={localityHeader}
              onChange={(event) => setLocalityHeader(event.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="formLatitudeHeader" className="mb-3">
            <Form.Label>Breitengrad</Form.Label>
            <Form.Control
              type="text"
              value={latitudeHeader}
              onChange={(event) => setLatitudeHeader(event.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="formLongitudeHeader" className="mb-3">
            <Form.Label>Längengrad</Form.Label>
            <Form.Control
              type="text"
              value={longitudeHeader}
              onChange={(event) => setLongitudeHeader(event.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>
      <div className="mb-3">
        <Button onClick={handleLoading} disabled={loading}>
          {!loading && <span>Daten laden</span>}
          {loading && (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Daten werden geladen</span>
            </>
          )}
        </Button>
      </div>
      {success && (
        <Alert variant="success" className="mb-2">
          {success}
        </Alert>
      )}
      {error && (
        <Alert variant="danger" className="mb-2">
          {error}
        </Alert>
      )}
    </>
  );
}
