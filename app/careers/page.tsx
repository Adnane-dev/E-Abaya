import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link"; // Ensure Link is imported

const CareersPage = () => {
  return (
    <div className="bg-white">
      <Navbar /> {/* Add the Navbar component */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900">
          Careers at Islamic Fashion
        </h1>
        <p className="mt-4 text-gray-600">
          Join our team and help us revolutionize the fashion industry! At
          Islamic Fashion, we are passionate about creating beautiful and
          sustainable clothing that empowers individuals to express their unique
          style. We are always looking for talented and driven individuals who
          share our values and vision.
        </p>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Open Positions
          </h2>
          <div className="space-y-6 mt-4">
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800">
                Fashion Designer
              </h3>
              <p className="text-gray-600">
                We are looking for a creative and passionate Fashion Designer to
                join our team. You will be responsible for designing unique and
                sustainable clothing collections that reflect our brand s values
                and aesthetics.
              </p>
              <Link
                href="/careers/fashion-designer"
                className="text-primary mt-2 inline-block"
              >
                Learn More
              </Link>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800">
                Marketing Manager
              </h3>
              <p className="text-gray-600">
                As a Marketing Manager, you will develop and implement strategic
                marketing campaigns to promote our brand and products. You
                should have experience in digital marketing and a strong
                understanding of consumer behavior.
              </p>
              <Link
                href="/careers/marketing-manager"
                className="text-primary mt-2 inline-block"
              >
                Learn More
              </Link>
            </div>
            <div className="border p-4 rounded-lg">
              <h3 className="text-lg font-bold text-gray-800">
                Customer Support Specialist
              </h3>
              <p className="text-gray-600">
                Join our customer support team to assist customers with their
                inquiries, product information, and order issues. You will be
                the face of our brand and ensure that every customer has an
                excellent experience with us.
              </p>
              <Link
                href="/careers/customer-support"
                className="text-primary mt-2 inline-block"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer /> {/* Add the Footer component */}
    </div>
  );
};

export default CareersPage;
