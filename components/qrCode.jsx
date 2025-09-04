import { useParams } from "react-router";
import QRCode from "react-qr-code";
export default function QrCode() {
  const params = useParams();
  const eventId = { params };
  return (
    <div className="min-h-screen flex justify-center items-center">
      <QRCode value={eventId} />
    </div>
  );
}
