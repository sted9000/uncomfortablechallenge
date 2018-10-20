// *** Variables ***
var blocks_per_search = 50000; // search area
var done_search_switch = false; // flips when startblock has been reached
var start_block = 6527759; // block of factory deployment
var end_block = null; // block to search until
var logs_to_display = 5; // defauls of displayed logs
var logs_displayed = 0; // count of logs displayed
var logs_array_all = []; // all logs
var queue = null; // logs gathered but not displayed

// *** Main Functions ***
// Post a Challenge Function
// - Takes users inputs, checks them, and sends web3 transaction
function postChallenge() {

    // format user inputs
    var category = $("#user-category")[0].value; // category
    var description = $('#user-description')[0].value; // description
    var result = $('#user-location')[0].value; // result

    // check to make sure user has input
    if (category == "" || description == "" || result == "") {
        alert("Your you must input a value for each field");
        return;
    }

    // check the result string format
    if (result.startsWith('www.') == false) {
        alert("Your result's location must start with www.");
        return;
    }

    // web3 transaction
    factoryInstance.newChallenge.sendTransaction(
        category, description, result.slice(4), function(err, txHash){
        if(!err) {

            // give user the transaction hash
            alert('Your challenge has been submitted to the blockchain' + '\n' +
            'Your transaction hash is: ' +
            txHash);

            // clear user inputs
            $("#user-category")[0].value = ""; // clear category
            $('#user-description')[0].value = ""; // clear description
            $('#user-location')[0].value = ""; // clear result
            console.log(txHash);

        } else {
            console.log(err);
        }
    }); // End web3 transaction
} // End postChallenge()


// Search Functions
// - Searches range of blocks for events by factory
// - Pushes the evenst to logs_array_all
// - Calls displayLogs()
function getEvents() {

    // Set events object
    var event_logs = factoryInstance.allEvents(
        {fromBlock: end_block - blocks_per_search, toBlock: end_block});

    // Get events (callback)
    event_logs.get(function(err, event_logs_result) {

        if (!err) {

            // push logs to global array
            for (var i=0; i<event_logs_result.length; i++) {
                logs_array_all.push(event_logs_result[i]);
            }

            // update block variables
            end_block = end_block - blocks_per_search; // decresing search area
            if (end_block < start_block) {done_search_switch = true;} // flip switch

            // log results
            console.log('Blocks ' + (end_block - blocks_per_search) + ' - '
            + end_block + ' success (' + event_logs_result.length + ')' +
            ' switch is ' + done_search_switch);

            // call displayLogs()
            displayLogs();

        } else {
            console.log('error in event_logs at end_block: ' + end_block);
        }
    });
}


// Display events
// - appends html divs to page with 'logs_to_be_displayed'
// - ltbd are either new logs founds or increases to 'show more' by user
function displayLogs() {

    var logs_displayed_temp = logs_displayed;
    // Note sure if I need above (are variables loaded once before function
    // or each time loop is iterated?)

    // Loop through new data to be displayed
    for (var i=0; i<(logs_array_all.length - logs_displayed_temp); i++) { // loop through data_array

        $('#log-container').show(); // show the log container

        if (logs_displayed < logs_to_display) { // only show so many logs

            var j = (i + logs_displayed_temp); // only add new logs, not duplicates

            // Simple variables
            var description = logs_array_all[j].args._description;
            var poster = logs_array_all[j].args._poster;
            var result = logs_array_all[j].args._result;
            var transHash = logs_array_all[j].transactionHash;

            // More complex variables (category)
            var category_text = '';
            switch (logs_array_all[j].args._category.toNumber()) { // mapping number to text
                case 0:
                    category_text = 'Social';
                    break;
                case 1:
                    category_text = 'Health';
                    break;
                case 2:
                    category_text = 'Learning';
                    break;
                case 3:
                    category_text = 'Other';
                    break;
                default:
                    category_text = 'Other';
                    break;}

            // Creating and appending html objects

            $('<div/>', { // create unique container div
                id: transHash,
                class: 'single-log-container'
            }).appendTo('#log-container');


            $('<span/>', { // desscription span
                class: 'title-span',
            }).appendTo('#' + transHash);

            $('#' + transHash + ' ' + '.title-span').append( // a tag pointing to users site
                '<a href=' + "http://" + result + ' ' + 'target="_blank">' + description + '</a>');

            $('#' + transHash + ' ' + '.title-span').append( // tooltip
                '<div class="tooltiptext">Click to go to posters page to see challenge details and results</div>'); // Tool tip


            $('<span/>', { // date span
                id: 'date-span',
                class: 'icon'
            }).appendTo('#' + transHash);

            $('#' + transHash + ' ' + '#date-span').append( // a link to fire alert message with date
                '<a id=' + logs_array_all[j].blockHash + ' onclick="alertDate(this)"></a>');

            $('#' + transHash + ' ' + '#date-span a').append( // image
                '<img id="result_image" src="/uncomfortablechallenge/images/calendar.png" />');

            $('#' + transHash + ' ' + '#date-span').append( // tooltip
                '<div class="tooltiptext">Click to see date posted</div>');


            $('<span/>', { // poster span
                id: 'poster-span',
                class: 'icon'
            }).appendTo('#' + transHash)

            $('#' + transHash + ' ' + '#poster-span').append( // a tag link to posters address on ethscan
                '<a href=' + "http://www.etherscan.io/address/" + poster + ' target="_blank"></a>');

            $('#' + transHash + ' ' + '#poster-span a').append( // image
                '<img id="poster_image" src="/uncomfortablechallenge/images/poster.png" />');

            $('#' + transHash + ' ' + '#poster-span').append( // tooltip
                '<div class="tooltiptext">Poster: ' + poster + '\n' + 'Click to see account details' + '</div>');


            $('<span/>', { // category span
                id: 'category-span',
                class: 'icon'
            }).appendTo('#' + transHash)

            $('#' + transHash + ' ' + '#category-span').append( // image
                '<img id="category_image" src="/uncomfortablechallenge/images/file.png"" />');

            $('#' + transHash + ' ' + '#category-span').append( // tooltip
                '<div class="tooltiptext">' + 'Category: ' + category_text + '</div>');

            // Increment logs_displayed
            logs_displayed +=1;

        } // end if (logs_displayed < logs_to_display)

        else {

            // Flip queue switch
            queue = true;
        }
    } // end for loop of logs for current query
    determineStatus()
} // end displayLogs()

// Function to show messages and determine next step
function determineStatus() {

    if (done_search_switch) { // search done

        if (logs_displayed <= logs_to_display) { // more to be displayed

            $('#searching-blockchain').hide(); // hide searching message

            if (queue) { // there is queue of logs to be displayed

                $("#loadmore-button").show(); // loadmore.show()

            } else { // no queue

                $("#no-more-results-category").show(); // all loaded message.show()

            }
        }

    } else { // search not done

        if (logs_displayed == logs_to_display) { // display amount full

            $('#searching-blockchain').hide(); // hide searching message

            $("#loadmore-button").show(); // loadmore.show()

        } else { // display amount not full

            getEvents(); // continue loop
        }
    }
}


// User requests to load more logs
function loadmoreButton() {
        logs_to_display += 5; // increment logs_to_display
        queue = false; // clear queue
        displayLogs(); // run displayLogs()
        $("#loadmore-button").hide(); // loadmore.hide()
}

// User requests date of log
function alertDate(_this) {

    // Call chain
    web3.eth.getBlock(_this.id, function(err, result) { // with block hash (the id of a tag)

        if (!err) {

            date_posted = new Date(result.timestamp * 1000); // Date object in milliseconds

            alert(date_posted); // alert user

        } else {

            console.log(err);
        }
    });
}
