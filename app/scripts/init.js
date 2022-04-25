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

  // $("body").on("change", ".input[name=phone]", function () {
  //   console.log(this.value);
  // });

  $("body").on("keyup", ".input[name=phone]", function () {
    disabled.call(this);
  });

  // случай, когда заполняем на вкладке личные данные физ формы сначала все поля а телефон последним, чтобы кнопка загоралась зеленым
  $('.input').on('input', function () {
    disabled.call(this);
    if (currentStep == 0) {
      disabled.call(this);
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
    $('.next-btn').prop('disabled', $(this).val() === '+375(__) ___-__-__' || !$(this).parents('form').valid());
  }
  /* $(document).on('mouseup', function () {
    if ($('#physical_form').length > 0) {
      if ($('#physical_form').valid()) {
        $('.next-btn').prop('disabled', false);
      } else {
        $('.next-btn').prop('disabled', true);
      }
    }
  }); */

  // Поле почтовый адрес совпадает с
  $('input[name=mailing_address_matches]').on('change', function () {
    if ($('input[name=mailing_address_matches]:checked').next().find('span').text() === 'Выберите') {
      $('input[name=mailing_address_matches]:checked').parents('label').next().slideDown();
    } else {
      $('input[name=mailing_address_matches]:checked').parents('label').next().slideUp();
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

  /* $('.input').on('change', function () {
    if (!$(this).parents('form').valid() && !$('input[name=agree]').is(':checked')) {
      $('.next-btn').prop('disabled', true);
    } else {
      $('.next-btn').prop('disabled', false);
    }
  }); */

  let currentStep = localStorage.getItem('step') || 0;
  localStorage.setItem('step', currentStep);
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
      currentStep = localStorage.getItem('step') || 0;
      stepItems[currentStep].style.display = "none";
      stepText.forEach(text => {
        text.querySelectorAll('div')[currentStep].style.display = "none";
      });
      currentStep = +currentStep + n;
      localStorage.setItem('step', currentStep);
      navScroll(document.querySelector('.form__nav-btn.active'), currentStep);
      showStep(localStorage.getItem('step'));
      /* window.scrollTo({
        top: 0,
        behavior: 'smooth'
      }); */
      //$('html, body').animate({ scrollTop: 0 }, 500);
    }
  }

  // фукция перехода на предыдущий шаг
  function prevStep(n) {
    currentStep = localStorage.getItem('step');
    stepItems[currentStep].style.display = "none";
    stepText.forEach(text => {
      text.querySelectorAll('div')[currentStep].style.display = "none";
    });
    currentStep = currentStep - n;
    localStorage.setItem('step', currentStep);
    showStep(localStorage.getItem('step'));
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
    if (n != 0) {
      $('.form__legend--drop').addClass('active');
      $('.form__drop-items').slideDown();
      $(this).prop('disabled', true);
      if (!$('.form-page').valid()) {
        $('html, body').animate({ scrollTop: $(".input.error").offset().top }, 500);
      }
    }
    /* if (!$('input[name=agree]').is(':checked')) {
      $('.next-btn').prop('disabled', true);
    } else {
      $('.next-btn').prop('disabled', false);
    } */
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
      if ($('#physical_form').length > 0) {
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
        currentStep = localStorage.getItem('step') || 0;
        stepItems[currentStep].style.display = "none";
        stepText.forEach(text => {
          text.querySelectorAll('div')[currentStep].style.display = "none";
        });
        currentStep = i;
        showStep(i);
        localStorage.setItem('step', currentStep);
      } else {
        return false;
      }

      /* if (!$('input[name=agree]').is(':checked') || $('.input').hasClass('error')) {
        $('.next-btn').prop('disabled', true);
      } else {
        $('.next-btn').prop('disabled', false);
      } */

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
  //$('.radio-box[name=resident]').first().attr('id', `${$(this).attr('name')}-yes`);
  //$('.radio-box[name=resident]').last().attr('id', `${$(this).attr('name')}-no`);
  //$('.radio-box[name=temporary_registration]').first().attr('id', `${$(this).attr('name')}-yes`);
  //$('.radio-box[name=temporary_registration]').last().attr('id', `${$(this).attr('name')}-no`);

  // Чекбокс согласия с персональными данными
  $('input[name=agree]').on('change', function () {
    if ($(this).is(':checked')) {
      if ($(this).parents('form').valid()) {
        $('.next-btn').prop('disabled', false);
      }
      localStorage.setItem('agree', true);
    } else {
      $('.next-btn').prop('disabled', true);
    }
  });

  // Редактировать
  $('.edit').on('click', function () {
    $('.form-result').hide(); // прячем результат
    $('.form-result__content').empty(); // чистим контент, чтобы корректно работало
    $('.steps').show(); // показываем шаги
    currentStep = 0; // устанавливаем шаг в начальное значение
    localStorage.setItem('step', currentStep);
    showStep(currentStep); // показываем первый шаг
    navScroll(document.querySelector('.form__nav-btn.active'), currentStep);
    $('input[name=agree]').prop('checked', false); // убираем галочку с поля согласия с обработкой персональных данных
    data = JSON.parse(localStorage.getItem("data"));
    $('#physical_form .next-btn').prop('disabled', false);
  });


  // Добавление данных в объект
  let data = JSON.parse(localStorage.getItem("data")) || {};
  let checks = [];
  /* let checks = $('.check-box[name=additional_service]:checked').length == 0 ? [] : pushChecks();
  console.log($('.check-box[name=additional_service]:checked'));
  function pushChecks() {
    $('.check-box[name=additional_service]:checked').each(function () {
      checks.push(`${$(this).next().next().children().first().text()}: ${$(this).next().next().children().last().text()}`);
    });
  }
  console.log(checks); */

  function clickInput(target) {
    $(`${target}`).on('change', function () {
      let stepName = $('.form__nav-btn.active').text();
      let stepSubcategory = $(this).parents('fieldset').find('legend').text().trim();
      let key, storageKey, value;

      if (target === '.input') {
        /* if ($(this).attr('name') === 'responsible_surname') {
          key = `${$(this).prev().text()} ответственного`;
        } else {
          key = $(this).prev().text();
        } */
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
          //$(this).parent().next().find('.radio-box').prop('checked', false);
          //value = true;
        } else {
          localStorage.removeItem($(this).parent().prev().find('.radio-box').attr('id'));
          //$(this).parent().prev().find('.radio-box').prop('checked', false);
          //value = false;
        }
        value = $(this).next().text();
        //let storageVal = $(this).next().text() === 'Да' ? true : false;
        //console.log(storageVal);
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

        // Гражданство
        if ($(this).attr('name') === 'resident' && $(this).next().text() === 'Да') {
          delete data[stepName][stepSubcategory]["Гражданство"];
          delete data[stepName][stepSubcategory]["Есть ли у вас временная регистрация?"];
          $('.radio-box[name=temporary_registration]').prop('checked', false);
          $('.select__input[name=nationality]:checked').prop('checked', false);
          $('.select__input[name=nationality]').first().prop('checked', true);
          $('.select__input[name=nationality]').first().parent().parent().prev().removeClass('active');
          $('.select__input[name=nationality]').first().parent().parent().prev().text('Выберите гражданство');
        }
        // Адрес регистрации
        if ($(this).attr('name') === 'temporary_registration' && $(this).next().text() === 'Нет') {
          delete data[stepName]["Адрес регистрации"];
          $('.register-address .select').each(function () {
            $(this).find('.select__input').prop('checked', false);
            $(this).find('.select__input').first().prop('checked', true);
            $(this).find('.select__input').first().parent().parent().prev().removeClass('active');
            $(this).find('.select__input').first().parent().parent().prev().text($(this).find('.select__input').first().next().text());
          });
        }
      }

      if (target === '.check-box[name="additional_service"]') {
        key = $(this).parents('.form__fieldset').children().first().text();
        storageKey = $(this).attr('id');
        value = `${$(this).next().next().children().first().text()}: ${$(this).next().next().children().last().text()}`;

        //let str = `${$('.check-box[name=additional_service]:checked').next().next().children().first().text()}: ${$('.check-box:checked').next().next().children().last().text()}`;

        console.log($('.check-box[name=additional_service]:checked'));

        checks = [...checks];
        if ($(this).is(':checked')) {
          checks.push(value);
          //localStorage.setItem(value.split(':')[0], true);
          //localStorage.setItem(`${$(this).parents('form').attr('id').split('_')[0]}_${$(this).attr('name')}s`, checks);
          localStorage.setItem(`${$(this).attr('name')}s`, [...checks]);
          localStorage.setItem(storageKey, true);
        } else {
          checks.splice(checks.indexOf(value), 1);
          localStorage.setItem(`${$(this).attr('name')}s`, [...checks]);
          localStorage.removeItem(storageKey);
        }


        if (checks.length > 0) {
          data = {
            ...data,
          }
          data[stepName] = {
            ...data[stepName],
            id: Number(currentStep)
          };
          data[stepName][stepSubcategory] = [
            ...checks,
          ];
        } else {
          delete data[stepName][stepSubcategory];
        }
      }

      if (target === '.missing-street, .single-structure') {
        key = $(this).parent().prev().prev().text();
        //key = `${$(this).parents('.form__fieldset').children().first().text()} ${$(this).parent().prev().prev().text()}`;
        storageKey = $(this).attr('id');
        //console.log(storageKey);
        value = $(this).next().next().text().trim();
        //localStorage.setItem(`bn-${key}`, value);
        localStorage.setItem(storageKey, value);

        if ($(this).is(':checked')) {

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
          localStorage.removeItem($(this).parent().prev().prev().text());
        }
      }

      if (target === '.matches-address') {
        //console.log($(this));
        key = $(this).parent().parent().prev().text();
        storageKey = $(this).attr('id');
        value = $(this).next().next().text().trim();
        localStorage.setItem(storageKey, value);

        if ($(this).is(':checked')) {
          //delete data[stepName];
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
          } /* else {
            data[stepName][stepSubcategory] = {
              ...data[stepName][stepSubcategory],
              [key]: value,
            };
          } */
          /* data = {
            ...data,
          }

          data[stepName] = {
            ...data[stepName],
            id: Number(currentStep)
          };
          delete data[stepName][stepSubcategory]; */
        } else {
          delete data[stepName][stepSubcategory];
        }
      }

      localStorage.setItem("data", JSON.stringify(data));
      data = JSON.parse(localStorage.getItem("data"));
      console.log(data);
    });
  }

  clickInput('.input');
  clickInput('.select__input');
  clickInput('.radio-box');
  clickInput('.missing-street, .single-structure');
  clickInput('.check-box[name="additional_service"]');
  clickInput('.matches-address');

  $('.select__input[name=street').on('change', function () {
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
        console.log(key);
        if (key) {
          /* let dt = $(`#${key}`).next().next().children().first().text();
          let dd = $(`#${key}`).next().next().children().last().text();
          let check = `${dt}: ${dd}`;
          checks.push(check);
          console.log(checks); */

          //$(`.check-title:contains(${key})`).prev().prev().prop('checked', localStorage.getItem(key));
          $(`.check-content:contains(${key})`).prev().prev().prop('checked', localStorage.getItem(key));
          //$(`.check-box:contains(${key})`).prev().prev().prop('checked', localStorage.getItem(key));
          //$(`.radio-style:contains(${localStorage.getItem(key)})`).prev().prop('checked', true);
          $(`.form__label:contains(${key})`).next().find('.select__title').addClass('active');
          if ($(`.form__label:contains(${key})`).next().find('.select__title').children().length > 1) {
            $(`.form__label:contains(${key})`).next().find('.select__title').children().first().text(localStorage.getItem(key).split(':')[0]);
            $(`.form__label:contains(${key})`).next().find('.select__title').children().last().text(localStorage.getItem(key).split(':')[1]);
          } else {
            $(`.form__label:contains(${key})`).next().find('.select__title').text(localStorage.getItem(key));
          }
          //$(`.form__label:contains(${key})`).next().val(localStorage.getItem(key));
          $(`#${key}.input`).val(localStorage.getItem(key));
          $(`.form__legend:contains(${key})`).next().children().first().find('input.check-box').prop('checked', true);
          /* let keyArr = key.split(' ');
          let label = keyArr[keyArr.length - 1];
          console.log(label);
          let legend = keyArr.splice(0, keyArr.indexOf(label));
          console.log(legend.join(' ')); */
          //let res = $(`.form__legend:contains(${legend})`).next().find('.form__label');
          //$(`.form__legend:contains(${legend})`).next().find(`.form__label:contains(${label})`).next().next().find('.check-box').prop('checked', localStorage.getItem(key));
          //$(`.form__label:contains(${key})`).next().next().find('.check-box').prop('checked', localStorage.getItem(key));
          /* if ($('.check-box').attr('id') === key) {
            console.log(true);
            $(this).prop('checked', true);
          } else {
            console.log(false);
          } */
          //$(`.form__label:contains(${key})`).next().find(`.radio-style:contains(${localStorage.getItem(key)})`).prev().prop('checked', true);
          //$(`.radio-box[name=${key}]`).prop('checked', localStorage.getItem(key));
          /* if ($('.form__label').text() === key) {
            $(this).next().next().find('.check-box').prop('checked', localStorage.getItem(key));
          } */
          /* if ($('.form__label').text() === label && $('.form__label').parents('.form__legend').text() === legend) {
            $('.form__label').next().next().find('.check-box').prop('checked', localStorage.getItem(key));
          } */
          if ($('.select__label').attr('data-value') === localStorage.getItem(key)) {
            $(this).prev().prop('checked', true);
          }
          //$('.radio-box').prop('checked', false);
          $(`#${key}`).prop('checked', localStorage.getItem(key));
          console.log(key);
          //localStorage["additional_services"]
          if (localStorage["additional_services"] && checks.length == 0) {
            checks.push(...localStorage.getItem('additional_services').split('.,'));
          }
          console.log(checks);
          //$('.radio-box').prop('checked', false);
          //$(`#${key}-${localStorage.getItem(key)}.radio-box`).prop('checked', localStorage.getItem(key));
          /* if (localStorage.getItem(key) === true) {
            $(`.radio-style[name=${key}]:contains(Да)`).prop('checked', localStorage.getItem(key));
          }
          if (localStorage.getItem(key) === false) {
            $(`.radio-style[name=${key}]:contains(Нет)`).prop('checked', localStorage.getItem(key));
          } */
        }
      }
    }
  }
  getStorageValues();

  $('.check-box:checked').parents('.form__field').find('.input').val('');

  /* if ($('.matches-address').is(':checked')) {
    $(this).parent().next().hide();
  } */

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
    data = JSON.parse(localStorage.getItem("data"));

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
    showStep(currentStep); // показываем нулевой шаг
    navScroll(document.querySelector('.form__nav-btn.active'), currentStep);
    $('.select__title').removeClass('active'); // убираем bold у заголовка селекта
    $('.form__legend--drop').removeClass('active');
    $('.select__input:checked').prop('checked', false);
    $('.form__hidden-items').show();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});