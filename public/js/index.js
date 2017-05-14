$(function(){


    function unauthorized(){
        alert('Session Timeout: You must re-login to perform this action.');
        RA.state('login');
    }

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

    function firstTimeUser(){
        alert('TODO: Show some instructions on how to use this service!');
    }

    // change state of application, if state exists
    var changeState = function(state){
        $(document.body).attr('data-state', state);
    };

    // global RedditAlerts obj
    RA = {
        state: changeState
    };

    // === ADD NEW REDDIT ALERT FORM ====
    // =========================================================================================================
    // =========================================================================================================
    // =========================================================================================================

    (function(){
        var form = $('#addAlert'),
            inputSubreddit = form.find('input[name="subreddit"]'),
            inputKeyWords  = form.find('input[name="key-words"]'),
            inputContact   = form.find('input[name="contact-info"]'),
            contactBtn     = form.find('button[name="contact-method"]'),
            contactOptions = contactBtn.next('ul.dropdown-menu'),
            submitBtn      = form.find('button[type="submit"]'),
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
            };

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
    // =========================================================================================================
    // =========================================================================================================
    // =========================================================================================================

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

        submit.on('click', validateAndSubmit);

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
            };

            $.ajax({
                method: 'POST',
                url: '/newuser',
                data: JSON.stringify(userData),
                contentType: 'application/json',
                success: function(data){
                    if (data === 'success') {
                        RA.state('dashboard');
                        firstTimeUser();
                    } else {
                        alert(data);
                    }
                }
            });
        }
    }()); // END signup form

    // ==== LOGIN FORM =====
    // =========================================================================================================
    // =========================================================================================================
    // =========================================================================================================

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
            };

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
                RA.getNotifications();
            } else {
                alert(str);
            }
        }
    }());

    // ==== DASHBOARD =====
    // =========================================================================================================
    // =========================================================================================================
    // =========================================================================================================

    (function(){
        var dashboard       = $('.dashboard'),
            notificationRow = dashboard.find('.notification-row'),
            filterRow       = dashboard.find('.filtersRow');

        filterRow.on('click','[name="clearFilters"]', function(){ alert('TODO: clear filters and reset data'); });
        filterRow.on('click', '.dropdown-menu a', function(e){
            updateSelectedFilter(e);
            refreshData();
        });
        filterRow.on('click','#searchBtn', function(){ refreshData(); });
        filterRow.on('change', function(e){ refreshData(); });

        notificationRow.on('click','[data-action]', getActions);
        notificationRow.on('click','.new a', markPostAsSeen);

        function markPostAsSeen(e){
            var row = $(e.target).closest('.notification'),
                id = row.attr('data-rel');
            row.removeClass('new').addClass('visited');
            updateNotificationAttribute(id, 'new', 'false');
        }

        function getActions(e){
            var btn = $(this),
                action = btn.attr('data-action'),
                id = btn.closest('.notification').attr('data-rel');
            switch (action) {
                case 'details': toggleDetails(btn, id); break;
                case 'bookmark': bookmarkNotification(btn, id); break;
                case 'copy-link': copyLinkToClipboard(btn, id); break;
                case 'archive': archiveNotification(btn, id); break;
                case 'delete': deleteNotification(btn, id); break;
                default: console.warn('No action determined for:', action);
            }
        }

        function toggleDetails(btn, id){
            var row = btn.closest('.notification'),
                detailsPanel = row.find('.notification-details'),
                duration = 250;
            if (detailsPanel.is(':visible')){
                detailsPanel.slideUp(duration);
            }  else {
                notificationRow.find('.notification-details:visible').slideUp(duration);
                detailsPanel.slideDown(duration);
            }
        }

        function bookmarkNotification(btn, id) {
            var row       = btn.closest('.notification'),
                icon      = row.find('.favorite button .fa'),
                actionBtn = row.find('.action-buttons [data-action="bookmark"]'),
                key       = 'bookmark',
                value     = null;

            icon.toggleClass('fa-bookmark-o');
            icon.toggleClass('fa-bookmark');

            if (actionBtn.text() === 'Bookmark'){
                actionBtn.text('Un-bookmark');
                value = true;
            } else {
                actionBtn.text('Bookmark');
                value = false;
            }

            updateNotificationAttribute(id, key, value);
        }

        function copyLinkToClipboard(btn, id){
            var input = btn.closest('.notification-details.well').find('.full-details input[readonly]'),
                status = false;

            input.select();
            status = document.execCommand('copy');
            input.blur();

            if (status){
                btn.text('Copied!');
                setTimeout(() => btn.text('Copy Link'), 1500);
            } else {
                window.prompt("Unable to copy automatically. \nTo copy, press Ctrl + C, then enter. ", input.val());
            }
        }

        function archiveNotification(btn, id){
            var row = btn.closest('.notification'),
                value = null;

            if (btn.text() === 'Archive'){
                btn.text('Un-archive');
                value = true;
                row.fadeOut(750, () => row.remove());
            } else {
                btn.text('Archive');
                value = false;
            }

            updateNotificationAttribute(id, 'archive', value);
        }

        function deleteNotification(btn, id){
            var row = btn.closest('.notification'),
                index = RA.notifications.findIndex((obj) => obj._id === id);
            row.fadeOut(750, () => row.remove());
            RA.notifications.splice(index, 1);
            $.ajax({
                method:'DELETE',
                url: '/deleteNotification',
                contentType: 'application/json',
                data: JSON.stringify({'id': id}),
                error: function(err) { console.log(err); },
                success: function(data) { console.log(data); }
            });
        }

        function updateSelectedFilter(e){
            var target = $(e.target),
                value = target.attr('data-value'),
                btn = target.closest('ul').prev('button');
            if (value === '') {
                btn.attr('data-selected','').text(btn.data('name'));
            } else {
                btn.attr('data-selected', value).text('/'+value);
            }
            target.closest('ul').prev('button').attr('data-selected', value);
        }

        function gatherFilters(){
            return {
                subreddit:  filterRow.find('[name="subreddit-dropdown"]').attr('data-selected'),
                author:     filterRow.find('[name="author-dropdown"]').attr('data-selected'),
                bookmark:   filterRow.find('[name="bookmark-toggle"]').is(':checked'),
                archive:    filterRow.find('[name="archive-toggle"]').is(':checked'),
                new:        filterRow.find('[name="new-toggle"]').is(':checked'),
                visited:    filterRow.find('[name="visited-toggle"]').is(':checked'),
                search:     filterRow.find('[name="search-field"]').val()
            };
        }

        function refreshData(){

            var params = gatherFilters();

            // copy new array from master array
            RA.notifications.filtered = RA.notifications.master.slice();

            // filter from dropdown options
            ['subreddit', 'author'].forEach(function(key){
                if (params[key] !== ''){
                    RA.notifications.filtered = RA.notifications.filtered.filter(function(notice){
                        if (params[key] === notice[key]) { return true; }
                    });
                }
            });

            // include from check boxes, only if 1 or more are checked
            if ( params.bookmark || params.archive || params.new || params.visited ) {
                RA.notifications.filtered = RA.notifications.filtered.filter(function(notice){
                    if  (  params.bookmark  && params.bookmark === notice.bookmark
                        || params.archive   && params.archive === notice.archive
                        || params.new       && params.new === notice.new
                        || params.visited   && params.visited !== notice.new ) {
                            return true;
                        }
                });
            }

            if (params.search.length > 0){
                var values = params.search.trim().split(' ');
                console.log(values);
                RA.notifications.filtered = RA.notifications.filtered.filter(function(notice){
                    var str   = JSON.stringify(notice),
                        index = 0,
                        found = false;
                    (function findMatch(){
                        if (values[index]){
                            if (str.includes(values[index])) {
                                found = true;
                            } else {
                                ++index;
                                findMatch();
                            }
                        }
                    }());
                    return found;
                });
            }

            renderNotifications(RA.notifications.filtered);
        }

        function renderFilters(array){
            filterRow.find('.filter-dropdown').each(function(index, element){
                var newOptions = [],
                    categoryName = $(element).attr('data-name'),
                    dropDown = $(element).find('.dropdown-menu');
                array.forEach(function(obj){
                    if (newOptions.indexOf(obj[categoryName]) === -1){
                        newOptions.push(obj[categoryName]);
                    }
                });
                newOptions.sort(function(a, b) {
                    return (a.toLowerCase().localeCompare(b.toLowerCase()));
                }).forEach(function(str){
                    dropDown.append(getFilterHTML(str));
                });
            });
        }

        function renderNotifications(array){
            var i       = 0,
                iMax    = array.length,
                rowWrap = notificationRow.children('div');

            rowWrap.html('');
            array.forEach(function(obj){
                var rowHTML = getNotificationHTML(obj);
                rowWrap.append(rowHTML);
            });
            refreshFilters(array);
        }

        function refreshFilters(array){

        }

        function getFilterHTML(str){
            return `<li>
                <a href="#" data-role="filter-select" data-value="${str}">${str}</a>
            </li>`;
        }

        function getNotificationHTML(obj){
            var bookmarkClass = obj.bookmark ? 'fa-bookmark' : 'fa-bookmark-o',
                bookmarkText = obj.bookmark ? 'Un-bookmark' : 'Bookmark',
                archiveText = obj.archive ? 'Un-archive' : 'Archive';
                classList = 'notification';

            obj.new ? addToClassList('new') : addToClassList('visited');

            function addToClassList (str) {
                classList += ' '+str;
            }

            return `
            <div class="${classList}" data-rel="${obj._id}">
                <div class="title">
                    <a href="${obj.url}" target="_blank">${obj.title}</a>
                </div>
                <div class="subreddit">
                    <a href="//www.reddit.com/r/${obj.subreddit}" target="_blank">/${obj.subreddit}</a>
                </div>
                <div class="date">${new Date(obj.dateFound).toLocaleDateString()}</div>
                <div class="favorite">
                    <button type="button" data-action="bookmark">
                        <i class="fa ${bookmarkClass} aria-hidden="true"></i>
                    </button>
                </div>
                <div class="details">
                    <button type="button" class="btn btn-default" data-action="details">Details</button>
                </div>
                <div class="notification-details well">
                    <div class="full-details">
                        <ul>
                            <li>
                                <label>Title:</label>
                                <span>${obj.title}</span>
                            </li>
                            <li>
                                <label>URL:</label>
                                <span><input type="text" readonly value="${obj.url}"></span>
                            </li>
                            <li>
                                <label>Author:</label>
                                <span>
                                    <a href="https://www.reddit.com/user/${obj.author}/submitted" target="_blank">${obj.author}</a>
                                </span>
                            </li>
                            <li>
                                <label>Matched Terms:</label>
                                <span>${obj.matchedOn}</span>
                            </li>
                        </ul>
                    </div>
                    <div class="action-buttons">
                        <ul>
                            <li>
                                <button type="button" class="btn btn-success" data-action="bookmark">${bookmarkText}</button>
                            </li>
                            <li>
                                <button type="button" class="btn btn-info" data-action="copy-link">Copy Link</button>
                            </li>
                            <li>
                                <button type="button" class="btn btn-warning" data-action="archive">${archiveText}</button>
                            </li>
                            <li>
                                <button type="button" class="btn btn-danger" data-action="delete">Delete</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>`;
        }

        function updateNotificationAttribute(id, key, value){
            var notification = RA.notifications.master.find((obj) => obj._id === id);
            notification[key] = value;
            $.ajax({
                method: 'PUT',
                url: '/updateNotification',
                contentType: 'application/json',
                data: JSON.stringify(notification),
                error: function(error){ console.log(error); },
                success: function(data){ console.log(data); }
            });
        }

        RA.getNotifications = function(){
            $.ajax({
                method: 'GET',
                url: '/getNotifications',
                success: (data) => {
                    data = data.sort((a, b) => a.subreddit.localeCompare(b.subreddit));
                    RA.notifications = {
                        master: data,   // this will never change again
                        filtered: data  // this will be re-written every time the filters update
                    };
                    if (data.length > 0) {
                        renderFilters(data);
                        renderNotifications(data);
                    } else {
                        firstTimeUser();
                    }
                }
            });
        };

    }());

});
