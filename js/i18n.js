/*
   Internationalization (i18n) - Auto Language Detection
    Automatically detects browser language and applies translations
*/

(function($) {
    'use strict';

    // Translations
  const translations = {
        zh: {
            'page.title': '好奇猫 | 个人主页',
            'meta.description': '好奇猫的个人主页',
            'meta.keywords': '好奇猫的个人主页',
            'og.description': '好奇猫的个人主页',
            'header.title': '好奇猫',
            'header.subtitle': '好奇心会害死猫。<br/>— 好奇猫',
            'nav.email': '电子邮箱',
            'nav.github': 'Github'
        },
      en: {
            'page.title': 'Curious Cat | Personal Homepage',
            'meta.description': 'Curious Cat\'s personal homepage',
            'meta.keywords': 'Curious Cat\'s personal homepage',
            'og.description': 'Curious Cat\'s personal homepage',
            'header.title': 'Curious Cat',
            'header.subtitle': 'Curiosity killed the cat.<br/>— Curious Cat',
            'nav.email': 'Email',
            'nav.github': 'Github'
        }
    };

    // Detect system language
  function detectLanguage() {
      const userLang = navigator.language || navigator.userLanguage;
      const langCode = userLang.split('-')[0].toLowerCase();
        
        // Support both Chinese and English
        if (langCode === 'zh' || langCode === 'cn') {
            return 'zh';
        } else if (langCode === 'en') {
            return 'en';
        }
        // Default to English for other languages
        return 'en';
    }

    // Apply translations
   function applyTranslations(lang) {
       const trans = translations[lang];
        
        // Update all elements with data-i18n attribute
        $('[data-i18n]').each(function() {
           const key = $(this).data('i18n');
            if (trans[key]) {
                if ($(this).is('input, textarea')) {
                    $(this).val(trans[key]);
                } else {
                    $(this).html(trans[key]);
                }
            }
        });

        // Update meta tags
        $('meta[name="description"]').attr('content', trans['meta.description']);
        $('meta[name="keywords"]').attr('content', trans['meta.keywords']);
        $('meta[property="og:title"]').attr('content', trans['page.title']);
        $('meta[property="og:description"]').attr('content', trans['og.description']);

        // Update HTML lang attribute
        $('html').attr('lang', lang === 'zh' ? 'zh-CN' : 'en');
    }

    // Initialize on page load
    $(document).ready(function() {
        // Auto-detect from system/browser language
       const currentLang = detectLanguage();
        
        // Apply translations
        applyTranslations(currentLang);
    });

})(jQuery);