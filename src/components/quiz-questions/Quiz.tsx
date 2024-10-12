import React, { useState } from 'react';
import quizData from './quizQuestions.json';
import { TbPlayerTrackNextFilled } from 'react-icons/tb';
import { FaWindowClose } from 'react-icons/fa';
import { sendToTelegram } from './utils/sendToTelegram';
import appConfig from '../../app/app-config.json';
import ModalQuiz from './modal-quiz';
import { FaPhone, FaTelegramPlane, FaEnvelope } from 'react-icons/fa';
import CallToActionIcon from '../call-to-action';


interface QuizProps {
  setShowModalQuiz: (show: boolean) => void;
  onQuizComplete: () => void;
}

const Quiz: React.FC<QuizProps> = ({ setShowModalQuiz, onQuizComplete }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    phone: '',
    email: '',
    contactMethod: 'phone',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAnswerSelection = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      setUserAnswers([
        ...userAnswers,
        { question: quizData.questions[currentQuestionIndex].question, answer: selectedAnswer },
      ]);
      setSelectedAnswer(null);

      if (currentQuestionIndex + 1 < quizData.questions.length) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        setIsFinished(true);
      }
    }
  };

  const handleCloseQuiz = () => {
    setShowModalQuiz(false);
    onQuizComplete();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleContactMethodChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData((prevData) => ({ ...prevData, contactMethod: e.target.value }));
  };

  const handleSubmit = async () => {
    // Call sendToTelegram with userData and userAnswers
    await sendToTelegram({
      api_token: appConfig.TOKEN_TELEGRAM,
      my_channel_name: appConfig.CHAT_ID_TELEGRAM,
      userData: userData,
      userAnswers: userAnswers,
      setOpenModalInit: () => {},
      setPhone: () => {},
      setName: () => {},
      setEmail: () => {},
      onClose: () => {},
    });

    // Set success message and open modal
    setSuccessMessage('Ваши ответы успешно отправлены!');
    setIsModalOpen(true);
  };

  return (
    <div className="fixed m-4 inset-0 flex items-center justify-center bg-black bg-opacity-80 transition-opacity duration-300">
      <ModalQuiz open={isModalOpen} onClose={() => [setIsModalOpen(false), handleCloseQuiz()]} message={successMessage} />
      <div className="relative w-full max-w-md p-6 bg-gray-300 rounded-lg shadow-md opacity-100 transition-transform duration-300 transform">
        <button
          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
          onClick={handleCloseQuiz}
        >
          <FaWindowClose />
        </button>
<CallToActionIcon />
        {isFinished ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Спасибо за участие!</h2>
            <p className="text-lg">Ваши ответы были успешно сохранены.</p>
            <div className="mt-4">
              <input
                type="text"
                name="name"
                value={userData.name}
                placeholder="Ваше имя"
                onChange={handleInputChange}
                className="block w-full p-2 mb-2 border rounded"
                required
              />
              <input
                type="text"
                name="phone"
                value={userData.phone}
                placeholder="Ваш телефон"
                onChange={handleInputChange}
                className="block w-full p-2 mb-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={userData.email}
                placeholder="Ваш email"
                onChange={handleInputChange}
                className="block w-full p-2 mb-2 border rounded"
                required
              />


<div className="flex flex-col mb-2">
  <label className="font-semibold">Предпочтительный способ связи:</label>
  <div className="flex flex-row items-center space-x-4">
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        value="phone"
        checked={userData.contactMethod === 'phone'}
        onChange={handleContactMethodChange}
        className="mr-2" // Отступ между радиокнопкой и иконкой
      />
      <FaPhone className="text-xl mr-1" /> {/* Иконка телефона */}
      <span>Телефон</span>
    </label>
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        value="telegram"
        checked={userData.contactMethod === 'telegram'}
        onChange={handleContactMethodChange}
        className="mr-2" // Отступ между радиокнопкой и иконкой
      />
      <FaTelegramPlane className="text-xl mr-1" /> {/* Иконка Telegram */}
      <span>Telegram</span>
    </label>
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        value="email"
        checked={userData.contactMethod === 'email'}
        onChange={handleContactMethodChange}
        className="mr-2" // Отступ между радиокнопкой и иконкой
      />
      <FaEnvelope className="text-xl mr-1" /> {/* Иконка Email */}
      <span>Email</span>
    </label>
  </div>
</div>



            </div>
            <button
              onClick={handleSubmit}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Отправить ответы
            </button>
          </div>
        ) : (
          <div>
            <h2 className="text-2xl font-bold mb-4">{quizData.title}</h2>
            <p>{quizData.subtitle}</p>
            <hr />
            <h3 className="text-xl font-semibold mb-4">
              {quizData.questions[currentQuestionIndex].question}
            </h3>
            <ul>
              {quizData.questions[currentQuestionIndex].options.map((option) => (
                <li
                  key={option}
                  className={`cursor-pointer p-2 border rounded-md mb-2 transition-colors 
                  ${selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                  onClick={() => handleAnswerSelection(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
            <button
              onClick={handleNextQuestion}
              className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              disabled={!selectedAnswer}
            >
              <TbPlayerTrackNextFilled />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
