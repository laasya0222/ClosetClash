$(document).ready(function() {
  $('.like-btn').on('click', function() {
    $(this).toggleClass('liked');
    var likes = parseInt($(this).find('.likes-count').text());
    if ($(this).hasClass('liked')) {
      $(this).find('.likes-count').text(likes + 1);
    } else {
      $(this).find('.likes-count').text(likes - 1);
    }
  });
});