import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms of Service",
    description: "Terms of Service for Spritz - Read our terms and conditions for using our Web3 communication platform",
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: "Terms of Service | Spritz",
        description: "Terms of Service for Spritz - Read our terms and conditions",
        url: "https://app.spritz.chat/tos",
    },
    alternates: {
        canonical: "https://app.spritz.chat/tos",
    },
};

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-orange-500 hover:text-orange-400 mb-6"
                    >
                        <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 19l-7-7m0 0l7-7m-7 7h18"
                            />
                        </svg>
                        Back to Spritz
                    </Link>
                    <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
                    <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString()}</p>
                </div>

                {/* Content */}
                <div className="prose prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            By accessing or using Spritz ("the Service"), available at{" "}
                            <a href="https://app.spritz.chat" className="text-orange-500 hover:text-orange-400">
                                app.spritz.chat
                            </a>
                            , you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these
                            Terms, you may not access or use the Service.
                        </p>
                        <p className="text-zinc-300 leading-relaxed mt-4">
                            These Terms constitute a legally binding agreement between you and Spritz. We may modify
                            these Terms at any time, and such modifications shall be effective immediately upon posting.
                            Your continued use of the Service after any such modifications constitutes your acceptance
                            of the modified Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
                        <p className="text-zinc-300 leading-relaxed mb-4">You must meet the following criteria to use Spritz:</p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                            <li>You are at least 18 years of age or the age of majority in your jurisdiction</li>
                            <li>You have the legal capacity to enter into these Terms</li>
                            <li>You are not prohibited from using the Service under applicable laws</li>
                            <li>You have a compatible Web3 wallet or are willing to create a passkey account</li>
                            <li>You agree to comply with all applicable laws and regulations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">3. Account Registration and Security</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">3.1 Wallet Connection</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            To use Spritz, you must connect a Web3 wallet (Ethereum, Base, Solana, or other supported
                            chains) or create a passkey account. You are solely responsible for:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
                            <li>Maintaining the security and confidentiality of your wallet private keys</li>
                            <li>All activities that occur under your wallet address</li>
                            <li>Any loss or theft of your wallet or private keys</li>
                            <li>Any transactions made from your wallet address</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">3.2 Account Responsibility</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            You are responsible for all activities that occur under your account, regardless of whether
                            you authorized such activities. You must immediately notify us of any unauthorized use of
                            your account or any other breach of security.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">3.3 Username and Identity</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            You may choose to claim a Spritz username. Usernames must not:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
                            <li>Infringe on any third-party rights (trademarks, copyrights, etc.)</li>
                            <li>Be offensive, abusive, or discriminatory</li>
                            <li>Impersonate another person or entity</li>
                            <li>Contain profanity or hate speech</li>
                            <li>Violate any applicable laws</li>
                        </ul>
                        <p className="text-zinc-300 leading-relaxed mt-4">
                            We reserve the right to revoke or modify usernames that violate these Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">4. Acceptable Use</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">4.1 Permitted Uses</h3>
                        <p className="text-zinc-300 leading-relaxed">You may use Spritz to:</p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                            <li>Communicate with other users via messaging, voice, and video calls</li>
                            <li>Create and participate in group chats</li>
                            <li>Broadcast livestreams</li>
                            <li>Create and interact with AI agents</li>
                            <li>Connect with friends and build your network</li>
                            <li>Use calendar integration features (if available)</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">4.2 Prohibited Uses</h3>
                        <p className="text-zinc-300 leading-relaxed">You agree NOT to:</p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                            <li>
                                <strong>Illegal Activities:</strong> Use the Service for any illegal purpose or in
                                violation of any local, state, national, or international law
                            </li>
                            <li>
                                <strong>Harassment:</strong> Harass, abuse, threaten, or harm other users
                            </li>
                            <li>
                                <strong>Spam:</strong> Send unsolicited messages, spam, or bulk communications
                            </li>
                            <li>
                                <strong>Malicious Content:</strong> Transmit viruses, malware, or other harmful code
                            </li>
                            <li>
                                <strong>Impersonation:</strong> Impersonate any person or entity or falsely state or
                                misrepresent your affiliation with any person or entity
                            </li>
                            <li>
                                <strong>Intellectual Property:</strong> Infringe on any intellectual property rights,
                                including copyrights, trademarks, or patents
                            </li>
                            <li>
                                <strong>Privacy Violations:</strong> Collect, store, or share personal information of
                                other users without their consent
                            </li>
                            <li>
                                <strong>Fraud:</strong> Engage in fraud, phishing, or other deceptive practices
                            </li>
                            <li>
                                <strong>Manipulation:</strong> Manipulate or interfere with the Service's functionality
                            </li>
                            <li>
                                <strong>Reverse Engineering:</strong> Reverse engineer, decompile, or disassemble any
                                part of the Service
                            </li>
                            <li>
                                <strong>Commercial Use:</strong> Use the Service for commercial purposes without our
                                prior written consent (except for permitted features like AI agent monetization)
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">5. Content and Intellectual Property</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">5.1 Your Content</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            You retain ownership of any content you create, upload, or transmit through Spritz
                            ("Your Content"). By using the Service, you grant us a worldwide, non-exclusive,
                            royalty-free license to use, reproduce, modify, and distribute Your Content solely for the
                            purpose of providing and improving the Service.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">5.2 Our Content</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            The Service, including its original content, features, and functionality, is owned by Spritz
                            and is protected by international copyright, trademark, patent, trade secret, and other
                            intellectual property laws. You may not copy, modify, distribute, sell, or lease any part of
                            the Service without our prior written consent.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">5.3 Third-Party Content</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            The Service may contain content from third parties, including other users. We are not
                            responsible for the accuracy, completeness, or legality of third-party content. You use such
                            content at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">6. AI Agents</h2>
                        <p className="text-zinc-300 leading-relaxed mb-4">
                            Spritz allows users to create and interact with AI agents. When using AI agents:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                            <li>
                                You are responsible for the content and behavior of any AI agents you create
                            </li>
                            <li>
                                AI agents must comply with all applicable laws and these Terms
                            </li>
                            <li>
                                We do not guarantee the accuracy, reliability, or appropriateness of AI-generated
                                content
                            </li>
                            <li>
                                You may monetize your AI agents using x402 payments, subject to applicable laws and
                                regulations
                            </li>
                            <li>
                                We reserve the right to remove or disable AI agents that violate these Terms
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">7. Payments and Transactions</h2>
                        <p className="text-zinc-300 leading-relaxed mb-4">
                            Certain features of Spritz may involve payments or transactions:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                            <li>
                                <strong>Blockchain Transactions:</strong> Some features may require blockchain
                                transactions (e.g., x402 payments). You are responsible for all gas fees and
                                transaction costs.
                            </li>
                            <li>
                                <strong>Payment Processing:</strong> Payments may be processed through third-party
                                services. We are not responsible for payment processing errors or disputes.
                            </li>
                            <li>
                                <strong>Refunds:</strong> Refund policies vary by feature and are subject to applicable
                                laws.
                            </li>
                            <li>
                                <strong>Taxes:</strong> You are responsible for any taxes arising from your use of paid
                                features.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">8. Privacy</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Your use of the Service is also governed by our{" "}
                            <Link href="/privacy" className="text-orange-500 hover:text-orange-400">
                                Privacy Policy
                            </Link>
                            . By using the Service, you consent to the collection and use of your information as
                            described in the Privacy Policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">9. Disclaimers</h2>
                        <p className="text-zinc-300 leading-relaxed mb-4">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
                            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                            <li>
                                We do not guarantee that the Service will be uninterrupted, secure, or error-free
                            </li>
                            <li>
                                We do not guarantee the accuracy, completeness, or usefulness of any information on the
                                Service
                            </li>
                            <li>
                                We are not responsible for any loss of data, funds, or other damages resulting from
                                your use of the Service
                            </li>
                            <li>
                                We do not guarantee compatibility with all wallets, devices, or browsers
                            </li>
                            <li>
                                We are not responsible for the actions, content, or information of other users
                            </li>
                            <li>
                                We do not guarantee the security of blockchain transactions or wallet connections
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SPRITZ AND ITS AFFILIATES, OFFICERS, DIRECTORS,
                            EMPLOYEES, AND AGENTS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                            CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
                            <li>Loss of profits, revenue, data, or use</li>
                            <li>Loss of cryptocurrency or digital assets</li>
                            <li>Loss of wallet access or private keys</li>
                            <li>Business interruption</li>
                            <li>Personal injury or property damage</li>
                            <li>Any other damages arising from your use of the Service</li>
                        </ul>
                        <p className="text-zinc-300 leading-relaxed mt-4">
                            OUR TOTAL LIABILITY TO YOU FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT
                            EXCEED THE AMOUNT YOU PAID TO US IN THE TWELVE (12) MONTHS PRIOR TO THE CLAIM, OR $100,
                            WHICHEVER IS GREATER.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            You agree to indemnify, defend, and hold harmless Spritz and its affiliates, officers,
                            directors, employees, and agents from and against any and all claims, damages, obligations,
                            losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising
                            from:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4 mt-4">
                            <li>Your use of the Service</li>
                            <li>Your violation of these Terms</li>
                            <li>Your violation of any third-party rights</li>
                            <li>Your violation of any applicable laws or regulations</li>
                            <li>Any content you submit, post, or transmit through the Service</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">12. Termination</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">12.1 Termination by You</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            You may stop using the Service at any time. You may request deletion of your account and
                            data by contacting us.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">12.2 Termination by Us</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            We may suspend or terminate your access to the Service immediately, without prior notice, if:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                            <li>You violate these Terms</li>
                            <li>You engage in fraudulent, abusive, or illegal activity</li>
                            <li>We are required to do so by law</li>
                            <li>We discontinue the Service</li>
                        </ul>

                        <h3 className="text-xl font-semibold mb-3 mt-6">12.3 Effect of Termination</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            Upon termination, your right to use the Service will immediately cease. We may delete your
                            account and data, subject to our data retention policies and legal obligations. Provisions
                            of these Terms that by their nature should survive termination shall survive termination.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">13. Dispute Resolution</h2>

                        <h3 className="text-xl font-semibold mb-3 mt-6">13.1 Governing Law</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            These Terms shall be governed by and construed in accordance with the laws of [Your
                            Jurisdiction], without regard to its conflict of law provisions.
                        </p>

                        <h3 className="text-xl font-semibold mb-3 mt-6">13.2 Dispute Resolution Process</h3>
                        <p className="text-zinc-300 leading-relaxed">
                            Any disputes arising out of or relating to these Terms or the Service shall be resolved
                            through binding arbitration in accordance with the rules of [Arbitration Organization],
                            except where prohibited by law. You waive your right to a jury trial and to participate in
                            a class action lawsuit.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">14. Blockchain and Decentralization</h2>
                        <p className="text-zinc-300 leading-relaxed mb-4">
                            Spritz leverages blockchain technology and decentralized protocols. Please be aware that:
                        </p>
                        <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                            <li>
                                Blockchain transactions are irreversible and publicly visible
                            </li>
                            <li>
                                You are solely responsible for the security of your wallet and private keys
                            </li>
                            <li>
                                We cannot reverse, cancel, or modify blockchain transactions
                            </li>
                            <li>
                                Network fees (gas fees) are determined by the blockchain network, not by us
                            </li>
                            <li>
                                Decentralized protocols may have different security and privacy characteristics than
                                centralized services
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">15. Changes to the Service</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            We reserve the right to modify, suspend, or discontinue any part of the Service at any time,
                            with or without notice. We shall not be liable to you or any third party for any
                            modification, suspension, or discontinuation of the Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">16. Beta Features</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            Some features of Spritz may be labeled as "beta" or "experimental." These features are
                            provided "as is" and may be unstable, incomplete, or subject to change. We make no guarantees
                            about beta features and you use them at your own risk.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">17. Third-Party Services</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            The Service may integrate with or link to third-party services, including but not limited to:
                            wallet providers, blockchain networks, payment processors, and cloud services. We are not
                            responsible for the availability, accuracy, or practices of third-party services. Your
                            interactions with third-party services are subject to their respective terms and policies.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">18. Export Restrictions</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            The Service may be subject to export control laws and regulations. You agree to comply with
                            all applicable export and re-export control laws and regulations, including those of the
                            United States and other countries.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">19. Severability</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            If any provision of these Terms is found to be unenforceable or invalid, that provision
                            shall be limited or eliminated to the minimum extent necessary, and the remaining provisions
                            shall remain in full force and effect.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">20. Entire Agreement</h2>
                        <p className="text-zinc-300 leading-relaxed">
                            These Terms, together with our Privacy Policy, constitute the entire agreement between you
                            and Spritz regarding the use of the Service and supersede all prior agreements and
                            understandings.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mb-4">21. Contact Information</h2>
                        <p className="text-zinc-300 leading-relaxed mb-4">
                            If you have any questions about these Terms, please contact us:
                        </p>
                        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
                            <p className="text-zinc-300">
                                <strong>Email:</strong>{" "}
                                <a
                                    href="mailto:legal@spritz.chat"
                                    className="text-orange-500 hover:text-orange-400"
                                >
                                    legal@spritz.chat
                                </a>
                            </p>
                            <p className="text-zinc-300 mt-2">
                                <strong>Website:</strong>{" "}
                                <a
                                    href="https://app.spritz.chat"
                                    className="text-orange-500 hover:text-orange-400"
                                >
                                    app.spritz.chat
                                </a>
                            </p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="mt-12 pt-8 border-t border-zinc-800 text-center text-zinc-500 text-sm">
                    <p>© {new Date().getFullYear()} Spritz. All rights reserved.</p>
                    <p className="mt-2">
                        <Link href="/privacy" className="text-orange-500 hover:text-orange-400">
                            Privacy Policy
                        </Link>
                        {" • "}
                        <Link href="/tos" className="text-orange-500 hover:text-orange-400">
                            Terms of Service
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

