import React from 'react';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';


import About from '../pages/about';
import Home from '../pages/home';
import ContactUs from '../pages/contact-us';
import OfferAgreement from '../pages/offer-agreement';
import UserAgreement from '../pages/user-agreement';
import PrivacyPolicy from '../pages/privacy-policy';
import ErrorPage404 from '../pages/error-page-404';
import MainLayout from './main-layout';
// import Admin from '../pages/admin';
import LoginPage from './auth/LoginPage';
import PrivateRoute from './auth/PrivateRoute';
import { AuthProvider } from './auth/AuthContext';
import EditBurgerMenu from '../pages/admin/edit-burger-menu';
import EditAppConfigPage from '../pages/admin/edit-app-config';
import AddYandexMetrica from '../pages/admin/add-yandex-metrica';
import EditRobotsTxt from '../pages/admin/edit-robots-txt';
import EditQuiz from '../pages/admin/edit-quiz';
import EditFaq from '../pages/admin/edit-faq';
import FileUploadMainImage from '../pages/admin/edit-main-image';
import CallToActionPage from '../pages/call-to-action-page';
import AboutEditor from '../pages/about-editor';
import OfferAgreementEditor from '../pages/offer-agreement-editor';
import PrivacyPolicyEditor from '../pages/privacy-policy-editor';
import UserAgreementEditor from '../pages/user-agreement-editor';
import DeliveryRulesEditor from '../pages/delivery-rules-editor';
import DeliveryRules from '../pages/delivery-rules';
import ContactUsEditor from '../pages/contact-us-editor';
import EditMainLogo from '../pages/admin/edit-main-logo';
import IninPaymentPage from '../pages/init-payment';
import PaymentProcess from '../pages/init-payment/payment-process';

const App: React.FC = () => {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout />} errorElement={<ErrorPage404 />}>
       
        <Route index element={<Home />} />
        
        <Route path="/login" element={<LoginPage />} />

        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/offer-agreement" element={<OfferAgreement />} />
        <Route path="/user-agreement" element={<UserAgreement />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/delivery-rules" element={<DeliveryRules />} />
        <Route path="/call-to-action" element={<CallToActionPage />} />
        <Route path="/init-payment" element={<IninPaymentPage />} />
        <Route path="/payment-process" element={<PaymentProcess />} />
         {/* Защищённые маршруты через PrivateRoute */}
         <Route element={<PrivateRoute />}>        
                <Route path="/admin/edit-burger-menu" element={<EditBurgerMenu />} />
                <Route path="/admin/site-settings" element={<EditAppConfigPage />} />
                <Route path="/admin/add-yandex-metrica" element={<AddYandexMetrica />} />
                <Route path="/admin/edit-robots-txt" element={<EditRobotsTxt />} />
                <Route path="/admin/edit-quiz" element={<EditQuiz />} />
                <Route path="/admin/edit-faq" element={<EditFaq />} />
                <Route path="/admin/edit-main-image" element={<FileUploadMainImage />} />
                <Route path="/admin/edit-main-logo" element={<EditMainLogo />} /> 
                <Route path="/admin/edit-about" element={<AboutEditor />} />
                <Route path="/admin/edit/contact-us" element={<ContactUsEditor />} />
                <Route path="/admin/edit-offer-agreement" element={<OfferAgreementEditor />} />
                <Route path="/admin/edit-privacy-policy" element={<PrivacyPolicyEditor />} />
                <Route path="/admin/edit-user-agreement" element={<UserAgreementEditor />} />
                <Route path="/admin/edit-delivery-rules" element={<DeliveryRulesEditor />} />
        </Route>
        <Route path="*" element={<ErrorPage404 />} />
      </Route>
    )
  );

  return <AuthProvider>
    <RouterProvider router={router} />
    </AuthProvider>;
};

export default App;
