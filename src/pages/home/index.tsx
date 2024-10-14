import React, { useState, useEffect } from 'react';
import textJsonRu from '../../locale/texts-site-ru.json';
import { FaEdit } from 'react-icons/fa';
import Modal from 'react-modal';
import { getFileContent } from '../../components/api-github/utils/useGetFileContent';
import { GITREPO, GITREPOSITORY_OWNER } from '../../constants/globalVar';
import { editJsonFileOneKey } from '../../components/api-github/json-editor/git-file-json-editor-one-key';
import MainQuiz from '../../components/quiz-questions/main-quiz';
import Faq from '../../components/faq';
import { useAuth } from '../../app/auth/AuthContext';
import AdminMenu from '../../app/menu-admin';
import { Link, useLocation } from 'react-router-dom';
import ProductList from '../../components/products/product-list';
import AddProductToJson from '../../components/products/add-product-to-json';
import ThemeSwitcher from '../../components/theme-switcher';
import { getThemeClasses } from '../../components/theme-switcher/themeUtils';
import appConfig from '../../app/app-config.json';


const owner = GITREPOSITORY_OWNER;
const repo = GITREPO;
const path = 'src/locale/texts-site-ru.json';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth(); // Деструктурируем isAuthenticated из useAuth

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentText, setCurrentText] = useState('');
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileContent, setFileContent] = useState<any>({});
  const [changes, setChanges] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);

  const theme = appConfig.defaultTheme;

  if (!theme) return null;
  const {  textColor, anyTextColor } = getThemeClasses(theme);

  if (error) { console.log("Error HomePage", error); }

  const fetchFile = async () => {
    try {
      const data = await getFileContent(owner, repo, path);
      const jsonContent = JSON.parse(decodeURIComponent(escape(atob(data.content))));
      setFileContent(jsonContent);
    } catch (err) {
      setError('Ошибка при загрузке файла');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFile();
  }, []);

  const location = useLocation();

  // Функция для скроллинга к секции по id
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Прокрутка при загрузке страницы, если есть параметр scrollTo
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const scrollTo = searchParams.get('scrollTo');
    if (scrollTo) {
      scrollToSection(scrollTo);
    }
  }, [location]);

  const openModal = (key: string, text: string) => {
    setCurrentText(text);
    setCurrentKey(key);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentKey(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentText(e.target.value);
  };

  const saveChanges = () => {
    if (!currentKey) return;

    setChanges((prevChanges) => ({
      ...prevChanges,
      [currentKey]: currentText,
    }));

    closeModal();
  };

  const publishChanges = async () => {
    setIsLoading(true);
    try {
      for (const [key, text] of Object.entries(changes)) {
        await editJsonFileOneKey(key, text);
      }
      setFileContent((prevContent: any) => ({
        ...prevContent,
        ...changes,
      }));
      setChanges({}); // Сбрасываем изменения после публикации
    } catch (error) {
      console.error('Ошибка при публикации изменений:', error);
      setError('Ошибка при публикации изменений');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isAuthenticated && <AdminMenu />}
      <ThemeSwitcher />
      <div className="z-10 container mx-auto px-4 sm:px-6 lg:px-8 relative"> {/* relative для родительского элемента */}
  
      <MainQuiz  />
  <section id="home" className="my-2 mt-10" data-aos="fade-right" data-aos-duration="1000" >
    <div className="flex flex-col items-center justify-center px-4">
      <section className="imgBg md:right-1/4 md:top-[10%]"></section> {/* Убедитесь, что z-index правильно настроен */}
      <div className="flex items-center"> {/* Убедитесь, что z-index выше у других элементов */}
        <h1 className={`font-syne font-bold text-2xl sm:text-4xl ${textColor} text-center`}>
          {changes['home.title'] || textJsonRu.home.title}
        </h1>
        {isAuthenticated && (
          <FaEdit color={`green`} onClick={() => openModal('home.title', changes['home.title'] || fileContent.home?.title || textJsonRu.home.title)} className="ml-2 text-white cursor-pointer" />
        )}
      </div>
          <Link to='/call-to-action'>
            <button className="bg-primary w-48 h-10 p-2  rounded-full flex flex-row items-center justify-center mt-12">
              <span className="font-bold font-rubik text-xs text-gray-100">
                {changes['home.button_title_home'] || textJsonRu.home.button_title_home}
              </span>
            </button>
          </Link>
            {isAuthenticated && (
              <FaEdit color={`green`} onClick={() => openModal('home.button_title_home', changes['home.button_title_home'] || fileContent.home?.button_title_home || textJsonRu.home.button_title_home)} className="ml-2 text-white cursor-pointer" />
            )}
          </div>
        </section>

        <section id="about" className="flex md:flex-row flex-col-reverse justify-between gap-10">
          <section className="hidden md:block imgBg left-4 mt-14"></section>
          <div className="md:w-2/3 m-auto" data-aos="fade-left" data-aos-duration="1000">
            <div className="flex items-center">
              <h2 className={`text-3xl font-syne font-bold ${textColor}`}>
                {changes['about.title'] || textJsonRu.about.title}
              </h2>
              {isAuthenticated && (
                <FaEdit color={`green`} onClick={() => openModal('about.title', changes['about.title'] || fileContent.about?.title || textJsonRu.about.title)} className="ml-2 text-white cursor-pointer" />
              )}
            </div>
            <p className={`${anyTextColor} font-rubik font-thin text-sm w-full mt-6`}>
              {changes['about.description'] || textJsonRu.about.description_home_section}
            </p>
            {isAuthenticated && (
              <FaEdit color={`green`} onClick={() => openModal('about.description', changes['about.description'] || fileContent.about?.description || textJsonRu.about.description_home_section)} className="ml-2 text-white cursor-pointer" />
            )}
            <Link to='/call-to-action'>
              <button className="bg-primary w-48 h-10 rounded-full flex flex-row items-center justify-center mt-12">
                <span className="font-bold font-rubik text-xs text-gray-100">
                  {changes['about.button_title_about'] || textJsonRu.about.button_title_about_home_section}
                </span>
              </button>
            </Link>
            {isAuthenticated && (
              <FaEdit color={`green`} onClick={() => openModal('about.button_title_about', changes['about.button_title_about'] || fileContent.about?.button_title_about || textJsonRu.about.button_title_about_home_section)} className="ml-2 text-white cursor-pointer" />
            )}
          </div>
          <div data-aos="fade-left" data-aos-duration="1000" className="relative z-0">
  <img
    className="w-full h-full object-contain rounded-lg"
    src="/profile.png"
    alt="profile"
    style={{ zIndex: -1 }} // Устанавливаем z-index для изображения
  />
</div>



        </section>

        <section id="testimonials" className="flex flex-row flex-col-reverse gap-10 mb-16" data-aos="zoom-in">
          <section className="hidden md:block imgBg left-4 mt-4"></section>
          <div className="">
            <div className="flex justify-between">
              <h3 className={`font-syne text-4xl ${textColor}  font-bold`}>
                {changes['testimonial.title'] || textJsonRu.testimonial.title}
              </h3>
              <img className="md:h-20 h-[28px] w-20 object-contain" src="/quote.svg" alt="" />
            </div>
            {isAuthenticated && (
              <FaEdit color={`green`} onClick={() => openModal('testimonial.title', changes['testimonial.title'] || fileContent.testimonial?.title || textJsonRu.testimonial.title)} className="ml-2 text-white cursor-pointer" />
            )}

            <div className="mt-2 pr-20">
              <p className={` ${anyTextColor} text-xs font-rubik font-thin text-left text-slate-500`}>
                {changes['testimonial.description'] || textJsonRu.testimonial.description}
              </p>
              {isAuthenticated && (
                <FaEdit color={`green`} onClick={() => openModal('testimonial.description', changes['testimonial.description'] || fileContent.testimonial?.description || textJsonRu.testimonial.description)} className="ml-2 text-white cursor-pointer" />
              )}

              <p className={`font-syne text-md ${textColor}  font-bold mt-6`}>
                {changes['testimonial.subtitle_testimonial'] || textJsonRu.testimonial.subtitle_testimonial}
                {isAuthenticated && (
                  <FaEdit color={`green`} onClick={() => openModal('testimonial.subtitle_testimonial', changes['testimonial.subtitle_testimonial'] || fileContent.testimonial?.subtitle_testimonial || textJsonRu.testimonial.subtitle_testimonial)} className="ml-2 text-white cursor-pointer" />
                )}
              </p>
            </div>
          </div>
        </section>

<section id="servises_id">
  {isAuthenticated && <AddProductToJson /> }
  <ProductList />
</section>


        {/* {error && <p className="text-red-500 mt-4">{error}</p>} */}
        <Faq />

        {/* Кнопка для публикации изменений */}
        {isAuthenticated && (
          <button onClick={publishChanges} className="z-30 fixed top-16 right-20 p-3 rounded-lg bg-green-500 text-white mt-4">
            {isLoading ? "Обновление" : "Опубликовать изменения"}
          </button>
        )}

<Modal
  isOpen={isModalOpen}
  onRequestClose={closeModal}
  style={{
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)', // затемнение фона
      zIndex: 9999, // высокий z-index
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.3)', // тень для окна
      zIndex: 10000, // высокий z-index для контента
      width: '400px', // ширина модального окна
    },
  }}
>
  <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
    Edit Text
  </h2>
  <textarea
    value={currentText}
    onChange={handleTextChange}
    style={{
      width: '100%',
      height: '100px',
      border: '1px solid #ccc',
      padding: '10px',
      borderRadius: '4px',
    }}
  />
  <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
    <button
      onClick={closeModal}
      style={{
        backgroundColor: '#aaa',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      Cancel
    </button>
    <button
      onClick={saveChanges}
      style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      Save
    </button>
  </div>
</Modal>


      </div>
    </>
  );
};

export default Home;