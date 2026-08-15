import React from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import { Footer } from '../features/footer/Footer'
import { useTranslation } from 'react-i18next'

const Section = ({ number, title, children }) => (
    <div className="border border-gray-200 bg-white mb-4">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center gap-3">
            <span className="w-7 h-7 bg-[#E31837] text-white flex items-center justify-center text-xs font-bold">
                {number}
            </span>
            <h2 className="text-base font-bold text-gray-900 uppercase tracking-wide">{title}</h2>
        </div>
        <div className="px-6 py-5 text-sm text-gray-600 leading-relaxed space-y-3">
            {children}
        </div>
    </div>
);

const Bullet = ({ children }) => (
    <div className="flex gap-3">
        <span className="text-[#0055A4] font-bold mt-0.5">›</span>
        <span>{children}</span>
    </div>
);

export const PrivacyPolicyPage = () => {
    const { t } = useTranslation()

    const email = process.env.REACT_APP_CONTACT_EMAIL
    const phone = process.env.REACT_APP_CONTACT_PHONE
    const address = process.env.REACT_APP_CONTACT_ADDRESS

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {t('footer.privacyPolicy')}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Last updated: 15/08/2026
                    </p>
                </div>

                {/* Intro */}
                <div className="bg-white border border-gray-200 p-6 mb-6 text-sm text-gray-600 leading-relaxed">
                    SKSuperStore is a wholesale grocery ordering platform for retail shop owners and businesses, operated from Sakri Station Road, Brahmapur, Bihar. This policy explains what information we collect, how we use it, and the choices you have.
                </div>

                {/* Sections */}
                <Section number="1" title="Who We Are">
                    <p>SKSuperStore is operated from <strong className="text-gray-900">Sakri Station Road, Brahmapur, Bihar</strong>. This policy covers all data collected through our wholesale ordering platform.</p>
                </Section>

                <Section number="2" title="Information We Collect">
                    <div className="space-y-2">
                        <Bullet><strong className="text-gray-900">Account & shop details</strong> — name, phone number, email address, shop/business name, shop and delivery address, and password (stored securely, never in plain text).</Bullet>
                        <Bullet><strong className="text-gray-900">Order information</strong> — items ordered, quantities and pricing tier selected (Single, Pack, or Carton), order history, payment status.</Bullet>
                        <Bullet><strong className="text-gray-900">Optional details</strong> — your GST number, if you add one for invoicing.</Bullet>
                        <Bullet><strong className="text-gray-900">Reviews</strong> — any rating or review text you choose to submit on a product.</Bullet>
                        <Bullet><strong className="text-gray-900">Usage data</strong> — cart and wishlist contents (including as a guest, before you register), your language preference (English/Hindi), and basic device/browser information collected automatically.</Bullet>
                    </div>
                </Section>

                <Section number="3" title="How We Use Your Information">
                    <p className="mb-2">We use this information to:</p>
                    <div className="space-y-2">
                        <Bullet>Create and manage your account.</Bullet>
                        <Bullet>Process, fulfil, and deliver your orders to your shop.</Bullet>
                        <Bullet>Show you accurate tier pricing and order history.</Bullet>
                        <Bullet>Send order confirmations, delivery updates, and support responses.</Bullet>
                        <Bullet>Respond to queries and resolve complaints.</Bullet>
                        <Bullet>Improve the platform and catalogue based on what retailers order.</Bullet>
                        <Bullet>Prevent fraudulent or abusive use of the platform.</Bullet>
                    </div>
                    <p className="mt-3 text-gray-500 italic">We don't send marketing communications unless you've agreed to receive them, and you can opt out at any time.</p>
                </Section>

                <Section number="4" title="How We Share Your Information">
                    <p className="mb-2">We share information only where it's needed to run the platform:</p>
                    <div className="space-y-2">
                        <Bullet>With our <strong className="text-gray-900">delivery staff</strong>, so your order reaches your shop.</Bullet>
                        <Bullet>With <strong className="text-gray-900">payment processors</strong>, to complete and verify payments.</Bullet>
                        <Bullet>If required by <strong className="text-gray-900">law, court order, or government authority</strong>.</Bullet>
                    </div>
                    <p className="mt-3 font-semibold text-gray-900">We do not sell your personal information to third parties.</p>
                </Section>

                <Section number="5" title="Cookies & Local Storage">
                    <p>We use cookies and browser storage to keep you logged in, remember your cart and wishlist (including before you create an account), and remember your language preference. You can clear these through your browser settings, though parts of the site may not work as expected without them.</p>
                </Section>

                <Section number="6" title="How We Protect Your Information">
                    <p>Passwords are stored using industry-standard hashing, and the platform is served over HTTPS. We take reasonable security measures to protect your data from unauthorised access, in line with the security practices expected under India's <strong className="text-gray-900">IT Act</strong> and the <strong className="text-gray-900">Digital Personal Data Protection Act, 2023</strong>. No online platform can guarantee absolute security, but we work to keep your data safe.</p>
                </Section>

                <Section number="7" title="Your Rights">
                    <p className="mb-2">You can:</p>
                    <div className="space-y-2">
                        <Bullet>Access and update your account and shop details anytime by logging in.</Bullet>
                        <Bullet>Ask us to correct inaccurate information.</Bullet>
                        <Bullet>Request deletion of your account and associated data, subject to what we're required to retain for tax and invoicing records.</Bullet>
                        <Bullet>Withdraw consent for optional communications.</Bullet>
                    </div>
                    <p className="mt-3">To exercise any of these, contact us using the details below.</p>
                </Section>

                <Section number="8" title="How Long We Keep Your Data">
                    <p>We retain account and order information for as long as your account is active, and for as long afterward as required for GST and other statutory record-keeping.</p>
                </Section>

                <Section number="9" title="Children's Privacy">
                    <p>SKSuperStore is built for retail businesses and isn't directed at or intended for use by children.</p>
                </Section>

                <Section number="10" title="Changes to This Policy">
                    <p>We may update this policy as the platform grows or as regulations change. We'll update the "last updated" date at the top of this page whenever we do.</p>
                </Section>

                {/* Contact Box */}
                <div className="bg-[#0055A4] text-white p-6 mt-8">
                    <h3 className="text-lg font-bold mb-4 uppercase tracking-wide">Contact Us</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <p className="text-blue-200 text-xs uppercase font-semibold mb-1">Email</p>
                            <p className="font-medium">{email || '—'}</p>
                        </div>
                        <div>
                            <p className="text-blue-200 text-xs uppercase font-semibold mb-1">Phone</p>
                            <p className="font-medium">{phone || '—'}</p>
                        </div>
                        <div>
                            <p className="text-blue-200 text-xs uppercase font-semibold mb-1">Address</p>
                            <p className="font-medium">{address || '—'}</p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}