import React from 'react'
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const Footer = () => {
    const { t } = useTranslation();

    const linkClass = "font-light cursor-pointer no-underline text-inherit hover:underline block text-xs sm:text-sm";

    return (
        <div className="bg-black pt-6 sm:pt-12 pb-4 sm:pb-6 px-3 sm:px-4 md:px-12 text-gray-200 flex flex-col justify-around gap-8 sm:gap-20">
            {/* upper */}
            <div className="flex flex-row flex-wrap gap-y-3 sm:gap-y-4 justify-start md:justify-around">

                {/* Contact */}
                <div className="flex flex-col gap-y-2 sm:gap-y-4 p-2 sm:p-4">
                    <h6 className="text-sm sm:text-xl font-medium">{t('footer.contact')}</h6>
                    <a 
                        href="https://www.google.com/maps/place/SK+General+Stores+Station+Road+Sakri/@26.2097846,86.079415,17z/data=!4m6!3m5!1s0x39edcf8ac7311eb7:0x6a769e37c40868b1!8m2!3d26.2096491!4d86.0784015!16s%2Fg%2F11h04fglsj?entry=ttu&g_ep=EgoyMDI2MDcxNS4wIKXMDSoASAFQAw%3D%3D" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={linkClass}
                    >
                        {t('footer.address')}
                    </a>
                    <a href="mailto:skgeneralstores2016@gmail.com" className={linkClass}>
                        skgeneralstores2016@gmail.com
                    </a>
                    <a href="tel:9386042504" className={linkClass}>
                        +91 9386042504
                    </a>
                </div>

                {/* Account */}
                <div className="flex flex-col gap-y-2 sm:gap-y-4 p-2 sm:p-4">
                    <h6 className="text-sm sm:text-xl font-medium">{t('footer.account')}</h6>
                    <Link to="/profile" className={linkClass}>{t('footer.myAccount')}</Link>
                    <Link to="/login" className={linkClass}>{t('footer.loginRegister')}</Link>
                    <Link to="/cart" className={linkClass}>{t('footer.cart')}</Link>
                    <Link to="/wishlist" className={linkClass}>{t('footer.wishlist')}</Link>
                    <Link to="/" className={linkClass}>{t('footer.shop')}</Link>
                </div> 

                {/* Quick Links */}
                <div className="flex flex-col gap-y-2 sm:gap-y-4 p-2 sm:p-4">
                    <h6 className="text-sm sm:text-xl font-medium">{t('footer.quickLinks')}</h6>
                    <Link to="/privacy-policy" className={linkClass}>{t('footer.privacyPolicy')}</Link>
                    <Link to="/terms-of-use" className={linkClass}>{t('footer.termsOfUse')}</Link>
                    <Link to="/faq" className={linkClass}>{t('footer.faq')}</Link>
                </div>

            </div>

            {/* lower */}
            <div className="self-center">
                <p className="text-gray-500 text-xs sm:text-sm">
                    &copy; SKSuperStore {new Date().getFullYear()}. {t('footer.allRightsReserved')}
                </p>
            </div>
        </div>
    )
}