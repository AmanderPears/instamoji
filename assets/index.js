let previous = 0;

function waitForElm(selector) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}


// //function only executes once
// (function(callback) {
//     let once = false;
//     return function() {
//         if (!once) {
//             executed = true;
//             callback();
//         }
//     }
// })();

function render(jsonData, parentID) {
    let parent = document.querySelector(parentID);
    let recent = document.querySelector('#recent');

    jsonData?.data?.emotes?.items?.forEach(i => {
        let url = `https://cdn.7tv.app/emote/${i.id}/4x.webp`;

        let img = document.createElement('img');
        img.src = url;
        img.alt = i.name;
        img.title = i.name;
        img.dataset.id = i.id;
        img.dataset.jsonData = JSON.stringify(i);
        // i`mg.addEventListener('click', e => {
        //     window?.pywebview?.api.testFunc1(url);

        //     //add to recent tab on click
        //     //if the element is already in the tab, prepend it
        //     addToTab(recent, img);
        // });`

        parent.append(img);
    });
}

function addToTab(parent, img) {
    let existingEle = parent.querySelector(`[data-id="${img.dataset.id}"]`);
    if (existingEle === null) {
        let clone = img.cloneNode(true);
        clone.addEventListener('click', e => {
            window?.pywebview?.api.testFunc1(url);
            // addToTab(document.querySelector('#recent'), clone);
        });
        parent.prepend(clone);
    } else {
        parent.prepend(existingEle);
    }

    save();
}


function fetchMore() {
    fetch("https://7tv.io/v3/gql", {
        "headers": {
            "content-type": "application/json",
        },
        "referrer": "https://7tv.app/",
        "body": "{\"operationName\":\"SearchEmotes\",\"variables\":{\"query\":\"\",\"limit\":50,\"page\":" + ++previous + ",\"sort\":{\"value\":\"popularity\",\"order\":\"DESCENDING\"},\"filter\":{\"category\":\"TOP\",\"exact_match\":false,\"case_sensitive\":false,\"ignore_tags\":false,\"zero_width\":false,\"animated\":false,\"aspect_ratio\":\"\"}},\"query\":\"query SearchEmotes($query: String!, $page: Int, $sort: Sort, $limit: Int, $filter: EmoteSearchFilter) {\\n  emotes(query: $query, page: $page, sort: $sort, limit: $limit, filter: $filter) {\\n    count\\n    items {\\n      id\\n      name\\n      state\\n      trending\\n      owner {\\n        id\\n        username\\n        display_name\\n        style {\\n          color\\n          paint_id\\n          __typename\\n        }\\n        __typename\\n      }\\n      flags\\n      host {\\n        url\\n        files {\\n          name\\n          format\\n          width\\n          height\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\"}",
        "method": "POST"
    })
        .then(response => response.json())
        .then(json => render(json, '#main'));

}


// fetch("https://7tv.io/v3/gql", {
//     "headers": {
//         "content-type": "application/json",
//     },
//     "referrer": "https://7tv.app/",
//     "body": "{\"operationName\":\"SearchEmotes\",\"variables\":{\"query\":\"\",\"limit\":9,\"page\":1,\"sort\":{\"value\":\"popularity\",\"order\":\"DESCENDING\"},\"filter\":{\"category\":\"TOP\",\"exact_match\":false,\"case_sensitive\":false,\"ignore_tags\":false,\"zero_width\":false,\"animated\":false,\"aspect_ratio\":\"\"}},\"query\":\"query SearchEmotes($query: String!, $page: Int, $sort: Sort, $limit: Int, $filter: EmoteSearchFilter) {\\n  emotes(query: $query, page: $page, sort: $sort, limit: $limit, filter: $filter) {\\n    count\\n    items {\\n      id\\n      name\\n      state\\n      trending\\n      owner {\\n        id\\n        username\\n        display_name\\n        style {\\n          color\\n          paint_id\\n          __typename\\n        }\\n        __typename\\n      }\\n      flags\\n      host {\\n        url\\n        files {\\n          name\\n          format\\n          width\\n          height\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\"}",
//     "method": "POST"
// })
//     .then(response => response.json())
//     .then(json => render(json));


fetchMore();

//fetch more on scroll end
window.onscroll = function (ev) {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        fetchMore();
    }
};

//focus on search input
waitForElm('#exampleModal').then(modalElem => {
    modalElem.addEventListener('shown.bs.modal', event => {
        document.querySelector('#modalSearch').focus();
    });
});

//setup search
waitForElm('#modalSearch').then(input => {
    input.addEventListener('change', event => {
        document.querySelector("#modalMain").innerHTML = "";
        document.querySelector("#modalMain").dataset.value = event?.target?.value;
        document.querySelector("#modalMain").dataset.page = 1;
        search(event?.target?.value);
    });
});


function search(str, page = 1) {
    return fetch("https://7tv.io/v3/gql", {
        "headers": {
            "content-type": "application/json",
        },
        "referrer": "https://7tv.app/",
        "body": "{\"operationName\":\"SearchEmotes\",\"variables\":{\"query\":\"" + str + "\",\"limit\":25,\"page\":" + page + ",\"sort\":{\"value\":\"popularity\",\"order\":\"DESCENDING\"},\"filter\":{\"category\":\"TOP\",\"exact_match\":false,\"case_sensitive\":false,\"ignore_tags\":false,\"zero_width\":false,\"animated\":false,\"aspect_ratio\":\"\"}},\"query\":\"query SearchEmotes($query: String!, $page: Int, $sort: Sort, $limit: Int, $filter: EmoteSearchFilter) {\\n  emotes(query: $query, page: $page, sort: $sort, limit: $limit, filter: $filter) {\\n    count\\n    items {\\n      id\\n      name\\n      state\\n      trending\\n      owner {\\n        id\\n        username\\n        display_name\\n        style {\\n          color\\n          paint_id\\n          __typename\\n        }\\n        __typename\\n      }\\n      flags\\n      host {\\n        url\\n        files {\\n          name\\n          format\\n          width\\n          height\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\"}",
        "method": "POST"
    })
        .then(response => response.json())
        .then(json => render(json, '#modalMain'));
}


//nav search
// waitForElm("#navSearch").then(input => {
//     input.addEventListener('focus', () => {
//         input.blur();
//     });
// });



waitForElm("#modalMain").then(element => {
    element.onscroll = function (ev) {
        if ((element.offsetHeight + element.scrollTop) >= element.scrollHeight) {
            search(element.dataset.value, ++element.dataset.page);
        }
    };
});


//tabs
waitForElm('#tabs').then(tabs => {
    tabs.addEventListener('click', e => {

        let previous = document.querySelector('.nav-link.active');
        previous.classList.toggle('active');
        document.querySelector(`#${previous.dataset.tab}`).classList.toggle('tab-hide');

        e.target.classList.toggle('active');
        document.querySelector(`#${e.target.dataset.tab}`).classList.toggle('tab-hide');

    });
});

//context menu
waitForElm('#cmenu').then(cmenu => {

    window.addEventListener('contextmenu', e => {
        if (e.target?.dataset?.id && e.target?.parentElement?.id !== 'fav') {
            cmenu.firstElementChild.textContent = e.target.title;
            cmenu.style.top = `${e.clientY}px`;
            cmenu.style.left = `${e.clientX}px`;
            cmenu.classList.remove('tab-hide');

            cmenu.querySelector('#cmenuFav').onclick = () => {
                addToTab(document.querySelector('#fav'), e.target);
            };

            cmenu.focus();
            e.preventDefault();
        }
    });

    window.addEventListener('click', e => {
        if (e.target.id != 'cmenu') {
            cmenu.classList.add('tab-hide');
        }

        if (e.target?.dataset?.id) {
            // console.log(e.target);
            window?.pywebview?.api.testFunc1(e.target.src);

            //add to recent tab on click
            //if the element is already in the tab, prepend it
            addToTab(document.querySelector('#recent'), e.target);

        }
    });
});

waitForElm('#recent').then(recentElement => {
    load();
});


function save() {
    let recent = [...document.querySelectorAll('#recent img')].map(e => JSON.parse(e.dataset.jsonData));

    let fav = [...document.querySelectorAll('#fav img')].map(e => JSON.parse(e.dataset.jsonData));

    let recentJson = JSON.stringify(recent);
    let favJson = JSON.stringify(fav);

    localStorage.setItem('recent', recentJson);
    localStorage.setItem('fav', favJson);
    window?.pywebview?.api.saveJson('recent', recentJson);
    window?.pywebview?.api.saveJson('fav', favJson);
}

function load() {
    let recentData = localStorage.getItem('recent');
    console.log(recentData);
    if (recentData != null) {
        let recentElement = document.querySelector('#recent');
        let recent = JSON.parse(recentData);
        recent.forEach(i => {

            let url = `https://cdn.7tv.app/emote/${i.id}/4x.webp`;
            let img = document.createElement('img');
            img.src = url;
            img.alt = i.name;
            img.title = i.name;
            img.dataset.id = i.id;
            img.dataset.jsonData = JSON.stringify(i);
            recentElement.append(img);
        });
    }

    let favData = localStorage.getItem('fav');
    if (favData != null) {
        let favElement = document.querySelector('#fav');
        let fav = JSON.parse(favData);
        fav.forEach(i => {

            let url = `https://cdn.7tv.app/emote/${i.id}/4x.webp`;
            let img = document.createElement('img');
            img.src = url;
            img.alt = i.name;
            img.title = i.name;
            img.dataset.id = i.id;
            img.dataset.jsonData = JSON.stringify(i);
            favElement.append(img);
        });
    }
}