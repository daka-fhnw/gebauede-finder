import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useMemo } from "react";
import { mergeObjectsByFilename } from "../util/object_util";

export default function Inspection({ images, data, results }) {
  const merged = useMemo(() => {
    const imageData = mergeObjectsByFilename(images, data).filter(
      (entry) => entry.dataURL != null,
    );
    return mergeObjectsByFilename(imageData, results);
  }, [images, data, results]);
  const handleDownload = () => {
    const json = JSON.stringify(
      merged,
      (key, value) => (key === "dataURL" ? undefined : value),
      2,
    );
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "resultate.json";
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <div>
        <Button className="float-end" onClick={handleDownload}>
          als JSON herunterladen
        </Button>
        <h2>Kontrolle</h2>
      </div>
      {merged
        .filter((entry) => entry.dataURL != null)
        .map((entry) => (
          <div key={entry.filename}>
            <div className="mb-2 fw-bold">{entry.filename}</div>
            <Row key={entry.filename} className="text-break">
              <Col xs={12} md={5} lg={4}>
                <div className="mb-2">
                  <img
                    src={entry.dataURL}
                    alt="Bild"
                    style={{ maxWidth: "100%", maxHeight: "350px" }}
                  />
                </div>
              </Col>
              <Col xs={12} md={7} lg={8}>
                <Row key={entry.filename}>
                  <Col xs={12} lg={6}>
                    <h3>Daten</h3>
                    <div className="mb-2">
                      <div>
                        <span className="fw-bold">Name: </span>
                        {entry.data?.name}
                      </div>
                      <div>
                        <span className="fw-bold">Land: </span>
                        {entry.data?.country}
                      </div>
                      <div>
                        <span className="fw-bold">Ortschaft: </span>
                        {entry.data?.locality}
                      </div>
                      <div>
                        <span className="fw-bold">Koordinaten: </span>
                        {entry.data?.coordinate?.lat},{" "}
                        {entry.data?.coordinate?.lng}
                      </div>
                    </div>
                  </Col>
                  <Col xs={12} lg={6}>
                    <h3>Resultat</h3>
                    <div className="mb-2">
                      <div>
                        <span className="fw-bold">Name: </span>
                        {entry.result?.name}
                      </div>
                      <div>
                        <span className="fw-bold">Land: </span>
                        {entry.result?.country}
                      </div>
                      <div>
                        <span className="fw-bold">Ortschaft: </span>
                        {entry.result?.locality}
                      </div>
                      <div>
                        <span className="fw-bold">Koordinaten: </span>
                        {entry.result?.coordinate?.lat},{" "}
                        {entry.result?.coordinate?.lng}
                      </div>
                      <div>
                        <span className="fw-bold">Konfidenz: </span>
                        {entry.result?.confidence}
                      </div>
                      <div>
                        <span className="fw-bold">Begründung: </span>
                        {entry.result?.explanation}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <hr />
          </div>
        ))}
    </>
  );
}
