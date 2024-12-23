// /app/returns/page.tsx

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function ReturnsPage() {
  return (
    <div>
      <Navbar />
      <main className="py-12">
        <h1 className="text-3xl text-center font-bold">
          Returns and Exchanges
        </h1>
        <div className="mt-8 max-w-2xl mx-auto text-gray-700">
          <p>
            If you are not completely satisfied with your purchase, we offer
            easy returns and exchanges. Please read the following details:
          </p>
          <ul className="list-disc pl-5 mt-4">
            <li>Returns can be made within 30 days of receiving your order.</li>
            <li>
              Items must be unworn, unwashed, and with original tags attached.
            </li>
            <li>Return shipping is free for domestic returns.</li>
            <li>Refunds will be processed to the original payment method.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
