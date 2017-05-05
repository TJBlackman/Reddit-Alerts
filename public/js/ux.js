$(function(){
    var main   = $('#main'),
        body   = $('body'),
        header = $('header');


    // change state for everything with a [data-cs] attribute
    body.on('click', '[data-cs]', function(){
        var state = $(this).data('cs');
        body.attr('data-state', state);
    });

}); // !!
