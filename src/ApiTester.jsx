import { useState } from "react";

export default function ApiTester() {
  // Einstellungen
  const [baseUrl, setBaseUrl] = useState("http://localhost:1235/v1");
  const [modell, setModell] = useState("pixtral-12b");
  const [apiKey, setApiKey] = useState("");
  const [maxBreiteProzent, setMaxBreiteProzent] = useState(100);
  const [qualitaet, setQualitaet] = useState(80);

  // Daten
  const [datei, setDatei] = useState(null);
  const [base64, setBase64] = useState("");
  const [masse, setMasse] = useState(null); // { original, neu }
  const [prompt, setPrompt] = useState(
    `Antwort in Klartext ohne Formatierungen. Die nachfolgenden Attribute für das Bild ermitteln und jeweils auf einer Zeile in der Form "Attributname: Wert" auflisten und wenn nicht ermittelbar "N/A" als Wert angeben. 
- "Name": Name des Gebäudes
- "Land": Land wo das Gebäude steht
- "Ortschaft": Ortschaft wo das Gebäude steht
- "Koordinaten": ungefähre WGS84-Koordinaten in Dezimalgrad im Format "Breite, Länge" (z.B. "46.92485, 7.45224")
- "Konfidenz": wie sicher du bist, dass deine Angaben korrekt sind in Prozent (z.B. 87%)
- "Begründung": Erkläre in wenigen Sätzen basierend auf welchen Bildmerkmalen und Informationen du zu diesem Schluss gekommen bist.`,
  );
  const [antwort, setAntwort] = useState("");
  const [laedtAntwort, setLaedtAntwort] = useState(false);
  const [fehler, setFehler] = useState("");

  const handleAuswahl = (e) => {
    setDatei(e.target.files[0] ?? null);
    setBase64("");
    setMasse(null);
    setAntwort("");
    setFehler("");
  };

  const handleLaden = async () => {
    if (!datei) return;
    setFehler("");

    const prozent = Number(maxBreiteProzent);
    const q = Number(qualitaet) / 100;

    try {
      const ergebnis = await skaliereBild(datei, prozent, q);
      setBase64(ergebnis.dataUrl);
      setMasse({ original: ergebnis.original, neu: ergebnis.neu });
    } catch (err) {
      setFehler(err.message);
    }
  };

  const handleSenden = async () => {
    if (!base64 || !prompt.trim()) return;

    setLaedtAntwort(true);
    setFehler("");
    setAntwort("");

    const url = `${baseUrl.trim().replace(/\/+$/, "")}/chat/completions`;

    try {
      const headers = { "Content-Type": "application/json" };
      if (apiKey.trim()) {
        headers.Authorization = `Bearer ${apiKey.trim()}`;
      }
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: modell.trim(),
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: base64 } },
              ],
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      setAntwort(data.choices?.[0]?.message?.content ?? "(keine Antwort)");
    } catch (err) {
      setFehler(`Anfrage fehlgeschlagen: ${err.message}`);
    } finally {
      setLaedtAntwort(false);
    }
  };

  const feld = { display: "grid", gap: 4 };

  return (
    <div style={{ maxWidth: 600, display: "grid", gap: 12 }}>
      <fieldset style={{ display: "grid", gap: 10 }}>
        <legend>Einstellungen</legend>

        <label style={feld}>
          Base-URL
          <input
            type="text"
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
          />
        </label>

        <label style={feld}>
          Modellname
          <input
            type="text"
            value={modell}
            onChange={(e) => setModell(e.target.value)}
          />
        </label>

        <label style={feld}>
          Key
          <input
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
        </label>

        <label style={feld}>
          Maximale Bildbreite: {maxBreiteProzent} % der Originalbreite
          <input
            type="range"
            min={1}
            max={100}
            value={maxBreiteProzent}
            onChange={(e) => setMaxBreiteProzent(e.target.value)}
          />
        </label>

        <label style={feld}>
          Kompression / JPEG-Qualität: {qualitaet} %
          <input
            type="range"
            min={1}
            max={100}
            value={qualitaet}
            onChange={(e) => setQualitaet(e.target.value)}
          />
        </label>
      </fieldset>

      <div>
        <input type="file" accept="image/*" onChange={handleAuswahl} />
        <button onClick={handleLaden} disabled={!datei}>
          laden
        </button>
      </div>

      {base64 && masse && (
        <div>
          <img
            src={base64}
            alt="Vorschau"
            style={{ maxWidth: "100%", maxHeight: 250 }}
          />
          <br />
          <small>
            {masse.original.breite} × {masse.original.hoehe} px →{" "}
            {masse.neu.breite} × {masse.neu.hoehe} px
            {" · "}
            Base64: {(base64.length / 1024).toFixed(0)} KB
          </small>
        </div>
      )}

      <textarea
        rows={4}
        placeholder="Prompt eingeben, z. B. „Beschreibe das Bild“"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleSenden}
        disabled={!base64 || !prompt.trim() || laedtAntwort}
      >
        {laedtAntwort ? "Sende …" : "An LLM senden"}
      </button>

      {fehler && <p style={{ color: "red" }}>{fehler}</p>}

      {antwort && (
        <div>
          <strong>Antwort:</strong>
          <p style={{ whiteSpace: "pre-wrap" }}>{antwort}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Skaliert ein Bild auf prozent % der Originalbreite und gibt
 * eine Data-URL samt Original- und Zielmassen zurück.
 * prozent: 1 bis 100, qualitaet: 0.01 bis 1 (wirkt nur bei JPEG)
 */
function skaliereBild(datei, prozent, qualitaet) {
  return new Promise((resolve, reject) => {
    const objektUrl = URL.createObjectURL(datei);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objektUrl);

      const faktor = Math.min(1, prozent / 100);
      const breite = Math.max(1, Math.round(img.naturalWidth * faktor));
      const hoehe = Math.max(1, Math.round(img.naturalHeight * faktor));

      const canvas = document.createElement("canvas");
      canvas.width = breite;
      canvas.height = hoehe;

      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, breite, hoehe);

      resolve({
        dataUrl: canvas.toDataURL("image/jpeg", qualitaet),
        original: { breite: img.naturalWidth, hoehe: img.naturalHeight },
        neu: { breite, hoehe },
      });
    };

    img.onerror = () => {
      URL.revokeObjectURL(objektUrl);
      reject(new Error("Das Bild konnte nicht geladen werden."));
    };

    img.src = objektUrl;
  });
}
