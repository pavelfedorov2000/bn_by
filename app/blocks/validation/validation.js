app.validation = {
  name: 'validation',
  description: 'your script description',
  init() {
    // validation methods
    $.validator.addMethod("minlenghtphone", function (value, element) {
      return value.replace(/\D+/g, '').length == 12;
    });
    $.validator.addMethod("requiredphone", function (value, element) {
      return value.replace(/\D+/g, '').length > 0;
    });
    $.validator.addMethod("notNumber", function (value, element, param) {
      var reg = /[0-9]/;
      if (reg.test(value)) {
        return false;
      } else {
        return true;
      }
    });
    function fieldRequired() {
      return $('.input').val().length > 0;
    }
    function dateRequired() {
      return $('.input[name=passport_from]').val().length > 0 && $('.input[name=passport_to]').val().length > 0;
    }
    /* function phoneRequired() {
        return $('.input[name=phone]').val().length > 1;
    } */

    $.validator.addMethod(
      "dateDECH",
      function (value, element) {
        var check = true;
        var re = /^\d{1,2}\.\d{1,2}\.\d{4}$/;
        if (re.test(value) && value != '') {
          var adata = value.split('.');
          var dd = parseInt(adata[0], 10);
          var mm = parseInt(adata[1], 10);
          var yyyy = parseInt(adata[2], 10);
          var xdata = new Date(yyyy, mm - 1, dd);
          if ((xdata.getFullYear() === yyyy) && (xdata.getMonth() === mm - 1) && (xdata.getDate() === dd)) {
            check = true;
          }
          else {
            check = false;
          }
        } else {
          check = false;
        }
        return this.optional(element) || check;
      }
    );
    $.validator.addMethod("lessThan",
      function (value, element, params) {
        var endDate = $('.input[name=passport_to').val().split('.').reverse().join('/');
        return new Date(endDate) > new Date(value.split('.').reverse().join('/'));//|| value == ""
      }
    );
    $.validator.addMethod("greaterThan",
      function (value, element, params) {
        var startDate = $('.input[name=passport_from').val().split('.').reverse().join('/');
        return new Date(startDate) < new Date(value.split('.').reverse().join('/'));//|| value == ""
      }
    );


    $.validator.addMethod('cyrillic', function (value) {
      var result = true;
      var iChars = '!@#$%^&*()+=-[]\\\';,./{}|":<>?"+"абвгдеёжзийклмнопрстуфхцчшщъыьэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ"+" ';
      for (var i = 0; i < value.length; i++) {
        if (iChars.indexOf(value.charAt(i)) != -1) {
          return false;
        }
      }
      return result;
    }, '');
    $.validator.addMethod('russian', function (value) {
      var result = true;
      var iChars = '!@#$%^&*()+=-[]\\\';,./{}|":<>?"+"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"+" ';
      for (var i = 0; i < value.length; i++) {
        if (iChars.indexOf(value.charAt(i)) != -1) {
          return false;
        }
      }
      return result;
    }, '');
    $.validator.addMethod('not_symbols', function (value) {
      //value = localStorage.getItem(key) || value;
      var result = true;
      var iChars = '!@#$%^&*()+=-[]\\\'`~;,./{}|":<>?"';
      for (var i = 0; i < value.length; i++) {
        if (iChars.indexOf(value.charAt(i)) != -1) {
          return false;
        }
      }
      return result;
    }, '');
    $.validator.addMethod('defis_only_symbol', function (value) {
      var result = true;
      var iChars = '!@#$%^&*()+=[]\\\'`~;,./{}|":<>?"';
      for (var i = 0; i < value.length; i++) {
        if (iChars.indexOf(value.charAt(i)) != -1) {
          return false;
        }
      }
      return result;
    }, '');
    $.validator.addMethod("emailfull", function (value, element) {
      return this.optional(element) || /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i.test(value);
    });

    $('#juridical_form').validate({
      rules: {
        name: {
          notNumber: true,
          defis_only_symbol: true,
        },
        surname: {
          notNumber: true,
          defis_only_symbol: true,
        },
        patronymic: {
          notNumber: true,
          defis_only_symbol: true,
        },
        position: {
          notNumber: true,
          defis_only_symbol: true,
        },
        phone: {
          //requiredphone: true,
          //minlenghtphone: true,
          /* requiredphone: true,
          minlenghtphone: {
              param: true,
              depends: phoneRequired,
          }, */
        },
        email: {
          emailfull: true,
        },
        /* index: {
          number: true,
          rangelength: [6, 6]
        }, */
        /* unp: {
          number: true,
          rangelength: [9, 9],
          depends: fieldRequired
        }, */
        bic: {
          rangelength: [8, 11],
          cyrillic: true,
        },
        subscriber_box: {
          number: true,
        },
        responsible_name: {
          notNumber: true,
          defis_only_symbol: true,
        },
        responsible_surname: {
          notNumber: true,
          defis_only_symbol: true,
        },
        responsible_patronymic: {
          notNumber: true,
          defis_only_symbol: true,
        },
        responsible_position: {
          notNumber: true,
          defis_only_symbol: true,
        },
        connection_room: {
          not_symbols: true,
        },
        juridical_room: {
          not_symbols: true,
        },
        mailing_room: {
          not_symbols: true,
        },
        connection_home: {
          not_symbols: true,
          russian: true,
        },
        connection_corpus: {
          number: true,
        },
        juridical_home: {
          not_symbols: true,
          russian: true,
        },
        juridical_corpus: {
          number: true,
        },
        mailing_home: {
          not_symbols: true,
          russian: true,
        },
        mailing_corpus: {
          number: true,
        },
      },
    });

    $('#physical_form').validate({
      rules: {
        name: {
          notNumber: {
            param: true,
            depends: fieldRequired,
          },
          defis_only_symbol: {
            param: true,
            depends: fieldRequired,
          },
          required: true,
          //depends: fieldRequired
        },
        surname: {
          notNumber: {
            param: true,
            depends: fieldRequired,
          },
          defis_only_symbol: {
            param: true,
            depends: fieldRequired,
          },
          required: true,
          //depends: fieldRequired
        },
        patronymic: {
          notNumber: {
            param: true,
            depends: fieldRequired,
          },
          defis_only_symbol: {
            param: true,
            depends: fieldRequired,
          },
          required: true,
          //depends: fieldRequired
        },
        position: {
          notNumber: true,
          defis_only_symbol: true,
        },
        phone: {
          requiredphone: true,
          //minlenghtphone: true,
          //depends: fieldRequired,
          /* requiredphone: {
            param: true,
            depends: fieldRequired,
          }, */
          minlenghtphone: {
            param: true,
            depends: fieldRequired,
          },
          /* required: {
              param: true,
              depends: phoneRequired,
          } */
        },
        email: {
          emailfull: {
            param: true,
            depends: fieldRequired,
          },
          required: true,
          //depends: fieldRequired
        },
        /* index: {
          number: true,
          rangelength: [6, 6]
        },
        unp: {
          number: true,
          rangelength: [9, 9]
        }, */
        bic: {
          rangelength: [8, 11],
          cyrillic: true,
        },
        subsciber_box: {
          number: true,
        },
        passport_series: {
          cyrillic: true,
          not_symbols: true,
        },
        passport_num: {
          cyrillic: true,
          not_symbols: true,
        },
        passport_from: {
          //date: true,
          dateDECH: {
            param: true,
            depends: dateRequired,
          },
          lessThan: {
            param: true,
            depends: dateRequired,
          },
        },
        passport_to: {
          //date: true,
          dateDECH: {
            param: true,
            depends: dateRequired,
          },
          greaterThan: {
            param: true,
            depends: dateRequired,
          },
        },
        passport_identification_number: {
          cyrillic: true,
        },
        connection_room: {
          not_symbols: true,
        },
        connection_home: {
          not_symbols: true,
          russian: true,
        },
        connection_corpus: {
          number: true,
        },
        register_room: {
          not_symbols: true,
        },
        register_home: {
          not_symbols: true,
          russian: true,
        },
        register_corpus: {
          number: true,
        },
      },
    });

    $.fn.setCursorPosition = function (pos) {
      if ($(this).get(0).setSelectionRange) {
        $(this).get(0).setSelectionRange(pos, pos);
      } else if ($(this).get(0).createTextRange) {
        var range = $(this).get(0).createTextRange();
        range.collapse(true);
        range.moveEnd('character', pos);
        range.moveStart('character', pos);
        range.select();
      }
    };

    // phone mask
    $("input[name=phone]").on('click', function () {
      $(this).setCursorPosition(4);
    }).mask("+375 (99) 999-99-99");

    // BY mask
    $.mask.definitions['h'] = '[A-Z-0-9]';
    $('input[name=account_number]').on('click', function () {
      $(this).setCursorPosition(2);
    }).mask("BY99 hhhh hhhh hhhh hhhh hhhh hhhh");
    $('input[name=passport_from], input[name=passport_to').on('click', function () {
      $(this).setCursorPosition(0);
    }).mask("99.99.9999");
    $("input[name=unp]").on('click', function () {
      $(this).setCursorPosition(0);
    }).mask("999999999");
    $("input[data-input=index]").on('click', function () {
      $(this).setCursorPosition(0);
    }).mask("999999");
  },
};