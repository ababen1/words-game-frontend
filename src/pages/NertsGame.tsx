import CardTable from "@/components/cards/CardTable";

export default function NertsGame() {
  const containerStyle = {
    "width": "100%",
    "height": "100%",
    "display": "flex",
    "gap": "16px",
  }

  return (
    <div style={containerStyle}>
      <CardTable>

      </CardTable>
    </div>
  );
}