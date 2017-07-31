let c = 0;
let currData;
let query;

function loader() {
    $('.load-cont').toggle()
    console.log(currData)
}

function getData(rName, callback) {
    const KEYS = 'AIzaSyCHh0cUgNcD30vycvQb82PfFoQl0Mt1j0A';
    const URL = `https://www.googleapis.com/youtube/v3/search`
    const info = {
        part: 'snippet',
        q: 'How to make' + rName.hits[c].recipe.label,
        type: 'video',
        maxResults: 2,
        order: 'viewCount',
        key: KEYS
    }
    $.getJSON(URL, info, callback);
}

function scroll(element) {
    $('html, body').animate({
        scrollTop: $(element).offset().top - 20
    }, 'slow');
};

function clean() {
    $('.error').hide();
    $('js-results').empty();
    $('#textbox').val('');
    $("option:selected").prop("selected", false)
}

function doCORSRequest(sUrl) {
    loader();
    $.ajax({
        type: "get",
        url: 'https://api.edamam.com/search' + '?' + sUrl,
        crossDomain: true,
        dataType: "jsonp",
        data: {
            app_id: '5ca2edcc',
            app_key: '17e47fbaab3b7e491d90177453c03b7b'
        },
        success: function(data) {
            currData = data
            $('.load-cont').hide()
            fillData(currData);
        },
        error: (function(e) {
            $('.error').show();
            $('.youtube-data').hide();
            $('.js-results').hide();
            $('.load-cont').hide();
        })
    });
}

function youtubeData(results) {
    scroll('.js-results')
    $('.youtube-data').empty();
    $('.youtube-data').show();
    $('.youtube-data').append(`
        <h2>Youtube Cooking Videos</h2>
        <p>Click the image to play.</p>
        `)
    if (results.items.length === 0) {
        $('.youtube-data').hide();
        return false;
    }
    for (let i = 0; i < results.items.length; i++) {

        $('.youtube-data').append(`
        <div class="col-6 clearfix">
           <a href='https://www.youtube.com/watch?v=${results.items[i].id.videoId}' target="_blank"><img src='${results.items[i].snippet.thumbnails.medium.url}' /></a> 
        </div>
    `)
    }

}

function fillData(data) {
    if (!data || data.hits.length == 0) {
        $('.error').show();
        $('.youtube-data').hide();
        $('.js-results').hide();
        $('.load-cont').hide();
        return false;
    }
    $('.load-cont').hide()
    $('.js-results').empty();
    $('.js-results').show()
    $('.js-results').append(`
        <div class="recipe-cont row">
            <div class="col-12">
                <div class="col-6 reci-name">
                    <h2>${data.hits[c].recipe.label}</h2>
                </div>
                <div class="col-6 cal-count">
                    <h3>${Math.floor(data.hits[c].recipe.calories / data.hits[c].recipe.yield)} calories per serving</h3>
                </div>
            </div> 
        <div class="col-6 img-cont"><img src="${data.hits[c].recipe.image}" alt="Picture of ${data.hits[c].recipe.label}" /></div>
        <div class="col-6">
   
            <div class="col-12">
                <div class="ingre-title col-12">
                    <h2 class="under">Ingredients</h2>
                </div>
                <div class="ingredients col-12">

                </div>
            </div>    
            <div class="col-12 btn-cont">
                <div class="col-6">
                    <a target="_blank" href="${data.hits[c].recipe.url}"><button class="recipe-owner">Full Recipe</button></a>
                </div>
                <div class="col-6">
                    <button class="next-reci">Next Recipe</button>
                </div>    
            </div>    
        </div>
    </div>
    `)
    let d = 0;
    for (let i = 0; i < (data.hits[c].recipe.ingredientLines.length / 3); i++) {
        $('.ingredients').append(`
            <div class="ingr-row ingr-row${i} clearfix"></div>
        `)
        for (let j = 0; j < 3; j++) {
            if (!data.hits[c].recipe.ingredientLines[d]) {
                break;
            }
            $(`.ingr-row${i}`).append(`
                <p class="col-4">${data.hits[c].recipe.ingredientLines[d]}</p>
            `)
            d++;
        }
    }
    $('.load-cont').hide();
    getData(currData, youtubeData);
}
(function() {
    $('.js-results').on('click', '.next-reci', event => {
        if (c + 1 == currData.hits.length) {
            $('.youtube-data').hide();
            $('.js-results').hide();
            query.from += 5;
            query.to += 5;
            c = 0;
            doCORSRequest($.param(query))
        } else {
            $('.youtube-data').hide();
            $('.js-results').hide();
            c++
            fillData(currData);
            scroll('.js-results')
        }
    })
})()

function handleSubmit() {
    $('#form').submit(event => {
        event.preventDefault();
        query = {
            from: 0,
            to: 5
        }
        if ($('#textbox').val()) {
            query.q = $('#textbox').val();
        }
        if ($('.diet-value').val()) {
            query.diet = $('.diet-value').val();
        }
        if ($('.stip-value').val()) {
            query.health = $('.stip-value').val();
        }
        $('.error').hide();
        clean();
        doCORSRequest($.param(query))
    })
}



handleSubmit();