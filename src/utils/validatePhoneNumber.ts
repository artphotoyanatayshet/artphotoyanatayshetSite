const phoneRegex = /^(?:\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;

export const validatePhoneNumber = (phone: string): boolean => {
  return phoneRegex.test(phone);
};

export const validateAndFormatPhoneNumber = (phone: string): { isValid: boolean; formattedPhone: string } => {
  if (phoneRegex.test(phone)) {
    // Форматируем номер телефона, чтобы он всегда начинался с +7
    let formattedPhone = phone;
    
    // Убираем лишние символы и пробелы для обработки
    formattedPhone = formattedPhone.replace(/[\s\-()]/g, ''); // Убираем пробелы и символы
    if (formattedPhone.startsWith('7') || formattedPhone.startsWith('8')) {
      formattedPhone = `+7${formattedPhone.slice(1)}`; // Заменяем 7 или 8 на +7
    } else if (!formattedPhone.startsWith('+7')) {
      // Если номер не начинается с +7, оставляем его без изменений
      formattedPhone = `+7${formattedPhone}`;
    }

    return { isValid: true, formattedPhone };
  }
  
  return { isValid: false, formattedPhone: '' };
}
