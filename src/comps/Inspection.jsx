import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useMemo } from "react";
import { mergeObjectsByFilename } from "../util/object_util";

export default function Inspection({ images, data }) {
  const merged = useMemo(() => {
    const test = mergeObjectsByFilename(images, data);
    console.log(test);
    return test;
  }, [images, data]);
  return (
    <>
      <h2>Kontrolle</h2>
      {merged.map((entry) => (
        <>
          <Row key={entry.filename}>
            <Col xs={12} md={5} lg={4}>
              {entry.dataURL && (
                <img
                  src={entry.dataURL}
                  alt="Bild"
                  style={{ maxWidth: "100%", maxHeight: "350px" }}
                />
              )}
              {!entry.dataURL && (
                <span className="fw-bold">Kein Bild geladen</span>
              )}
            </Col>
            <Col xs={12} md={7} lg={8}>
              <div>
                <span className="fw-bold">Dateiname:&nbsp;</span>
                {entry.filename}
              </div>
              <div>
                <span className="fw-bold">Name:&nbsp;</span>
                {entry.data?.name}
              </div>
              <div>
                <span className="fw-bold">Land:&nbsp;</span>
                {entry.data?.country}
              </div>
              <div>
                <span className="fw-bold">Ortschaft:&nbsp;</span>
                {entry.data?.locality}
              </div>
              <div>
                <span className="fw-bold">Koordinaten:&nbsp;</span>
                {entry.data?.coordinate?.lat}, {entry.data?.coordinate?.lon}
              </div>
            </Col>
          </Row>
          <hr />
        </>
      ))}
    </>
  );
}
