import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import Alert from "react-bootstrap/Alert";
import { useState } from "react";
import { sendApiQuery } from "../util/api_util";
import { parseCoordinate, parseLineAttributes } from "../util/parse_util";

const DEFAULT_PROMPT = `Antwort in Klartext ohne Formatierungen. Die nachfolgenden Attribute für das Bild ermitteln und jeweils auf einer Zeile in der Form "Attributname: Wert" auflisten und wenn nicht ermittelbar "N/A" als Wert angeben. 
- "Name": nur Name des Gebäudes
- "Land": nur Land wo das Gebäude steht
- "Ortschaft": nur Ortschaft wo das Gebäude steht
- "Koordinaten": ungefähre WGS84-Koordinaten in Dezimalgrad im Format "Breite, Länge" (z.B. "46.92485, 7.45224")
- "Konfidenz": wie sicher du bist, dass deine Angaben korrekt sind in Prozent (z.B. 87%)
- "Begründung": Erkläre in wenigen Sätzen basierend auf welchen Bildmerkmalen und Informationen du zu diesem Schluss gekommen bist.`;

export default function Query({ images, setResults }) {
  const [baseUrl, setBaseUrl] = useState("http://localhost:1235/v1");
  const [model, setModel] = useState("pixtral-12b");
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState("");
  const handleLoading = async () => {
    setLoading(true);
    setSuccess("");
    setErrors("");
    let errorList = [];
    const appendError = (error) => (errorList = [...errorList, error]);
    try {
      if (images.length) {
        const newResults = [];
        const headers = { "Content-Type": "application/json" };
        if (apiKey.trim()) {
          headers.Authorization = `Bearer ${apiKey.trim()}`;
        }
        let successCount = 0;
        for (const image of images) {
          try {
            const response = await sendApiQuery(
              baseUrl,
              model,
              apiKey,
              prompt,
              image.dataURL,
            );
            if (!response.ok) {
              throw new Error(
                `HTTP ${response.status}: ${await response.text()}`,
              );
            }
            const result = await response.json();
            const message = result.choices?.[0]?.message;
            const content = message?.content ?? "(keine Antwort)";
            const reasoning = message?.reasoning;
            const parsed = parseLineAttributes(content);
            newResults.push({
              filename: image.filename,
              result: {
                name: parsed["Name"],
                country: parsed["Land"],
                locality: parsed["Ortschaft"],
                confidence: parsed["Konfidenz"],
                explanation: parsed["Begründung"],
                coordinate: parseCoordinate(parsed["Koordinaten"]),
                reasoning,
              },
            });
            successCount++;
          } catch (error) {
            console.error(error);
            appendError(`Fehler bei Abfrage für Bild "${image.filename}".`);
          }
          setResults(newResults);
        }
        if (successCount) {
          setSuccess(
            `Abfrage bei ${successCount} von ${images.length} Bildern erfolgreich.`,
          );
        }
      } else {
        appendError("Kein Bild geladen.");
      }
    } catch (globalError) {
      console.error(globalError);
      appendError("Abfragen durch Fehler abgebrochen.");
    } finally {
      setLoading(false);
      setErrors(errorList);
    }
  };
  return (
    <>
      <h2>Abfrage</h2>
      <Row>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="formBaseURL" className="mb-3">
            <Form.Label>Basis-URL</Form.Label>
            <Form.Control
              type="text"
              value={baseUrl}
              onChange={(event) => setBaseUrl(event.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="formModel" className="mb-3">
            <Form.Label>KI-Modell</Form.Label>
            <Form.Control
              type="text"
              value={model}
              onChange={(event) => setModel(event.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6} lg={4}>
          <Form.Group controlId="formApiKey" className="mb-3">
            <Form.Label>API-Key (optional)</Form.Label>
            <Form.Control
              type="text"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              disabled={loading}
            />
          </Form.Group>
        </Col>
      </Row>
      <Form.Group controlId="formPrompt" className="mb-3">
        <Form.Label>Prompt</Form.Label>
        <Form.Control
          as="textarea"
          rows={5}
          value={prompt}
          onChange={(event) => setPrompt(event.target.value)}
          disabled={loading}
        />
      </Form.Group>
      <div className="mb-3">
        <Button onClick={handleLoading} disabled={loading}>
          {!loading && <span>Abfrage starten</span>}
          {loading && (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              <span>Abfrage läuft</span>
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
        errors.map((error, idx) => (
          <Alert key={idx} variant="danger" className="mb-2">
            {error}
          </Alert>
        ))}
    </>
  );
}
