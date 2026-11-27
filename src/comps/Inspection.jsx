export default function Inspection({ data }) {
  return (
    <>
      <h2>Kontrolle</h2>
      {data.map((entry) => (
        <div key={entry.name}>
          <div>{entry.name}</div>
          <img
            src={entry.dataURL}
            alt="Vorschau"
            style={{ maxWidth: "100%", maxHeight: 250 }}
          />
          <hr />
        </div>
      ))}
    </>
  );
}
