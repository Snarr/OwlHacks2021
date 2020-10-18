/* eslint-env jquery, browser */
$(function () {

  console.log("ready!");
  $(".dropdown-trigger").dropdown();

  $('.chips').chips();
  $('.chips-initial').chips({
    data: [{
      tag: 'Apple',
    }, {
      tag: 'Microsoft',
    }, {
      tag: 'Google',
    }],
  });
  $('.chips-placeholder').chips({
    placeholder: 'Enter a tag',
    secondaryPlaceholder: '+Tag',
  });
  $('.chips-autocomplete').chips({
    autocompleteOptions: {
      data: {
        'Apple': null,
        'Microsoft': null,
        'Google': null
      },
      limit: Infinity,
      minLength: 1
    }
  });

  $('#search-form input').keypress(function (e) {
    if (e.which == 13 && !e.shiftKey) {
      $(this).closest("form").submit();
    }
  });

  $('.skill-input').on('change', () => {
    var input = document.getElementsByName('skills[]');
    let skillsArray = []

    for (var i = 0; i < input.length; i++) {
      var a = input[i];
      skillsArray.push(a.value);
    }

    // user.profile.skills = skillsArray;
  })
});