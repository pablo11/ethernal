$('.dropdown-menu a').click(function(){
    var buff = $('#dropdownMenuButton').text()
    $('#dropdownMenuButton').text($(this).text());
    $(this).text(buff)
  });