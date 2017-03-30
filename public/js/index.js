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

    // create alert form collection
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
                contentType:'application/json',
                success: function(data){ console.log(data); }
            });
        });

        function parseKeywords(string){
            var array = string.split(',');
            array.forEach(function(string, index){ array[index] = string.trim(); });
            return array.filter(function(string){ if (string.length > 0) return true;});
        }
    }());

    // sign up form collection
    (function(){
        var form = $('#signup'),
            username = form.find('input[name=username]'),
            password = form.find('input[name=password]'),
            pConfirm = form.find('input[name=passwordConfirm]'),
            phone    = form.find('input[name=phone]'),
            email    = form.find('input[name=email]'),
            twitter  = form.find('input[name=twitter]'),
            submit   = form.find('button[type="submit"]'),
            required = [username, password, pConfirm],
            userData = {};

        form.find('button[type="submit"]').on('click', validateAndSubmit)

        function validateAndSubmit(e){
            e.preventDefault();
            if ( checkRequiredFields() ) {
                alert('Some required fields empty');
                return false;
            }
            if ( password.val() !== pConfirm.val() ) {
                alert('Passwords do not match');
                return false;
            }

            userData = {
                username: valToLowerCase(username),
                password: valToLowerCase(password),
                phone: valToLowerCase(phone),
                email: valToLowerCase(email),
                twitter: valToLowerCase(twitter)
            }

            $.ajax({
                method: 'POST',
                url: '/newuser',
                data: JSON.stringify(userData),
                contentType: 'application/json',
                success: function(data){ console.log(data); }
            });
        };

        function checkRequiredFields(){
            var failTest = true;
            for (var i = 0, iMax = required.length; i < iMax; ++i){
                if (required[i].val().length < 1) { break; }
                if ( i === iMax - 1) { failTest = false; }
            }
            return failTest;
        }

        function valToLowerCase(el){ return el.val().trim().toLowerCase(); }

    }());

});
