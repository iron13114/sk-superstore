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

export const TermsOfUsePage = () => {
    const { t } = useTranslation()
    
    const email = import.meta.VITE_CONTACT_EMAIL
    const phone = import.meta.VITE_CONTACT_PHONE
    const address = import.meta.VITE_CONTACT_ADDRESS

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            
            <main className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {t('footer.termsOfUse')}
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Last updated: 15/08/2026
                    </p>
                </div>

                {/* Intro */}
                <div className="bg-white border border-gray-200 p-6 mb-6 text-sm text-gray-600 leading-relaxed">
                    By creating an account or placing an order on <strong className="text-gray-900">SKSuperStore</strong>, you agree to these Terms of Use. 
                    This is a <strong className="text-gray-900">business-to-business wholesale platform</strong> built for retail shop owners purchasing grocery and household products for resale.
                </div>

                {/* Sections */}
                <Section number="1" title="Acceptance of Terms">
                    <p>By accessing or using SKSuperStore, you agree to be bound by these terms. If you do not agree, please do not use the platform.</p>
                </Section>

                <Section number="2" title="Who This Platform Is For">
                    <p>SKSuperStore serves retail shop owners and businesses buying in bulk for resale. We reserve the right to verify accounts and decline orders that do not fit this wholesale purpose.</p>
                </Section>

                <Section number="3" title="Your Account">
                    <div className="space-y-2">
                        <Bullet>You must provide accurate shop, contact, and delivery details when registering.</Bullet>
                        <Bullet>You are responsible for keeping your login credentials confidential.</Bullet>
                        <Bullet>One account per business unless otherwise agreed.</Bullet>
                        <Bullet>Guest browsing is allowed, but registration is required to checkout.</Bullet>
                    </div>
                </Section>

                <Section number="4" title="Products & Pricing">
                    <div className="space-y-2">
                        <Bullet>Products are listed with tiered pricing — Single, Pack, and Carton — for bulk savings.</Bullet>
                        <Bullet>Prices, availability, and tiers may change without notice; the checkout price is final.</Bullet>
                        <Bullet>We strive for accuracy, but occasional errors happen. We will contact you if something affects your order.</Bullet>
                    </div>
                </Section>

                <Section number="5" title="Placing an Order">
                    <p>Placing an order is a request to purchase, not a guaranteed sale. We may decline or cancel orders due to stock unavailability, pricing errors, or account verification issues. You will be notified if this occurs.</p>
                </Section>

                <Section number="6" title="Payment">
                    <p>We accept <strong className="text-gray-900">UPI, Cash on Delivery, and Bank Transfer</strong>. Payment terms are shown at checkout. For order-specific payment issues, contact us using the details below.</p>
                </Section>

                <Section number="7" title="Delivery">
                    <div className="space-y-2">
                        <Bullet>We deliver to registered shop addresses within our serviceable area.</Bullet>
                        <Bullet>Delivery timelines shown at checkout are estimates, not guarantees.</Bullet>
                        <Bullet>Ensure someone is available at your registered address to receive the order.</Bullet>
                    </div>
                </Section>

                <Section number="8" title="Cancellations, Returns & Refunds">
                    <div className="space-y-2">
                        <Bullet>Orders can be cancelled <strong>before dispatch</strong>. Once shipped, cancellation is not possible.</Bullet>
                        <Bullet>For damaged, incorrect, or missing items, contact us within <strong>2 days</strong> of delivery with a photo.</Bullet>
                        <Bullet>Opened, used, or perishable items cannot be returned unless they arrived damaged.</Bullet>
                        <Bullet>Approved refunds are processed within <strong>5–7 business days</strong> to the original payment method.</Bullet>
                    </div>
                </Section>

                <Section number="9" title="Acceptable Use">
                    <p className="mb-2">Please do not:</p>
                    <div className="space-y-2">
                        <Bullet>Create fake or duplicate accounts.</Bullet>
                        <Bullet>Place fraudulent orders or misuse the guest cart / wishlist.</Bullet>
                        <Bullet>Scrape, copy, or resell our catalogue data.</Bullet>
                        <Bullet>Interfere with the platform's normal operation.</Bullet>
                    </div>
                    <p className="mt-3 text-gray-500 italic">We can suspend or close accounts that misuse the platform.</p>
                </Section>

                <Section number="10" title="Intellectual Property">
                    <p>The SKSuperStore name, logo, and site content belong to us or our licensors. Product images and brand names belong to their respective owners and are used solely for accurate product identification.</p>
                </Section>

                <Section number="11" title="Limitation of Liability">
                    <p>SKSuperStore is not liable for indirect losses (such as lost business or profit) arising from delays, stock issues, or platform downtime, beyond the value of the affected order.</p>
                </Section>

                <Section number="12" title="Governing Law">
                    <p>These terms are governed by the laws of <strong className="text-gray-900">India</strong>. Any disputes will be subject to the jurisdiction of the courts at <strong className="text-gray-900">Madhubani, Bihar</strong>.</p>
                </Section>

                <Section number="13" title="Changes to These Terms">
                    <p>We may update these terms as the platform evolves. Continuing to use SKSuperStore after an update means you accept the revised terms.</p>
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