import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";
import { readImage, transformImage } from "../util/image_util";

export default function Images({ data, setData }) {
  const [files, setFiles] = useState(null);
  const [widthPx, setWidthPx] = useState(1024);
  const [qualityPerc, setQualityPerc] = useState(0.8);
  const [rotate90, setRotate90] = useState(false);
  const [mirrorX, setMirrorX] = useState(false);
  const [mirrorY, setMirrorY] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const handleLoading = async () => {
    setLoading(true);
    setSuccess("");
    setErrors([]);
    let errorList = [];
    const appendError = (error) => (errorList = [...errorList, error]);
    try {
      const newData = { ...data };
      const properties = { widthPx, qualityPerc, rotate90, mirrorX, mirrorY };
      let successCount = 0;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const name = file.name;
          try {
            const dataURL = await transformImage(
              await readImage(file),
              properties,
            );
            newData[name] = {
              ...(newData[name] ?? {}),
              ...properties,
              name,
              dataURL,
            };
            successCount++;
          } catch (error) {
            console.error(error);
            appendError(`Fehler beim Laden von Bild "${file.name}".`);
          }
        }
        setData(newData);
        setSuccess(
          `${successCount} von ${files.length} Bildern erfolgreich geladen.`,
        );
      } else {
        appendError("Keine Datei ausgewählt.");
      }
    } catch (globalError) {
      console.error(globalError);
      appendError("Laden durch Fehler abgebrochen.");
    } finally {
      setLoading(false);
      setErrors(errorList);
    }
  };
  return (
    <>
      <Row>
        <Col xs={12} md={9} lg={6}>
          <Form.Group controlId="formFiles" className="mb-3">
            <Form.Label>Bilddateien auswählen</Form.Label>
            <Form.Control
              type="file"
              multiple
              onChange={(event) => setFiles(event.target.files)}
              disabled={loading}
            />
          </Form.Group>
          <Form.Group controlId="formWidthPx" className="mb-3">
            <Form.Label>Bildbreite</Form.Label>
            <Form.Control
              type="number"
              value={widthPx}
              onChange={(event) => setWidthPx(event.target.value)}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group controlId="formQualityPerc" className="mb-3">
            <Form.Label>JPEG-Qualität</Form.Label>
            <Row>
              <Col className="col-auto">
                <span>{Math.round(qualityPerc * 100)}%</span>
              </Col>
              <Col>
                <Form.Range
                  min={0}
                  max={1}
                  step={0.05}
                  value={qualityPerc}
                  onChange={(event) => setQualityPerc(event.target.value)}
                  disabled={loading}
                />
              </Col>
            </Row>{" "}
          </Form.Group>
        </Col>
        <Col xs={12} lg={6}>
          <div className="mb-3">Rotation und Spiegelung</div>
          <Form.Check
            type="switch"
            id="formRotate90"
            label="Bilder um 90° drehen"
            checked={rotate90}
            onChange={(event) => setRotate90(event.target.checked)}
            className="mb-3"
            disabled={loading}
          />
          <Form.Check
            type="switch"
            id="formMirrorX"
            label="Bilder horizontal spiegeln"
            checked={mirrorX}
            onChange={(event) => setMirrorX(event.target.checked)}
            className="mb-3"
            disabled={loading}
          />
          <Form.Check
            type="switch"
            id="formMirrorY"
            label="Bilder vertikal spiegeln"
            checked={mirrorY}
            onChange={(event) => setMirrorY(event.target.checked)}
            className="mb-3"
            disabled={loading}
          />
        </Col>
      </Row>
      <div className="mb-3">
        <Button onClick={handleLoading} disabled={loading}>
          {!loading && <span>Bilder laden</span>}
          {loading && (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Bilder werden geladen</span>
            </>
          )}
        </Button>
      </div>
      {success && (
        <Alert variant="success" className="mb-2">
          {success}
        </Alert>
      )}
      {errors &&
        errors.map((error) => (
          <Alert variant="danger" className="mb-2">
            {error}
          </Alert>
        ))}
    </>
  );
}
