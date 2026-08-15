import React, { useState } from 'react'
import { Navbar } from '../features/navigation/components/Navbar'
import { Footer } from '../features/footer/Footer'
import { useTranslation } from 'react-i18next'

const FaqItem = ({ question, answer, isOpen, onClick }) => (
    <div className="border border-gray-200 bg-white">
        <button
            onClick={onClick}
            className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        >
            <span className="font-semibold text-gray-900 text-sm md:text-base pr-4">
                {question}
            </span>
            <span className={`text-xl font-bold flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45 text-[#E31837]' : 'text-[#0055A4]'}`}>
                {isOpen ? '−' : '+'}
            </span>
        </button>
        <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
            }`}
        >
            <div className="px-6 pb-4 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-3">
                {answer}
            </div>
        </div>
    </div>
)

export const FaqPage = () => {
    const { t } = useTranslation()
    const [openIndex, setOpenIndex] = useState(null)

    const email = process.env.REACT_APP_CONTACT_EMAIL
    const phone = process.env.REACT_APP_CONTACT_PHONE
    const address = process.env.REACT_APP_CONTACT_ADDRESS
    const whatsappNum = phone ? phone.replace(/\D/g, '') : ''

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    const faqData = [
        {
            q: "Who can shop on SKSuperStore?",
            a: "SKSuperStore is built for retail shop owners and businesses buying grocery and household products in bulk for resale — not for individual, one-time personal shopping."
        },
        {
            q: "Do I need a registered business or GST number to order?",
            a: "No, but if you have a GST number, add it to your account so it appears on your invoices for input credit."
        },
        {
            q: "How do I create an account?",
            a: "Tap Login/Register and add your shop name, contact details, and delivery address. You can browse and build your cart or wishlist as a guest first, then register when you're ready to check out."
        },
        {
            q: "How does the pricing work?",
            a: "Most products are priced in three tiers — Single, Pack, and Carton — so the more you order, the better your per-unit rate. Tier prices are shown right on the product card."
        },
        {
            q: "What areas do you deliver to?",
            a: "We currently deliver to retailers within our serviceable area around Brahmapur, Bihar — 847239."
        },
        {
            q: "How long does delivery take?",
            a: "Delivery timelines are shown at checkout and vary by your location and order size. Usually within 1–2 days."
        },
        {
            q: "Is there a minimum order?",
            a: "No — order as much or as little as you need."
        },
        {
            q: "What payment methods do you accept?",
            a: "UPI, Cash on Delivery, and Bank Transfer."
        },
        {
            q: "Can I track my order?",
            a: "Yes — use the My Orders option to check your order status anytime."
        },
        {
            q: "What if an item arrives damaged, wrong, or missing?",
            a: "Contact us within 2 days with your order number and a photo of the item, and we'll arrange a replacement or refund."
        },
        {
            q: "Is the site available in Hindi?",
            a: "Yes — switch between English and Hindi anytime using the language toggle (EN / हि) in the header."
        },
        {
            q: "How do I contact support?",
            a: email && phone 
                ? `Email us at ${email} or call ${phone}.`
                : "Reach out via the contact details below."
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-1 max-w-3xl mx-auto px-4 py-12 w-full">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 text-center">
                    {t('footer.faq')}
                </h1>
                <p className="text-gray-500 text-center mb-10 text-sm">
                    Everything you need to know about ordering wholesale
                </p>

                <div className="flex flex-col gap-3">
                    {faqData.map((item, index) => (
                        <FaqItem
                            key={index}
                            question={item.q}
                            answer={item.a}
                            isOpen={openIndex === index}
                            onClick={() => toggle(index)}
                        />
                    ))}
                </div>

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

                {/* WhatsApp CTA */}
                <div className="mt-6 p-6 bg-white border border-gray-200 text-center">
                    <p className="text-gray-900 font-semibold mb-1">Still have questions?</p>
                    <p className="text-gray-500 text-sm mb-4">We're here to help retailers like you.</p>
                    <a
                        href={whatsappNum ? `https://wa.me/${whatsappNum}` : '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#E31837] text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                    >
                        <span>💬</span> Chat on WhatsApp
                    </a>
                </div>
            </main>
            <Footer />
        </div>
    )
}