$(function(){

    // === ADD NEW REDDIT ALERT FORM ====
    // ==================================
    (function(){
        var form = $('#addAlert'),
            inputSubreddit = form.find('input[name="subreddit"]'),
            inputKeyWords  = form.find('input[name="key-words"]'),
            inputContact   = form.find('input[name="contact-info"]'),
            contactBtn     = form.find('button[name="contact-method"]'),
            contactOptions = contactBtn.next('ul.dropdown-menu'),
            submitBtn      = form.find('button[type="submit"]'),
            validSubreddit = false,
            subreddits     = ['askreddit','science','technology','explainlikeimfive','leagueoflegends','psbattle'];


        // == Change subreddit placeholder
        (function(){
            var i = 1;
            inputSubreddit.attr('placeholder',subreddits[0]);
            setInterval(function(){
                (i === subreddits.length - 1)   ?   (i = 0)   :   (++i);
                inputSubreddit.attr('placeholder',subreddits[i]);
            }, 2000);
        }());

        // == Change alert via twitter, email, sms text
        contactOptions.on('click','a',function(){
            var newSrc = $(this).data('src'),
                placeholder = '';
            contactBtn
                .data('src',newSrc)
                .attr('data-src',newSrc)
                .html(newSrc+' <span class="caret"></span>');
            switch(newSrc){
                case 'Twitter':  placeholder = 'Enter your Twitter Handle!'; break;
                case 'Email':    placeholder = 'Enter your email!';          break;
                case 'Text SMS': placeholder = 'Enter your Phone number';    break;
                default: placeholder = 'Enter Your Contact information';
            }
            inputContact.attr('placeholder',placeholder);
        });

        // create alert form collection
        submitBtn.on('click', function(event){
            event.preventDefault();
            var subredditValue = valToLowerCase(inputSubreddit),
                keyWordsValue = valToLowerCase(inputKeyWords),
                contactType = contactBtn.data('src'),
                results = {};

            if ( requiredFieldsAreEmpty([inputSubreddit,inputKeyWords]) ) {
                alert('Some required fields empty');
                return false;
            }

            results = {
                subreddit: subredditValue,
                keyWords: parseKeywords(keyWordsValue),
                contactMethod: contactType
            }

            // check for valid subreddit
            $.ajax({
                dataType: "json",
                url: 'https://www.reddit.com/r/' + subredditValue + '.json',
                success: function(){ sendToDB(results); },
                error:   function(){ alert('Subreddit not valid.'); }
            });
        });

        function parseKeywords(string){
            var array = string.split(',');
            array.forEach(function(string, index){ array[index] = string.trim(); });
            return array.filter(function(string){ if (string.length > 0) return true;});
        }
        function sendToDB(results){
            $.ajax({
                method:'POST',
                url:'/createalert',
                data:JSON.stringify(results),
                contentType:'application/json',
                success: function(data){ console.log(data); }
            });
        }
    }()); // end newRedditAlert form


    // ==== SIGN UP FORM ====
    // ======================
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
            var pw = password.val().trim(),
                pc = pConfirm.val().trim();

            if ( requiredFieldsAreEmpty(required) ) {
                alert('Some required fields empty');
                return false;
            }
            if ( pw !== pc ) {
                alert('Passwords do not match');
                return false;
            }

            userData = {
                username: valToLowerCase(username),
                password: pw,
                phone: valToLowerCase(phone),
                email: email.val().trim(),
                twitter: twitter.val().trim()
            }

            $.ajax({
                method: 'POST',
                url: '/newuser',
                data: JSON.stringify(userData),
                contentType: 'application/json',
                success: function(data){
                    data === 'success' ? goToDashboard() : alert(data);
                }
            });
        };
    }()); // END signup form

    // ==== LOGIN FORM =====
    // =====================
    (function(){
        var form = $('#login'),
            username = form.find('input[name="username"]'),
            password = form.find('input[name="password"]'),
            submit   = form.find('button[type="submit"]'),
            user     = {};

        submit.on('click', function(e){
            e.preventDefault();
            if (requiredFieldsAreEmpty([username, password])) {
                alert('Required fields'); return false;
            }

            user = {
                username: valToLowerCase(username),
                password: password.val().trim()
            }

            $.ajax({
                method: 'POST',
                url: '/login',
                data: JSON.stringify(user),
                contentType: 'application/json',
                success: function(data){ handleResponse(data); }
            });
        });

        function handleResponse(str){
            if (str === 'success') {
                RA.state('dashboard');
                $.ajax({
                    method: 'GET',
                    url: '/populateDashboard',
                    success: function(data){ console.log(data); }
                });
            } else {
                alert(str);
            }
        }
    }());

    // ==== DASHBOARD =====
    // ====================
    (function(){
        var dashboard = $('.dashboard');

        dashboard.on('click','.panel-header',showPanelResults);
        dashboard.on('click','.settingsBtn',showPanelSettings);

        // show and hide results panel
        function showPanelResults(event){
            var results  = $(this).siblings('.panel-results'),
                settings = $(this).siblings('.panel-settings');
            if (results.is(':visible') && settings.is(':visible')){
                settings.slideUp({
                    duration: 125,
                    easing: 'linear',
                    complete: function(){
                        results.slideUp({
                            duration: 125,
                            easing: 'linear'
                        });
                    }
                });
            } else if (results.is(':visible')) {
                results.slideUp(250);
            } else {
                results.slideDown(250);
            }
        }
        function showPanelSettings(event){
            var settings = $(this).closest('.panel').find('.panel-settings');
            settings.is(':visible') ? settings.slideUp(250) : settings.slideDown(250);
        }
    }())


    // ==== GLOBAL FUNCTIONS - to this file at least =====
    // ===================================================

    function valToLowerCase(el){ return el.val().trim().toLowerCase(); }

    // accepts array of dom elements and checks their values
    // returns true if some of the fields have empty values
    function requiredFieldsAreEmpty(array){
        var failTest = true;
        for (var i = 0, iMax = array.length; i < iMax; ++i){
            if (array[i].val().length < 1) { break; }
            if ( i === iMax - 1) { failTest = false; }
        }
        return failTest;
    }

    var body = $('body');
    // change state of application, if state exists
    var changeState = function(state){
        body.attr('data-state', state);
    }

    // global object
    return RA = {
        state: changeState
    }

});
