import WebsiteLayout from '@/components/WebsiteLayout';
import { Separator } from '@/components/ui/separator';

const PrivacyPolicy = () => {
  const currentYear = new Date().getFullYear();

  return (
    <WebsiteLayout>
      <div className="bg-background py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: February 20, {currentYear}</p>
          <Separator className="mb-10" />

          <div className="prose prose-sm max-w-none space-y-8 text-foreground/90 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">1. Introduction</h2>
              <p>Freight Flow CRM ("Company", "we", "us", or "our") is committed to protecting your privacy. This Privacy Policy ("Policy") describes how we collect, use, store, share, and protect your personal information when you use our freight forwarding management platform, websites, applications, and related services (collectively, the "Services").</p>
              <p>By accessing or using the Services, you expressly consent to the collection, use, disclosure, and processing of your personal information as described in this Policy. If you do not agree with this Policy, you must discontinue use of the Services immediately.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">2. Information We Collect</h2>
              <p>We collect and process the following categories of information:</p>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.1 Information You Provide Directly</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Account Information:</strong> Name, email address, phone number, company name, password, and other registration details;</li>
                <li><strong>Shipment Data:</strong> Consignee and shipper details, commodity descriptions, container numbers, bill of lading information, customs data (BE number, IEC number), shipping line details, weights, measurements, and all related logistics data;</li>
                <li><strong>Customer Records:</strong> Names, addresses, contact details, company information, and notes related to your customers, consignees, and shippers;</li>
                <li><strong>Documents:</strong> Bills of lading, invoices, packing lists, customs declarations, and any other documents uploaded to the platform;</li>
                <li><strong>Communications:</strong> Messages, emails, feedback, support requests, and any other communications with the Company;</li>
                <li><strong>Financial Information:</strong> Payment details, billing addresses, and transaction records where applicable.</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.2 Information Collected Automatically</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Usage Data:</strong> Pages visited, features used, actions taken, time spent on the platform, search queries, click patterns, and interaction logs;</li>
                <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device identifiers, screen resolution, and language preferences;</li>
                <li><strong>Cookies and Tracking Technologies:</strong> We use cookies, web beacons, pixel tags, and similar technologies to collect information about your browsing behaviour and preferences;</li>
                <li><strong>Log Data:</strong> Server logs, error reports, access times, referring URLs, and other diagnostic data;</li>
                <li><strong>Location Data:</strong> Approximate geographic location derived from your IP address.</li>
              </ul>

              <h3 className="text-lg font-medium text-foreground mt-4 mb-2">2.3 Information from Third Parties</h3>
              <p>We may receive information about you from third-party services, business partners, shipping lines, customs authorities, and publicly available sources to supplement the information we collect directly.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">3. How We Use Your Information</h2>
              <p>We use your information for the following purposes, and you expressly consent to all such uses:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>To provide, maintain, operate, and improve the Services;</li>
                <li>To process and manage shipments, documents, milestones, and logistics operations;</li>
                <li>To manage your account and provide customer support;</li>
                <li>To send administrative notifications, service updates, security alerts, and operational communications;</li>
                <li>To send promotional communications, marketing materials, newsletters, and offers (you may opt out of marketing communications, but not operational ones);</li>
                <li>To generate analytics, reports, insights, and AI-powered recommendations;</li>
                <li>To train, improve, and develop our AI models and machine learning algorithms using aggregated and anonymized data;</li>
                <li>To monitor and analyse usage trends, performance metrics, and user behaviour;</li>
                <li>To detect, prevent, and address fraud, security breaches, and technical issues;</li>
                <li>To comply with legal obligations, enforce our Terms of Service, and protect the Company's rights and interests;</li>
                <li>To conduct research, develop new features, and improve our products and services;</li>
                <li>For any other purpose with your consent or as permitted by applicable law.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Sharing and Disclosure</h2>
              <p>We may share your information with the following categories of recipients:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Service Providers:</strong> Third-party vendors, contractors, and agents who perform services on our behalf, including cloud hosting, data storage, analytics, email delivery, payment processing, and customer support;</li>
                <li><strong>Business Partners:</strong> Shipping lines, freight carriers, customs brokers, port authorities, and other logistics partners as necessary to facilitate your shipments;</li>
                <li><strong>Affiliates:</strong> Our parent company, subsidiaries, and affiliated entities for business operations and service delivery;</li>
                <li><strong>Legal and Regulatory:</strong> Government authorities, law enforcement agencies, courts, and regulatory bodies when required by law, legal process, or governmental request, or when we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others;</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, acquisition, reorganisation, sale of assets, or bankruptcy, your information may be transferred to the acquiring entity;</li>
                <li><strong>With Your Consent:</strong> To any other party when you have provided your express consent.</li>
              </ul>
              <p className="mt-3">The Company shall not be responsible for the privacy practices of any third parties with whom your information is shared. We encourage you to review the privacy policies of such third parties.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">5. Data Retention</h2>
              <p>We retain your personal information for as long as your account is active, as needed to provide the Services, and for a reasonable period thereafter for legitimate business purposes, including but not limited to compliance with legal obligations, resolving disputes, enforcing agreements, conducting audits, and pursuing legitimate business interests.</p>
              <p>Even after account deletion or termination, we may retain certain information in aggregated, anonymized, or de-identified form for analytics, research, and improvement of the Services, and such retained data shall not be subject to deletion requests. We may also retain backup copies of your data for a reasonable period as part of our disaster recovery procedures.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">6. Data Security</h2>
              <p>We implement industry-standard technical and organizational security measures designed to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include encryption, access controls, secure data storage, and regular security assessments.</p>
              <p>However, no method of transmission over the Internet or method of electronic storage is completely secure. While we strive to use commercially reasonable means to protect your personal information, we cannot guarantee its absolute security. YOU ACKNOWLEDGE AND AGREE THAT YOU TRANSMIT DATA TO THE SERVICES AT YOUR OWN RISK, and the Company shall not be liable for any unauthorized access, data breach, or loss of data except to the extent directly caused by the Company's gross negligence.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">7. Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar tracking technologies to enhance your experience, analyse usage patterns, and deliver targeted content. By using the Services, you consent to the use of cookies as described in this Policy.</p>
              <p>Types of cookies we use include:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Essential Cookies:</strong> Required for the basic functionality of the Services and cannot be disabled;</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how users interact with the Services to improve performance and user experience;</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings for a more personalized experience;</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and track campaign effectiveness.</li>
              </ul>
              <p className="mt-3">You may manage cookie preferences through your browser settings. However, disabling certain cookies may impair the functionality of the Services, and the Company shall not be responsible for any resulting degradation in service quality.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">8. International Data Transfers</h2>
              <p>Your information may be transferred to and processed in countries other than your country of residence, including countries that may not provide the same level of data protection as your home country. By using the Services, you expressly consent to such transfers. The Company shall take reasonable steps to ensure that your data is treated securely and in accordance with this Policy, but makes no guarantees regarding the data protection standards of any foreign jurisdiction.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">9. Your Rights</h2>
              <p>Subject to applicable law and at the Company's discretion, you may have certain rights regarding your personal information, including:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li>The right to access your personal information held by us;</li>
                <li>The right to request correction of inaccurate or incomplete information;</li>
                <li>The right to request deletion of your personal information (subject to our data retention policies and legal obligations);</li>
                <li>The right to object to or restrict certain processing activities;</li>
                <li>The right to data portability where technically feasible.</li>
              </ul>
              <p className="mt-3">To exercise any of these rights, please contact us at the details provided below. We reserve the right to verify your identity before processing any such request and may charge a reasonable fee for manifestly unfounded or excessive requests. We will respond to valid requests within a reasonable timeframe as required by applicable law, but no later than ninety (90) days from receipt of the request.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">10. Children's Privacy</h2>
              <p>The Services are not intended for use by individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child, we will take steps to delete such information. If you believe that a child has provided us with personal information, please contact us immediately.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">11. Third-Party Links and Services</h2>
              <p>The Services may contain links to third-party websites, applications, or services. This Policy does not apply to such third-party services, and the Company is not responsible for their privacy practices or content. We encourage you to review the privacy policies of any third-party services you access through the Platform.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">12. Changes to This Policy</h2>
              <p>The Company reserves the right to modify this Privacy Policy at any time, at its sole discretion, without prior notice. Any changes will be effective immediately upon posting on the Platform. Your continued use of the Services after any modification constitutes your acceptance of the revised Policy. It is your responsibility to review this Policy periodically for updates.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">13. Governing Law</h2>
              <p>This Privacy Policy shall be governed by and construed in accordance with the laws of India, including the Information Technology Act, 2000, and the rules made thereunder, without regard to conflict of law provisions. Any disputes arising under this Policy shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra, India.</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">14. Contact Us</h2>
              <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
              <div className="bg-muted/50 rounded-lg p-4 mt-3">
                <p className="font-medium text-foreground">Freight Flow CRM — Data Protection Office</p>
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

export default PrivacyPolicy;
