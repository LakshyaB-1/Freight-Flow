import WebsiteLayout from '@/components/WebsiteLayout';
import { Separator } from '@/components/ui/separator';

const TermsOfService = () => {
  const currentYear = new Date().getFullYear();

  return (
    <WebsiteLayout>
      <div className="bg-background py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: February 20, {currentYear}</p>
          <Separator className="mb-10" />

          <div className="prose prose-sm max-w-none space-y-8 text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
              <p>By accessing, browsing, or using the Freight Flow CRM platform ("Platform"), including all associated websites, applications, tools, and services (collectively, the "Services"), you ("User", "you", or "your") acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms in their entirety, you must immediately cease all use of the Services. Your continued use of the Platform constitutes irrevocable acceptance of these Terms and any amendments thereto.</p>
              <p>Freight Flow CRM ("Company", "we", "us", or "our") reserves the sole and absolute right to modify, amend, or update these Terms at any time without prior notice. It is your responsibility to review these Terms periodically. Continued use of the Services after any modification constitutes acceptance of the revised Terms.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Eligibility and Account Registration</h2>
              <p>The Services are available only to individuals who are at least 18 years of age and entities that can form legally binding contracts under applicable law. By registering an account, you represent and warrant that all information provided is accurate, current, and complete, and you agree to maintain the accuracy of such information.</p>
              <p>You are solely responsible for maintaining the confidentiality of your account credentials, including your password. You accept full responsibility for all activities that occur under your account, whether or not authorized by you. The Company shall not be liable for any loss or damage arising from your failure to safeguard your account credentials. You must notify the Company immediately of any unauthorized use of your account.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. Description of Services</h2>
              <p>Freight Flow CRM provides a cloud-based freight forwarding management platform that includes, but is not limited to, shipment tracking, customer relationship management, document management, analytics and reporting, task management, and AI-assisted tools. The Services are provided on an "as is" and "as available" basis.</p>
              <p>The Company reserves the right to modify, suspend, discontinue, or restrict access to any or all features of the Services at any time, with or without notice, and without liability to you. We do not guarantee uninterrupted, timely, secure, or error-free operation of the Services.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. User Obligations and Acceptable Use</h2>
              <p>You agree to use the Services solely for lawful purposes and in compliance with all applicable local, state, national, and international laws and regulations. You shall not:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Use the Services for any unlawful, fraudulent, or malicious purpose;</li>
                <li>Upload, transmit, or distribute any content that is defamatory, obscene, infringing, or otherwise objectionable;</li>
                <li>Attempt to gain unauthorized access to any part of the Services, other user accounts, or any systems or networks connected to the Services;</li>
                <li>Interfere with or disrupt the integrity or performance of the Services or the data contained therein;</li>
                <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code of the Services;</li>
                <li>Use any automated means, including bots, scrapers, or crawlers, to access or collect data from the Services;</li>
                <li>Resell, sublicense, or redistribute the Services or any part thereof without express written consent from the Company;</li>
                <li>Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity.</li>
              </ul>
              <p className="mt-3">Violation of any of these provisions may result in immediate termination of your account and access to the Services, without refund or compensation, and may subject you to legal action.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Intellectual Property Rights</h2>
              <p>All content, features, functionality, software, designs, graphics, trademarks, service marks, trade names, logos, and other intellectual property displayed on or available through the Services are the exclusive property of Freight Flow CRM or its licensors and are protected by copyright, trademark, patent, trade secret, and other intellectual property laws.</p>
              <p>No right, title, or interest in any content or materials is transferred to you by virtue of accessing or using the Services. You are granted a limited, non-exclusive, non-transferable, revocable license to access and use the Services strictly in accordance with these Terms. Any unauthorized reproduction, distribution, modification, or use of the Company's intellectual property is strictly prohibited and may result in civil and criminal penalties.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. User Content and Data</h2>
              <p>You retain ownership of any data, documents, or content you upload, submit, or transmit through the Services ("User Content"). However, by submitting User Content, you grant the Company a worldwide, non-exclusive, royalty-free, perpetual, irrevocable license to use, reproduce, modify, adapt, publish, translate, distribute, and display such User Content for the purpose of providing, maintaining, and improving the Services.</p>
              <p>You represent and warrant that you own or have the necessary rights and permissions to submit User Content and that such content does not infringe upon any third-party rights. The Company assumes no responsibility or liability for any User Content uploaded by you or any third party.</p>
              <p>The Company reserves the right, but not the obligation, to review, monitor, edit, or remove any User Content at its sole discretion, without notice and for any reason.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Disclaimer of Warranties</h2>
              <p>THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. THE COMPANY DOES NOT WARRANT THAT THE SERVICES WILL MEET YOUR REQUIREMENTS, THAT THE OPERATION OF THE SERVICES WILL BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED.</p>
              <p>THE COMPANY MAKES NO WARRANTIES OR REPRESENTATIONS REGARDING THE ACCURACY, RELIABILITY, OR COMPLETENESS OF ANY INFORMATION, CONTENT, OR MATERIALS PROVIDED THROUGH THE SERVICES, INCLUDING ANY AI-GENERATED CONTENT, ANALYTICS, OR RECOMMENDATIONS. ANY RELIANCE ON SUCH INFORMATION IS STRICTLY AT YOUR OWN RISK.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. Limitation of Liability</h2>
              <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL FREIGHT FLOW CRM, ITS DIRECTORS, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, USE, DATA, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>Your access to or use of, or inability to access or use, the Services;</li>
                <li>Any conduct or content of any third party on the Services;</li>
                <li>Any content obtained from the Services;</li>
                <li>Unauthorized access, use, or alteration of your transmissions or content;</li>
                <li>Delay or failure in performance resulting from causes beyond the Company's reasonable control;</li>
                <li>Loss of shipment data, documents, or business records;</li>
                <li>Any errors, inaccuracies, or omissions in AI-generated content or recommendations.</li>
              </ul>
              <p className="mt-3">IN NO EVENT SHALL THE COMPANY'S TOTAL AGGREGATE LIABILITY EXCEED THE AMOUNT PAID BY YOU, IF ANY, TO THE COMPANY FOR USE OF THE SERVICES DURING THE SIX (6) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR ONE HUNDRED INDIAN RUPEES (₹100), WHICHEVER IS LESS.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Indemnification</h2>
              <p>You agree to defend, indemnify, and hold harmless Freight Flow CRM, its officers, directors, employees, agents, licensors, and suppliers from and against any and all claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms, your use of the Services, your User Content, or your violation of any law or the rights of any third party.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Termination</h2>
              <p>The Company may terminate or suspend your account and access to the Services immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach these Terms. Upon termination, your right to use the Services will immediately cease.</p>
              <p>The Company shall not be liable to you or any third party for any termination of your access to the Services. All provisions of these Terms which by their nature should survive termination shall survive, including without limitation ownership provisions, warranty disclaimers, indemnification, and limitations of liability.</p>
              <p>Upon termination, the Company may, at its sole discretion, delete your account and all associated data without any obligation to provide you with a copy of such data. It is your sole responsibility to export or back up your data prior to termination.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Force Majeure</h2>
              <p>The Company shall not be liable for any failure or delay in performing its obligations under these Terms where such failure or delay results from any cause beyond the Company's reasonable control, including but not limited to acts of God, war, terrorism, civil unrest, pandemics, epidemics, government actions, natural disasters, power outages, internet or telecommunications failures, cyberattacks, or any other event outside the Company's reasonable control.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. Governing Law and Dispute Resolution</h2>
              <p>These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Mumbai, Maharashtra, India.</p>
              <p>Before initiating any legal proceedings, you agree to first attempt to resolve any dispute informally by contacting the Company. If the dispute is not resolved within thirty (30) days of such contact, either party may proceed with formal dispute resolution.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">13. Severability</h2>
              <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, and the remaining provisions shall continue in full force and effect.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">14. Entire Agreement</h2>
              <p>These Terms, together with the Privacy Policy and any other legal notices or agreements published by the Company on the Services, constitute the entire agreement between you and the Company concerning the Services and supersede all prior or contemporaneous communications, proposals, and agreements, whether oral or written, between you and the Company.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">15. Contact Information</h2>
              <p>For any questions or concerns regarding these Terms of Service, please contact us at:</p>
              <div className="bg-muted/50 rounded-lg p-4 mt-3">
                <p className="font-medium text-foreground">Freight Flow CRM</p>
                <p>Email: support@freightflowcrm.com</p>
                <p>Phone: +91 98765 43210</p>
                <p>Address: Mumbai, Maharashtra, India</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </WebsiteLayout>
  );
};

export default TermsOfService;
