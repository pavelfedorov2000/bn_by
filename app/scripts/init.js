$(document).ready(function () {

  // Отменяем отправку формы по клику на enter
  $('form').on('keydown', function (e) {
    if (e.keyCode == 13) {
      e.preventDefault();
      return false;
    }
  });
  app.validation.init();

  // Custom jquery select
  $('.select__title').on('click', function () {
    $(this).parents('.form__field').siblings().find('.select__title').removeClass('active');
    $(this).parents('.form__field').siblings().find('.select__title').removeClass('focus');
    $(this).parents('.form__field').siblings().find('.select__content').slideUp('300');
    $(this).addClass('active');
    $(this).toggleClass('focus');
    $(this).next().slideToggle('300');
    $(this).next().find('input.select__search').focus();
  });

  $('.select__label').on('click', function () {
    $(this).parents('.select__content').find('.select__search').val('');
    $(this).parent().parent().prev().removeClass('focus');
    $(this).parent().parent().prev().text($(this).attr('data-value'));
    $(this).parent().parent().slideUp('300');
  });

  // Селект тариф
  $('.select--price .select__label').on('click', function () {
    $(this).parent().parent().prev().find('span.tariff-name').text($(this).find('span').first().text());
    $(this).parent().parent().prev().find('span.tariff-price').text($(this).find('span').last().text());
  });

  // поиск по населенному пункту и улице
  function filterFunction(input) {
    let filter = input.value.toUpperCase();
    let a = input.nextElementSibling.querySelectorAll('label');
    //console.log(a);
    for (let i = 0; i < a.length; i++) {
      let txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "block";
      } else {
        a[i].style.display = "none";
      }
    }
  }

  const selectSearchInputs = document.querySelectorAll('.select__search');
  selectSearchInputs.forEach(input => {
    input.addEventListener('keyup', () => {
      filterFunction(input);
    });
  });

  // Закрытие селекта по клику вне него
  $(document).mouseup(function (e) {
    var div = $(".select");
    if (!div.is(e.target) // если клик был не по нашему блоку
      && div.has(e.target).length === 0) { // и не по его дочерним элементам
      div.find('.select__content').slideUp(); // скрываем его
      $('.select__title').removeClass('focus');
      $('.select__search').val('');
      $('.select__label').show();
    }
  });

  // Поле совпадает с адресом
  $('.matches-address').on('change', function () {
    if ($(this).is(':checked')) {
      $(this).parent().next().slideUp();
    } else {
      $(this).parent().next().slideDown();
    }
  });

  // случай, когда заполняем на вкладке личные данные физ формы сначала все поля а телефон последним, чтобы кнопка загоралась зеленым
  $('.input').on('keyup input', function () {
    disabled.call(this);
    if (currentStep == 0) {
      disabled.call(this);
      if ($('#physical_form').length && $('#physical_form').valid()) {
        localStorage.setItem('personal-data', 'valid');
      }
    } else if (currentStep == navItems.length - 1) {
      if (!$('input[name=agree]').is(':checked') || !$(this).parents('form').valid()) {
        $('.next-btn').prop('disabled', true);
      } else {
        $('.next-btn').prop('disabled', false);
      }
    } else {
      if ($('.input').hasClass('error')) {
        $('.next-btn').prop('disabled', true);
      } else {
        $('.next-btn').prop('disabled', false);
      }
    }
  });
  function disabled() {
    $('.next-btn').prop('disabled', !$(this).parents('form').valid());
  }

  // Поле почтовый адрес совпадает с
  $('input[name=mailing_address_matches]').on('change', function () {
    if ($('input[name=mailing_address_matches]:checked').next().find('span').text() === 'Выберите') {
      $('input[name=mailing_address_matches]:checked').parents('.form__field').next().slideDown();
    } else {
      $('input[name=mailing_address_matches]:checked').parents('.form__field').next().slideUp();
    }
  });

  // Радиобаттон резидент
  $('.radio-box[name=resident]').on('click', function () {
    if ($(this).next().text() === 'Нет') {
      $(this).parent().parent().parent().next().slideDown();
    } else {
      $(this).parent().parent().parent().next().slideUp();
    }
  });

  // Радиобаттон временная регистрация
  $('.radio-box[name=temporary_registration]').on('click', function () {
    if ($(this).next().text() === 'Нет') {
      $(this).parents('fieldset').next().slideUp();
    } else {
      $(this).parents('fieldset').next().slideDown();
    }
  });

  // Выпадающий fieldset
  $('.form__legend--drop').on('click', function () {
    $(this).toggleClass('active');
    $(this).next().slideToggle('300');
  });

  function getStep() {
    if ($('#juridical_form').length) {
      currentStep = localStorage.getItem('jf-step') || 0;
    }
    if ($('#physical_form').length) {
      currentStep = localStorage.getItem('ff-step') || 0;
    }
    stepItems[currentStep].style.display = "none";
    stepText.forEach(text => {
      text.querySelectorAll('div')[currentStep].style.display = "none";
    });
  }
  function setStep() {
    if ($('#juridical_form').length) {
      localStorage.setItem('jf-step', currentStep);
    }
    if ($('#physical_form').length) {
      localStorage.setItem('ff-step', currentStep);
    }
  }
  let currentStep;
  if ($('#juridical_form').length) {
    currentStep = localStorage.getItem('jf-step') || 0;
  }
  if ($('#physical_form').length) {
    currentStep = localStorage.getItem('ff-step') || 0;
  }
  setStep();
  const navItems = document.querySelectorAll('.form__nav-btn');
  const stepItems = document.querySelectorAll('.form__step');
  const stepText = document.querySelectorAll('.form-page__aside-text');
  // Buttons
  let backBtn = document.querySelector('.back-btn');
  let nextBtn = document.querySelector('.next-btn');

  // Логика шагов
  backBtn.onclick = () => {
    backBtn.blur();
    prevStep(1);
  };
  nextBtn.onclick = () => {
    nextBtn.blur();
    if ($('.input').hasClass('error')) {
      $('.next-btn').prop('disabled', true);
    } else {
      $('.next-btn').prop('disabled', false);
    }
    if ($('#physical_form').length > 0) {
      if ($('#physical_form').valid()) {
        nextStep(1);
      } else {
        $('.next-btn').prop('disabled', true);
        return false;
      }
    } else {
      nextStep(1);
    }
  };
  showStep(currentStep);

  const nav = document.querySelector('.form__nav');
  const navWidth = nav.scrollWidth;
  function navScroll(btn, i) {
    if ($(window).width() < 575) {
      if (i == 0) {
        nav.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      }
      if (i == navItems.length - 1) {
        nav.scrollTo({
          left: navWidth - btn.offsetLeft,
          behavior: 'smooth',
        });
      }
    }
  }

  window.addEventListener('resize', function () {
    if (currentStep == 0) {
      if ($(window).width() < 576) {
        $('.next-btn').css('grid-column', '1 / 3');
      } else {
        $('.next-btn').css('grid-column', '2 / 3');
      }
    }
  });

  // фукция перехода на следующий шаг
  function nextStep(n) {
    if ($('.form-page').valid()) {
      getStep();
      currentStep = +currentStep + n;
      setStep();
      navScroll(document.querySelector('.form__nav-btn.active'), currentStep);
      showStep(currentStep);
    }
  }

  // фукция перехода на предыдущий шаг
  function prevStep(n) {
    getStep();
    currentStep = currentStep - n;
    setStep();
    showStep(currentStep);
    navScroll(document.querySelector('.form__nav-btn.active'), currentStep);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    if (currentStep == 0 && $('#physical_form').length > 0) {
      $('.next-btn').prop('disabled', false);
    }
  }

  // фукция отображения шага
  function showStep(n) {
    $('.form__nav-btn.active').removeClass('active');
    if (n == navItems.length - 1 && !$('input[name=agree]').is(':checked')) {
      $('.next-btn').text('Готово');
      $('.next-btn').prop('disabled', true);
    } else {
      $('.next-btn').text('Продолжить');
      $('.next-btn').prop('disabled', false);
    }
    if (n == 0) {
      if ($(window).width() < 576) {
        $('.next-btn').css('grid-column', '1 / 3');
      }
      backBtn.style.display = "none";
      if ($('#physical_form').length > 0 && localStorage.getItem('personal-data') !== 'valid') {
        $('.next-btn').prop('disabled', true);
      }
    } else {
      if ($(window).width() < 576) {
        $('.next-btn').css('grid-column', '2 / 3');
      }
      backBtn.style.display = "block";
    }
    if (n < navItems.length) {
      stepItems[n].style.display = "block";
      stepText.forEach(text => {
        text.querySelectorAll('div')[currentStep].style.display = "block";
      });
      navItems[n].classList.add('active');
    }
    if (n == navItems.length) {
      $('.steps').hide();
      $('.form-result').fadeIn('300');
      generateResult();
    }
  }

  // табы шагов
  navItems.forEach((btn, i) => {
    btn.addEventListener('click', () => {

      if ($('.form-page').valid()) {
        navScroll(btn, i);
        $('.form__nav-btn.active').removeClass('active');
        btn.classList.add('active');
        getStep();
        currentStep = i;
        showStep(i);
        setStep();
      } else {
        return false;
      }

      if (i == 0 && $('#physical_form').length > 0) {
        $('.next-btn').prop('disabled', false);
      }
    });
  });

  $('.check-box[name=additional_service]').each(function (i) {
    $(this).attr('id', `${$(this).parents('form').attr('id').split('_')[0]}_additional_service-${i + 1}`);
  });

  $('.input').each(function () {
    $(this).attr('id', `${$(this).parents('form').attr('id').split('_')[0]}_${$(this).attr('name')}`);
  });

  $('.check-box').not('[name=additional_service]').each(function () {
    $(this).attr('id', `${$(this).parents('form').attr('id').split('_')[0]}_${$(this).attr('name')}`);
  });


  // Проставление id-шников у радиокнопок да / нет
  $('.radio-box[name=resident]').each(function (i) {
    if (i == 0) {
      $(this).attr('id', `${$(this).attr('name')}-true`);
    } else {
      $(this).attr('id', `${$(this).attr('name')}-false`);
    }
  });
  $('.radio-box[name=temporary_registration]').each(function (i) {
    if (i == 0) {
      $(this).attr('id', `${$(this).attr('name')}-true`);
    } else {
      $(this).attr('id', `${$(this).attr('name')}-false`);
    }
  });

  // Чекбокс согласия с персональными данными
  $('input[name=agree]').on('change', function () {
    if ($(this).is(':checked')) {
      if ($(this).parents('form').valid()) {
        $('.next-btn').prop('disabled', false);
      }
      localStorage.setItem('agree', 'true');
    } else {
      localStorage.setItem('agree', 'false');
      $('.next-btn').prop('disabled', true);
    }
  });

  // Редактировать
  $('.edit').on('click', function () {
    $('.form-result').hide(); // прячем результат
    $('.form-result__content').empty(); // чистим контент, чтобы корректно работало
    $('.steps').show(); // показываем шаги
    currentStep = 0; // устанавливаем шаг в начальное значение
    setStep();
    showStep(currentStep); // показываем первый шаг
    navScroll(document.querySelector('.form__nav-btn.active'), currentStep);
    $('input[name=agree]').prop('checked', false); // убираем галочку с поля согласия с обработкой персональных данных
    if ($('#juridical_form').length) {
      data = JSON.parse(localStorage.getItem("jf-data"));
    }
    if ($('#physical_form').length) {
      data = JSON.parse(localStorage.getItem("ff-data"));
    }
    $('#physical_form .next-btn').prop('disabled', false);
  });


  // Добавление данных в объект
  let data;
  if ($('#juridical_form').length) {
    data = JSON.parse(localStorage.getItem("jf-data")) || {};
  }
  if ($('#physical_form').length) {
    data = JSON.parse(localStorage.getItem("ff-data")) || {};

  }
  let juridical_checks = [];
  let physical_checks = [];

  function clickInput(target) {
    $(`${target}`).on('change', function () {
      let stepName = $('.form__nav-btn.active').text();
      let stepSubcategory = $(this).parents('fieldset').find('legend').text().trim();
      let key, storageKey, value;

      if (target === '.input') {
        key = $(this).prev().text();
        storageKey = $(this).attr('id');
        value = $(this).val();
        localStorage.setItem(storageKey, value);
        data = {
          ...data,
        }

        data[stepName] = {
          ...data[stepName],
          id: Number(currentStep)
        };

        data[stepName][stepSubcategory] = {
          ...data[stepName][stepSubcategory],
          [key]: value,
        };
        if ($(this).val() == '') {
          delete data[stepName][stepSubcategory][key];
        }
      }

      if (target === '.select__input') {
        let arr = $(this).parents('.select').prev().text().trim().split(' ');
        if (arr[0] === 'Выберите') {
          arr.shift();
          arr[0].toUpperCase();
          key = arr.join(' ');
        } else {
          key = $(this).parents('.select').prev().text().trim();
        }

        $(this).parents('.select').find('.select__input').prop('checked', false);
        $(this).prop('checked', true);

        // tariff
        if ($(this).next().children().length == 2) {
          value = `${$(this).next().children().first().text()}: ${$(this).next().children().last().text()}`;
        } else {
          value = $(this).next().attr('data-value');
        }

        if ($(this).attr('name') === 'mailing_address_matches') {
          let matches = arr[arr.length - 1];
          arr.pop();
          if (matches === 'совпадает') {
            data = {
              ...data,
            }

            data[stepName] = {
              ...data[stepName],
              id: Number(currentStep)
            };
            delete data[stepName][stepSubcategory];
            $(this).parent().parent().next().find('.select').each(function () {
              console.log($(this).find('.select__input').first());
              $(this).find('.select__input').prop('checked', false);
              $(this).find('.select__input').first().prop('checked', true);
              $(this).find('.select__input').first().parent().parent().prev().removeClass('active');
              $(this).find('.select__input').first().parent().parent().prev().text($(this).find('.select__input').first().next().text());
            });
            key = arr.join(' ');
            value = `${matches} ${$(this).next().text().trim()}`;
          }
        }

        localStorage.setItem(key, value);
        data = {
          ...data,
        }

        data[stepName] = {
          ...data[stepName],
          id: Number(currentStep)
        };

        data[stepName][stepSubcategory] = {
          ...data[stepName][stepSubcategory],
          [key]: value,
        };
        if ($(this).is(':checked') && $(this).next().children().first().text().split(' ')[0] === 'Выберите') {
          delete data[stepName][stepSubcategory][key];
        }
      }

      if (target === '.radio-box') {
        key = $(this).parent().parent().prev().text().trim();
        storageKey = $(this).attr('id');
        if ($(this).next().text() === 'Да') {
          localStorage.removeItem($(this).parent().next().find('.radio-box').attr('id'));
        } else {
          localStorage.removeItem($(this).parent().prev().find('.radio-box').attr('id'));
        }
        value = $(this).next().text();
        if (storageKey) {
          localStorage.setItem(storageKey, value);
        }
        data = {
          ...data,
        }

        data[stepName] = {
          ...data[stepName],
          id: Number(currentStep)
        };

        data[stepName][stepSubcategory] = {
          ...data[stepName][stepSubcategory],
          [key]: value,
        };

        var $nationality = $('.select__input[name=nationality]').first();
        // Гражданство
        if ($(this).attr('name') === 'resident' && $(this).next().text() === 'Да') {
          delete data[stepName][stepSubcategory]["Гражданство"];
          delete data[stepName][stepSubcategory]["Есть ли у вас временная регистрация?"];
          $('.radio-box[name=temporary_registration]').prop('checked', false);
          $('.select__input[name=nationality]:checked').prop('checked', false);
          $nationality.prop('checked', true);
          $nationality.parent().parent().prev().removeClass('active');
          $nationality.parent().parent().prev().text('Выберите гражданство');
        }
        // Адрес регистрации
        if ($(this).attr('name') === 'temporary_registration' && $(this).next().text() === 'Нет') {
          delete data[stepName]["Адрес регистрации"];
          $('.register-address .select').each(function () {
            var $selectInput = $(this).find('.select__input');
            var $firstSelectInput = $selectInput.first();
            $selectInput.prop('checked', false);
            $firstSelectInput.prop('checked', true);
            $firstSelectInput.parent().parent().prev().removeClass('active');
            $firstSelectInput.parent().parent().prev().text($(this).find('.select__input').first().next().text());
          });
        }
      }

      if (target === '.check-box[name="additional_service"]') {

        key = $(this).parents('.form__fieldset').children().first().text();
        storageKey = $(this).attr('id');
        value = `${$(this).next().next().children().first().text()}: ${$(this).next().next().children().last().text()}`;

        if ($('#juridical_form').length) {
          juridical_checks = [...juridical_checks];
          if ($(this).is(':checked')) {
            juridical_checks.push(value);
            localStorage.setItem(`${$(this).parents('.form-page').attr('id').split('_')[0]}_${$(this).attr('name')}s`, JSON.stringify(juridical_checks));
            localStorage.setItem(storageKey, true);
          } else {
            juridical_checks.splice(juridical_checks.indexOf(value), 1);
            localStorage.setItem(`${$(this).parents('.form-page').attr('id').split('_')[0]}_${$(this).attr('name')}s`, JSON.stringify(juridical_checks));
            localStorage.removeItem(storageKey);
          }

          if (juridical_checks.length > 0) {
            data = {
              ...data,
            }
            data[stepName] = {
              ...data[stepName],
              id: Number(currentStep)
            };
            data[stepName][stepSubcategory] = [
              ...juridical_checks,
            ];
          } else {
            delete data[stepName][stepSubcategory];
          }
        }
        if ($('#physical_form').length) {
          physical_checks = [...physical_checks];
          if ($(this).is(':checked')) {
            physical_checks.push(value);
            localStorage.setItem(`${$(this).parents('.form-page').attr('id').split('_')[0]}_${$(this).attr('name')}s`, JSON.stringify(physical_checks));
            localStorage.setItem(storageKey, true);
          } else {
            physical_checks.splice(physical_checks.indexOf(value), 1);
            localStorage.setItem(`${$(this).parents('.form-page').attr('id').split('_')[0]}_${$(this).attr('name')}s`, JSON.stringify(physical_checks));
            localStorage.removeItem(storageKey);
          }

          if (physical_checks.length > 0) {
            data = {
              ...data,
            }
            data[stepName] = {
              ...data[stepName],
              id: Number(currentStep)
            };
            data[stepName][stepSubcategory] = [
              ...physical_checks,
            ];
          } else {
            delete data[stepName][stepSubcategory];
          }
        }
      }

      if (target === '.missing-street, .single-structure') {
        key = $(this).parent().prev().prev().text();
        storageKey = $(this).attr('id');
        value = $(this).next().next().text().trim();
        localStorage.setItem(storageKey, value);

        if ($(this).is(':checked')) {
          var $selectTitle = $(this).parent().prev().find('.select__title');
          $selectTitle.removeClass('active');
          $selectTitle.text($(this).parent().prev().find('.select__content-inner').children().first().next().text());
          $(this).parent().prev().find('.select__input:checked').prop('checked', false);
          $(this).parent().prev().find('.select__content-inner').children().first().prop('checked', true);

          if ($(this).prev().val() !== '') {
            $(this).prev().val('');
          }
          data = {
            ...data,
          }
          data[stepName] = {
            ...data[stepName],
            id: Number(currentStep)
          };
          data[stepName][stepSubcategory] = {
            ...data[stepName][stepSubcategory],
            [key]: value,
          };
        } else {
          localStorage.removeItem(storageKey);
          delete data[stepName][stepSubcategory][key];
        }
      }

      if (target === '.matches-address') {
        key = $(this).parent().parent().prev().text();
        storageKey = $(this).attr('id');
        value = $(this).next().next().text().trim();
        localStorage.setItem(storageKey, value);

        if ($(this).is(':checked')) {
          $(this).parent().next().find('.select').each(function () {
            $(this).find('.select__input').prop('checked', false);
            $(this).find('.select__input').first().prop('checked', true);
            $(this).find('.select__input').first().parent().parent().prev().removeClass('active');
            $(this).find('.select__input').first().parent().parent().prev().text($(this).find('.select__input').first().next().text());
          });

          $(this).parent().next().find('.input').each(function () {
            $(this).val('');
          });

          data = {
            ...data,
          }
          data[stepName] = {
            ...data[stepName],
            id: Number(currentStep),
          };
          data[stepName][stepSubcategory] = {
            ...data[stepName][stepSubcategory],
            [key]: value,
          };
          if (Object.keys(data[stepName][stepSubcategory]).length > 1) {
            data[stepName][stepSubcategory] = {
              [key]: value,
            };
          }
        } else {
          delete data[stepName][stepSubcategory];
        }
      }

      if ($('#juridical_form').length) {
        localStorage.setItem("jf-data", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("jf-data"));
        //console.log(data);
      }
      if ($('#physical_form').length) {
        localStorage.setItem("ff-data", JSON.stringify(data));
        data = JSON.parse(localStorage.getItem("ff-data"));
        //console.log(data);
      }
    });
  }

  if ($('#juridical_form').length) {

    clickInput('.input');
    clickInput('.select__input');
    clickInput('.radio-box');
    clickInput('.missing-street, .single-structure');
    clickInput('.matches-address');
  }

  if ($('#physical_form').length) {

    clickInput('.input');
    clickInput('.select__input');
    clickInput('.radio-box');
    clickInput('.missing-street, .single-structure');
    clickInput('.matches-address');
  }
  clickInput('.check-box[name="additional_service"]');

  $('.select__input[name=street]').on('change', function () {
    $(this).parents('.select').next().children().first().prop('checked', false);
  });

  // Чекбокс "В адресе отсутствует название улицы"
  $('.missing-street').on('change', function () {
    if ($(this).is(':checked')) {
      $(this).parent().prev().find('.select__input').text($(this).parent().prev().find('.select__input').first().next().attr('data-value'));
      $(this).parent().prev().find('.select__input').prop('checked', false);
      $(this).parent().prev().find('.select__input').first().prop('checked', false);
    }
  });

  // заполнение полей из localstorage при обновлении страницы
  function getStorageValues() {
    if (window.localStorage) {
      for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (key) {
          $(`.check-content:contains(${key})`).prev().prev().prop('checked', localStorage.getItem(key));
          var $title = $(`.form__label:contains(${key})`).next().find('.select__title');
          var $titleChildren = $title.children()
          $title.addClass('active');
          if ($titleChildren.length > 1) {
            $titleChildren.first().text(localStorage.getItem(key).split(':')[0]);
            $titleChildren.last().text(localStorage.getItem(key).split(':')[1]);
          } else {
            $title.text(localStorage.getItem(key));
          }
          $(`.form__legend:contains(${key})`).next().find('.select__title').text(localStorage.getItem(key));
          $(`#${key}.input`).val(localStorage.getItem(key));

          $(`.form__legend:contains(${key})`).next().children().first().find('input.check-box').prop('checked', true);
          $(`input[name=agree]`).prop('checked', key === 'agree' && localStorage.getItem(key) === 'true');
          if ($('.select__label').attr('data-value') === localStorage.getItem(key)) {
            $(this).prev().prop('checked', true);
          }

          $(`#${key}`).prop('checked', localStorage.getItem(key));
          if (localStorage["juridical_additional_services"] && juridical_checks.length == 0) {
            juridical_checks = JSON.parse(localStorage.getItem("juridical_additional_services"));
          }
          if (localStorage["physical_additional_services"] && physical_checks.length == 0) {
            physical_checks = JSON.parse(localStorage.getItem("physical_additional_services"));
          }
        }
      }

      function showFields(text) {
        $(`.form__legend--drop:contains(${text})`).addClass('active').next().show();
      }

      var $ff = $('#physical_form');
      if ($ff && $ff.length && data) {
        if (data["Личные данные"]) {
          $ff.validate().form();
          $('.next-btn').prop('disabled', !$ff.valid());
        }

        if (data["Заказ"] || data["Паспортные данные"]) {
          if (data["Заказ"] && data["Заказ"]["Адрес подключения"]) {
            showFields('Адрес подключения');
          }
          if (data["Паспортные данные"] && data["Паспортные данные"]["Адрес регистрации"]) {
            showFields('Адрес регистрации');
          }

          $ff.validate().form();

          var cond = (currentStep == navItems.length - 1 && !$('input[name=agree]').is(':checked')) || !$ff.valid();

          $('.next-btn').prop('disabled', cond);
        }
      }

      var $jf = $('#juridical_form');
      if ($jf && $jf.length && data) {
        if (data["Заказ"] && data["Заказ"]["Адрес подключения"]) {
          showFields('Адрес подключения');
        }
        if (data["Реквизиты"] && data["Реквизиты"]["Юридический адрес"]) {
          showFields('Юридический адрес');
        }
        if (data["Реквизиты"] && data["Реквизиты"]["Почтовый адрес"]) {
          showFields('Почтовый адрес');
        }

        $jf.validate().form();

        var cond = (currentStep == navItems.length - 1 && !$('input[name=agree]').is(':checked')) || !$jf.valid();

        $('.next-btn').prop('disabled', cond);
      }
    }
  }
  getStorageValues();

  $('.check-box:checked').parents('.form__field').find('.input').val('');

  // Логика радиокнопок Да / Нет
  if ($('.radio-box[name=resident]:checked').next().text() === 'Нет') {
    $('.radio-box[name=resident]:checked').parents('.form__field').next().show();
  } else {
    $('.radio-box[name=resident]:checked').parents('.form__field').next().hide();
  }

  if ($('.radio-box[name=temporary_registration]:checked').next().text() === 'Нет') {
    $('.radio-box[name=temporary_registration]:checked').parents('fieldset').next().hide();
  } else {
    $('.radio-box[name=temporary_registration]:checked').parents('fieldset').next().show();
  }

  // проверка ну пустой объект
  function isEmpty(obj) {
    for (let key in obj) {
      return false;
    }
    return true;
  }

  // функция генерации результирующего блока с введенными данными
  function generateResult() {
    if ($('#juridical_form').length) {
      data = JSON.parse(localStorage.getItem("jf-data"));
    }
    if ($('#physical_form').length) {
      data = JSON.parse(localStorage.getItem("ff-data"));
    }

    // сортируем, чтобы разделы выводились в порядке следования шагов а не в порядке их заполнения
    let sorted = Object.entries(data).sort((a, b) => a[1].id - b[1].id);
    let sortedObj = {};
    sorted.forEach(arr => {
      sortedObj = {
        ...sortedObj,
        [arr[0]]: arr[1],
      }
    });
    let sections = Object.keys(sortedObj);
    //console.log(sections);
    let html = sections.map(section => {
      if (!isEmpty(data[section]) && Object.values(data[section]).some(obj => !isEmpty(obj))) {
        return `<div class="form-result-section">
                    <div class="form-result-section__inner">
                        <legend class="form-result__title form-result-section__title">${section}</legend>
                        <div class="form-result-section__content">
                        ${Object.keys(data[section]).map(item => {
          if (!isEmpty(data[section][item])) {
            return `<div class="form-result-section__item">
                                <div class="form-result-section__content-title">${item}</div>
                                <div class="form-result-section__fields">
                                ${Array.isArray(data[section][item]) ?
                data[section][item].map(item => {
                  return `<div class="form-result-section__field form-result-section__field--full">
                                        <div class="form-result-section__val">${item}</div>
                                    </div>`
                }).join('') :
                Object.entries(data[section][item]).map(field => {
                  if (field[0] === '') {
                    return `<div class="form-result-section__field form-result-section__field--full">
                                        <div class="form-result-section__val">${field[1]}</div>
                                    </div>`
                  } else {
                    return `<div class="form-result-section__field">
                                        <div class="form-result-section__label">${field[0]}</div>
                                        <div class="form-result-section__val">${field[1]}</div>
                                    </div>`
                  }
                }).join('')
              }
                                </div >
                            </div > `
          }
        }).join('')}
                        </div>
                    </div>
            </div>`
      }
    });
    $('.form-result__content').append(html); // вставляем сгенеренную разметку
  }

  // success popup
  $('.success-popup__btn').on('click', function () {
    $('.form-result').hide(); // прячем результирующую страницу
    $('.form-result__content').empty(); // чистим результирующий контент
    $(this).parent().fadeOut('slow'); // прячем попап
    $('.overlay').fadeOut('slow'); // прячем подложку
    $('.steps').show(); // показываем степы
    currentStep = 0; // возвращаемся на нулевой шаг
    setStep();
    showStep(currentStep); // показываем нулевой шаг
    navScroll(document.querySelector('.form__nav-btn.active'), currentStep);
    $('.select__title').removeClass('active'); // убираем bold у заголовка селекта
    $('.form__legend--drop').removeClass('active');
    $('.form__drop-items').hide();
    $('.select__input:checked').prop('checked', false);
    juridical_checks = [];
    physical_checks = [];
    $('.radio-box').each(function () {
      $(this).prop('checked', false);
    });
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});