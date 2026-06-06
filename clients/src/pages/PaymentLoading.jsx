import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

const PaymentLoading = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [message, setMessage] = useState("Verifying your payment...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(search);
    const reference = params.get("reference");
    const orderId = params.get("orderId");

    const verifyPayment = async () => {
      if (!reference || !orderId) {
        setMessage("Missing payment reference or order information.");
        setLoading(false);
        return;
      }

      const token = JSON.parse(localStorage.getItem("user"))?.token;

      try {
        const API_BASE = import.meta.env.VITE_API_BASE_URL;
        const res = await fetch(`${API_BASE}/api/payment/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ reference, orderId }),
        });

        const data = await res.json();

        if (!res.ok) {
          setMessage(data.message || "Payment verification failed.");
          setLoading(false);
          return;
        }

        navigate("/order-success", { state: { order: data.order } });
      } catch (error) {
        console.error("Payment verification error:", error);
        setMessage(
          "Unable to verify payment at this time. Please try again later.",
        );
        setLoading(false);
      }
    };

    verifyPayment();
  }, [search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-2xl shadow">
        {loading ? (
          <>
            <Loader2 className="animate-spin mx-auto text-primary" size={48} />
            <h2 className="mt-4 text-xl font-semibold">Processing payment</h2>
            <p className="text-gray-500 mt-2">
              Please wait while we confirm your payment.
            </p>
          </>
        ) : (
          <>
            <h2 className="mt-4 text-xl font-semibold">Payment Status</h2>
            <p className="text-gray-500 mt-2">{message}</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentLoading;
// import { useEffect } from "react";
// import { useNavigate } from "react-router-dom";

// const PaymentLoading = () => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     // ⏳ Wait 3 seconds before redirect
//     const timer = setTimeout(() => {
//       navigate("/order-success");
//     }, 3000);

//     return () => clearTimeout(timer);
//   }, [navigate]);

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
//       <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>

//       <h2 className="mt-6 text-xl font-semibold text-gray-700">
//         Payment Successful 🎉
//       </h2>

//       <p className="text-gray-500 mt-2">
//         Please wait while we confirm your payment...
//       </p>
//     </div>
//   );
// };

// export default PaymentLoading;
