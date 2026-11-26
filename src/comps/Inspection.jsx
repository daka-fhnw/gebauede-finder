export default function Inspection({ data, setData }) {
  return (
    <>
      <h2>Kontrolle</h2>
      {Object.entries(data).map(([key, value]) => (
        <div key={key}>
          <div>{value.name}</div>
          <img
            src={value.dataURL}
            alt="Vorschau"
            style={{ maxWidth: "100%", maxHeight: 250 }}
          />
          <hr />
        </div>
      ))}
    </>
  );
}
