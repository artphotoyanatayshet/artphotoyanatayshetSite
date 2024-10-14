// themeUtils.ts

export const getThemeClasses = (theme: string) => {
    const navBgColor = theme === 'theme1' ? 'bg-theme1-bgNav' :
                       theme === 'theme2' ? 'bg-gradient-to-r from-theme2-gradientNavFrom to-theme2-gradientNavTo' :
                       theme === 'theme3' ? 'bg-theme3-bgNav' :
                       theme === 'theme4' ? 'bg-theme4-bgNav' :
                       'bg-theme5-bgNav';
  
    const textColor = theme === 'theme1' ? 'text-theme1-text' :
                      theme === 'theme2' ? 'text-theme2-text' :
                      theme === 'theme3' ? 'text-theme3-text' :
                      theme === 'theme4' ? 'text-theme4-text' :
                      'text-theme5-text';
    
    const bgCard = theme === 'theme1' ? 'bg-theme1-bgCard' :
                      theme === 'theme2' ? 'bg-theme2-bgCard' :
                      theme === 'theme3' ? 'bg-theme3-bgCard' :
                      theme === 'theme4' ? 'bg-theme4-bgCard' :
                      'bg-theme5-bgCard';
    
    const anyTextColor = theme === 'theme1' ? 'text-theme1-anyTextColor' :
                      theme === 'theme2' ? 'text-theme2-anyTextColor' :
                      theme === 'theme3' ? 'text-theme3-anyTextColor' :
                      theme === 'theme4' ? 'text-theme4-anyTextColor' :
                      'text-theme5-anyTextColor';
  
    return { navBgColor, textColor, bgCard,  anyTextColor };
  };
  