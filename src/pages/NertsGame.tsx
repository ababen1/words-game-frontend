import PlayingCard from "@/components/cards/Card";

export default function NertsGame() {

    const containerStyle = {
    "width": "100%",
    "height": "100%",
    "display": "flex", 
    "gap": "16px", 
    }        
  return (
    <div style={containerStyle}>
        <PlayingCard rank="KING" suit="SPADE" />
    </div>
  );
}