$('.dropdown-menu a').click(function(){
    var buff = $('#dropdownMenuButton').text()
    
    $('#dropdownMenuButton').text($(this).text());
    $(this).text(buff)

    buff = $('#dropdownMenuButton').text();
    if(buff === 'FUCK YOU'){
      $('.img-fluid').attr("src","img/middle-finger-cactus.svg");
    }else if(buff === 'LOVE YOU'){
      $('.img-fluid').attr("src","img/undraw_intense_feeling_ft9s.svg")
    }

});
