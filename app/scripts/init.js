$(document).ready(function () {

    app.validation.init();
    // Custom jquery select
    $('.select__title').on('click', function () {
        $(this).parents('.form__field').siblings().find('.select__title').removeClass('active');
        $(this).parents('.form__field').siblings().find('.select__title').removeClass('focus');
        $(this).parents('.form__field').siblings().find('.select__content').slideUp('300');
        $(this).addClass('active');
        $(this).toggleClass('focus');
        $(this).next().slideToggle('300');
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

    function filterFunction(input) {
        let filter = input.value.toUpperCase();
        let a = input.nextElementSibling.querySelectorAll('label');
        console.log(a);
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

    $('input[name=matches_address]').on('change', function () {
        if ($(this).is(':checked')) {
            $(this).parent().next().slideUp();
        } else {
            $(this).parent().next().slideDown();
        }
    });

    $('input[name=mailing_address_matches]').on('change', function () {
        if ($('input[name=mailing_address_matches]:checked').next().find('span').text() === 'Выберите') {
            $('input[name=mailing_address_matches]:checked').parents('label').next().slideDown();
        } else {
            $('input[name=mailing_address_matches]:checked').parents('label').next().slideUp();
        }
    });

    $('.radio-box[name=resident]').on('click', function () {
        if ($(this).next().text() === 'Нет') {
            $(this).parent().parent().parent().next().slideDown();
        } else {
            $(this).parent().parent().parent().next().slideUp();
        }
    });

    $('.radio-box[name=temporary_registration]').on('click', function () {
        if ($(this).next().text() === 'Нет') {
            $(this).parents('fieldset').next().slideUp();
        } else {
            $(this).parents('fieldset').next().slideDown();
        }
    });

    $('.form__legend--drop').on('click', function () {
        $(this).toggleClass('active');
        $(this).next().slideToggle('300');
    });


    let currentStep = 0;
    localStorage.setItem('step', currentStep);
    const navItems = document.querySelectorAll('.form__nav-btn');
    const stepItems = document.querySelectorAll('.form__step');
    const stepText = document.querySelectorAll('.form-page__aside-text');
    // Buttons
    let backBtn = document.querySelector('.back-btn');
    let nextBtn = document.querySelector('.next-btn');

    // Логика шагов
    backBtn.onclick = () => prevStep(1);
    nextBtn.onclick = () => {
        if ($('#physical_form').length > 0) {
            if ($('#physical_form').valid()) {
                nextStep(1);
            } else {
                return false;
            }
        } else {
            nextStep(1);
        }
    };
    showStep(localStorage.getItem('step'));

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
    navItems.forEach((btn, i) => {
        btn.addEventListener('click', () => {
            if ($('#physical_form').length > 0) {
                if ($('#physical_form').valid()) {
                    navScroll(btn, i);
                    $('.form__nav-btn.active').removeClass('active');
                    btn.classList.add('active');
                    stepItems[currentStep].style.display = "none";
                    stepText.forEach(text => {
                        text.querySelectorAll('div')[currentStep].style.display = "none";
                    });
                    currentStep = i;
                    showStep(i);
                } else {
                    return false;
                }
            } else {
                navScroll(btn, i);
                $('.form__nav-btn.active').removeClass('active');
                btn.classList.add('active');
                stepItems[currentStep].style.display = "none";
                stepText.forEach(text => {
                    text.querySelectorAll('div')[currentStep].style.display = "none";
                });
                currentStep = i;
                showStep(i);
            }
        });
    });

    stepItems[currentStep].querySelectorAll('.input').forEach(input => {
        input.addEventListener('change', () => {
            if (!$('.form-page').valid()) {
                $('.next-btn').prop('disabled', true);
            } else {
                $('.next-btn').prop('disabled', false);
            }
        });
    });

    window.addEventListener('resize', function () {
        if (currentStep == 0) {
            if ($(window).width() < 576) {
                $('.next-btn').css('grid-column', '1 / 3');
            } else {
                $('.next-btn').css('grid-column', '2 / 3');
            }
        }
    });

    function showStep(n) {

        $('.form__nav-btn.active').removeClass('active');
        if (n < navItems.length) {
            stepItems[n].style.display = "block";
            stepText.forEach(text => {
                text.querySelectorAll('div')[currentStep].style.display = "block";
            });
            navItems[n].classList.add('active');
        }
        if (n == 0) {
            if ($(window).width() < 576) {
                $('.next-btn').css('grid-column', '1 / 3');
            }
            backBtn.style.display = "none";
        } else {
            if ($(window).width() < 576) {
                $('.next-btn').css('grid-column', '2 / 3');
            }
            backBtn.style.display = "block";
        }

        if (n == navItems.length - 1 && !$('input[name=agree]').is(':checked')) {
            $('.next-btn').text('Готово');
            $('.next-btn').prop('disabled', true);
        } else {
            $('.next-btn').text('Продолжить');
            $('.next-btn').prop('disabled', false);
        }

        if (n == navItems.length) {
            $('.steps').hide();
            $('.form-result').fadeIn('300');
            generateResult();
        }
    }

    $('input[name=agree]').on('change', function () {
        if ($(this).is(':checked')) {
            $('.next-btn').prop('disabled', false);
            localStorage.setItem('agree', true);
        } else {
            $('.next-btn').prop('disabled', true);
        }
    });

    function nextStep(n) {
        stepItems[currentStep].style.display = "none";
        stepText.forEach(text => {
            text.querySelectorAll('div')[currentStep].style.display = "none";
        });
        currentStep = +currentStep + n;
        localStorage.setItem('step', currentStep);
        navScroll(document.querySelector('.form__nav-btn.active'), currentStep);
        showStep(localStorage.getItem('step'));
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function prevStep(n) {
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
    }

    // Редактировать
    $('.edit').on('click', function () {
        $('.form-result').hide(); // прячем результат
        $('.form-result__content').empty(); // чистим контент, чтобы корректно работало
        $('.steps').show(); // показываем шаги
        currentStep = 0; // устанавливаем шаг в начальное значение
        showStep(currentStep); // показываем первый шаг
        navScroll(document.querySelector('.form__nav-btn.active'), currentStep);
        $('input[name=agree]').prop('checked', false); // убираем галочку с поля согласия с обработкой персональных данных
        data = JSON.parse(localStorage.getItem("data"));
    });


    // Добавление данных в объект
    let data = {};
    let checks = [];

    function clickInput(target) {
        $(`${target}`).on('change', function () {
            let stepName = $('.form__nav-btn.active').text();
            let stepSubcategory = $(this).parents('fieldset').find('legend').text().trim();
            let key, value;

            if (target === '.input') {
                key = $(this).prev().text();
                value = $(this).val();
                localStorage.setItem(key, value);
                data = {
                    ...data,
                }

                data[stepName] = {
                    ...data[stepName],
                    id: currentStep
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
                            id: currentStep
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
                    id: currentStep
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
                value = $(this).next().text();
                localStorage.setItem(key, value);
                data = {
                    ...data,
                }

                data[stepName] = {
                    ...data[stepName],
                    id: currentStep
                };

                data[stepName][stepSubcategory] = {
                    ...data[stepName][stepSubcategory],
                    [key]: value,
                };

                // Гражданство
                if ($(this).attr('name') === 'resident' && $(this).next().text() === 'Да') {
                    delete data[stepName][stepSubcategory]["Гражданство"];
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
                value = `${$(this).next().next().children().first().text()}: ${$(this).next().next().children().last().text()}`;

                checks = [...checks];
                if ($(this).is(':checked')) {
                    checks.push(value);
                    localStorage.setItem(value.split(':')[0], true);
                } else {
                    checks.splice(checks.indexOf(value), 1);
                    localStorage.setItem(value.split(':')[0], false);
                }


                if (checks.length > 0) {
                    data = {
                        ...data,
                    }
                    data[stepName] = {
                        ...data[stepName],
                        id: currentStep
                    };
                    data[stepName][stepSubcategory] = [
                        ...checks,
                    ];
                } else {
                    delete data[stepName][stepSubcategory];
                }
            }

            if (target === '.check-box[name="missing_street"], .check-box[name="single_structure"]') {
                key = $(this).parent().prev().prev().text();
                value = $(this).next().next().text().trim();
                localStorage.setItem(key, value);

                if ($(this).is(':checked')) {
                    if ($(this).prev().val() !== '') {
                        $(this).prev().val('');
                    }
                    data = {
                        ...data,
                    }
                    data[stepName] = {
                        ...data[stepName],
                        id: currentStep
                    };
                    data[stepName][stepSubcategory] = {
                        ...data[stepName][stepSubcategory],
                        [key]: value,
                    };
                }
            }

            if (target === '.check-box[name="matches_address"]') {
                key = $(this).parent().prev().text();
                value = $(this).next().next().text().trim();
                localStorage.setItem(key, value);

                if ($(this).is(':checked')) {
                    //delete data[stepName];
                    $(this).parent().next().find('.select').each(function () {
                        $(this).find('.select__input').prop('checked', false);
                        $(this).find('.select__input').first().prop('checked', true);
                        $(this).find('.select__input').first().parent().parent().prev().removeClass('active');
                        $(this).find('.select__input').first().parent().parent().prev().text($(this).find('.select__input').first().next().text());
                    });
                    data = {
                        ...data,
                    }
                    data[stepName] = {
                        ...data[stepName],
                        id: currentStep,
                    };
                    data[stepName][stepSubcategory] = {
                        ...data[stepName][stepSubcategory],
                        [key]: value,
                    };
                } else {
                    delete data[stepName][stepSubcategory];
                }
            }

            localStorage.setItem("data", JSON.stringify(data));
            data = JSON.parse(localStorage.getItem("data"));
            //console.log(data);
        });
    }
    clickInput('.input');
    clickInput('.select__input');
    clickInput('.radio-box');
    clickInput('.check-box[name="additional_service"]');
    clickInput('.check-box[name="missing_street"], .check-box[name="single_structure"]');
    clickInput('.check-box[name="matches_address"]');

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        console.log(key);
        $(`.form__label:contains(${key})`).next().val(localStorage.getItem(key));
        $(`.check-title:contains(${key})`).prev().prev().prop('checked', localStorage.getItem(key));
        $(`.check-content:contains(${key})`).prev().prev().prop('checked', localStorage.getItem(key));
        //$(`.radio-style:contains(${localStorage.getItem(key)})`).prev().prop('checked', true);
        //$(`.form__check--align-center .check-content:contains(${localStorage.getItem(key)})`).prev().prev().prop('checked', true);
        $(`.form__label:contains(${key})`).next().find('.select__title').addClass('active');
        if ($(`.form__label:contains(${key})`).next().find('.select__title').children().length > 1) {
            $(`.form__label:contains(${key})`).next().find('.select__title').children().first().text(localStorage.getItem(key).split(':')[0]);
            $(`.form__label:contains(${key})`).next().find('.select__title').children().last().text(localStorage.getItem(key).split(':')[1]);
        } else {
            $(`.form__label:contains(${key})`).next().find('.select__title').text(localStorage.getItem(key));
        }

        if ($('.select__label').attr('data-value') === localStorage.getItem(key)) {
            $(this).prev().prop('checked', true);
        }
    }

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

    function isEmpty(obj) {
        for (let key in obj) {
            // если тело цикла начнет выполняться - значит в объекте есть свойства
            return false;
        }
        return true;
    }

    console.log(Object.values(data));

    // функция генерации результирующего блока с введенными данными
    function generateResult() {
        data = JSON.parse(localStorage.getItem("data"));
        let sorted = Object.entries(data).sort((a, b) => a[1].id - b[1].id);
        let sortedObj = {};
        sorted.forEach(arr => {
            sortedObj = {
                ...sortedObj,
                [arr[0]]: arr[1],
            }
        });
        let sections = Object.keys(sortedObj);
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
        $('.form-result__content').append(html);
    }

    // success popup
    $('.success-popup__btn').on('click', function () {
        $('.form-result').hide();
        $('.form-result__content').empty(); // чистим результирующий контент
        $(this).parent().fadeOut('slow');
        $('.overlay').fadeOut('slow');
        $('.steps').show();
        currentStep = 0; // возвращаемся на нулевой шаг
        showStep(currentStep);
        navScroll(document.querySelector('.form__nav-btn.active'), currentStep);
        $('.select__title').removeClass('active');
        $('.form__legend--drop').removeClass('active');
        $('.select__input:checked').prop('checked', false);
    });
});