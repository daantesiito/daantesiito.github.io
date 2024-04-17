$(document).ready(function() {
    $('.arrow.prev').click(function() {
        $('.carousel').animate({marginLeft: '-=340px'}, 500);
    });

    $('.arrow.next').click(function() {
        $('.carousel').animate({marginLeft: '+=340px'}, 500);
    });
});
