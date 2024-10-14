import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const TinkoffPageSuccess = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  useEffect(() => {
    const addTailwindStyles = () => {
      const link = document.createElement('link');
      link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    };
    addTailwindStyles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Успешный платеж</h2>
        </div>
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600">
                Ваш платеж прошел успешно.
              </p>
            </div>
            <div className="border-t border-gray-200">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Магазин</dt>
                  <dd className="mt-1 text-sm text-gray-900">{searchParams.get('MerchantName')}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Order ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{searchParams.get('OrderId')}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Payment ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{searchParams.get('PaymentId')}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Стоимость</dt>
                  <dd className="mt-1 text-sm text-gray-900">{parseFloat(searchParams.get('Amount')!) / 100} ₽</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Email Магазина:</dt>
                  <dd className="mt-1 text-sm text-gray-900">{searchParams.get('MerchantEmail')}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Сайт:</dt>
                  <dd className="mt-1 text-sm text-gray-900">{searchParams.get('BackUrl')}</dd>
                </div>

                {/* Другие данные, которые вы хотите отобразить */}
              </dl>
              <div className="text-center">
              <a href="/" style={{ backgroundColor: '#3B82F6', borderRadius: '0.5rem', padding:"10px" }} className="">
    На главную
</a>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      );
};

      export default TinkoffPageSuccess;
