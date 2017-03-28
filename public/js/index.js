$(function(){

    // global variables
    var form = $('#addNewSubreddit');

    // Change subreddit placeholder
    (function(){
        var subreddits = ['askreddit','science','technology','explainlikeimfive','leagueoflegends','psbattle'],
            i = 1,
            subredditInput = $('#subReddit');
        subredditInput.attr('placeholder',subreddits[0]);
        setInterval(function(){
            (i === subreddits.length - 1)   ?   (i = 0)   :   (++i);
            subredditInput.attr('placeholder',subreddits[i]);
        }, 2000);
    }());

    // change alert via twitter, email, sms text
    (function(){
        var button = form.find('.enterContact button'),
            newContact = button.next('ul.dropdown-menu'),
            input = form.find('.enterContact input');

        newContact.on('click','a',function(){
            var newSrc = $(this).data('src'),
                placeholder;
            button.data('src',newSrc).html(newSrc+' <span class="caret"></span>');
            switch(newSrc){
                case 'Twitter':  placeholder = 'Enter your Twitter Handle!'; break;
                case 'Email':    placeholder = 'Enter your email!';          break;
                case 'Text SMS': placeholder = 'Enter your Phone number';    break;
                default: placeholder = 'Enter Your Contact information';
            }
            input.attr('placeholder',placeholder);
        });
    }());

    // form collection
    (function(){
        var subredditInput = $('#subReddit'),
            targetWordsInput = $('#targetWords'),
            contactInput = form.find('.enterContact input'),
            saveBtn = form.find('#save');

        saveBtn.on('click', function(event){
            event.preventDefault();
            var subredditValue = subredditInput.val().trim(),
                targetWordsValue = targetWordsInput.val().trim(),
                contactValue = contactInput.val().trim(),
                contactType = $('.enterContact button').text().trim(),
                results = {};

            if (subredditValue.length   < 1) { subredditInput.focus();   return false; }
            if (targetWordsValue.length < 1) { targetWordsInput.focus(); return false; }
            if (contactValue.length     < 1) { contactInput.focus();     return false; }

            results.subreddit = subredditValue;
            results.keyWords = parseKeywords(targetWordsValue);
            results.contact = contactValue;
            results.contactMethod = contactType;

            $.ajax({
                method:'POST',
                url:'/createalert',
                data:JSON.stringify(results),
                contentType:'application/json'
            });
        });

        function parseKeywords(string){
            var array = string.split(',');
            array.forEach(function(string, index){ array[index] = string.trim(); });
            return array.filter(function(string){ if (string.length > 0) return true;});
        }
    }());
});
