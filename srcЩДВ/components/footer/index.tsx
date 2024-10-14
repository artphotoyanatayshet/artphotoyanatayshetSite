import { FiPhone } from 'react-icons/fi';
import textBurgerMenu from '../../app/burger-menu/burger-menu.json'
import { LiaTelegram } from 'react-icons/lia';
import { IoLogoWhatsapp } from 'react-icons/io';
import { TfiEmail } from 'react-icons/tfi';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (<footer className="py-8 px-12 bg-zinc-900">
    <div className="my-4 text-center">
      <h4 className="text-md font-syne font-bold text-primary">
      {textBurgerMenu.BurgerMenu.main_burger_subtitle.title}
      </h4>
      <h2
        className="text-3xl font-syne font-bold text-white lowercase underline mt-2"
      >
        {textBurgerMenu.BurgerMenu.email.title}
      </h2>
    </div>
    <div
      className="flex flex-col md:flex-row justify-between gap-10 mt-20 items-center"
    >
      <div className="my-auto">
        <Link to='/'>
          <img className="w-36 " src="/logo.svg" alt="" />
        </Link>
      </div>
      <div>
        <div className="flex flex-col items-center space-y-4 mt-4 w-full">
          <a
            href={`tel:${textBurgerMenu.BurgerMenu.phone.title}`}
            className="w-full text-center text-[#00FF00] transition-colors duration-300 hover:text-[#FF00FF] bg-gray-900 rounded-lg p-2 flex justify-center items-center space-x-2"
          >
            <FiPhone size={24} />
            <span>{textBurgerMenu.BurgerMenu.phone.title}</span>
          </a>
          <a
            href={`https://t.me/${textBurgerMenu.BurgerMenu.telegram_number.title}`}
            className="w-full text-center text-[#00FF00] transition-colors duration-300 hover:text-[#FF00FF] bg-gray-900 rounded-lg p-2 flex justify-center items-center space-x-2"
          >
            <LiaTelegram size={24} />
            <span>Telegram</span>
          </a>
          <a
            href={`https://wa.me/${textBurgerMenu.BurgerMenu.whatsapp_number.title}`}
            className="w-full text-center text-[#00FF00] transition-colors duration-300 hover:text-[#FF00FF] bg-gray-900 rounded-lg p-2 flex justify-center items-center space-x-2"
          >
            <IoLogoWhatsapp size={24} />
            <span>WhatsApp</span>
          </a>
          {textBurgerMenu.BurgerMenu.email.title && (
            <a
              href={`mailto:${textBurgerMenu.BurgerMenu.email.title}`}
              className="w-full text-center text-[#00FF00] transition-colors duration-300 hover:text-[#FF00FF] bg-gray-900 rounded-lg p-2 flex justify-center items-center space-x-2"
            >
              <TfiEmail size={24} />
              <span>Email</span>
            </a>
          )}

        </div>
      </div>
      <div>
        <h4 className="text-md font-syne font-bold text-white">
          <Link to='/'>
            {textBurgerMenu.BurgerMenu.main_burger.title}
          </Link>
        </h4>
      </div>
    </div>
    <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
    <h4 className="text-md font-syne font-bold text-white text-center">
      &copy; {new Date().getFullYear()} Все права защищены.
    </h4>


  </footer>)
}

export default Footer;