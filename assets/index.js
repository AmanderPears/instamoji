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


function render(jsonData, parentID) {
    let parent = document.querySelector(parentID);
    jsonData?.data?.emotes?.items?.forEach(i => {
        let url = `https://cdn.7tv.app/emote/${i.id}/4x.webp`;

        let img = document.createElement('img');
        img.src = url;
        img.alt = i.name;
        img.title = i.name;
        img.addEventListener('click', e => {
            window?.pywebview?.api.testFunc1(url);
        });

        parent.append(img);
    });
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
        search(event?.target?.value);
    });
});


function search(str) {
    return fetch("https://7tv.io/v3/gql", {
        "headers": {
            "content-type": "application/json",
        },
        "referrer": "https://7tv.app/",
        "body": "{\"operationName\":\"SearchEmotes\",\"variables\":{\"query\":\"" + str + "\",\"limit\":25,\"page\":1,\"sort\":{\"value\":\"popularity\",\"order\":\"DESCENDING\"},\"filter\":{\"category\":\"TOP\",\"exact_match\":false,\"case_sensitive\":false,\"ignore_tags\":false,\"zero_width\":false,\"animated\":false,\"aspect_ratio\":\"\"}},\"query\":\"query SearchEmotes($query: String!, $page: Int, $sort: Sort, $limit: Int, $filter: EmoteSearchFilter) {\\n  emotes(query: $query, page: $page, sort: $sort, limit: $limit, filter: $filter) {\\n    count\\n    items {\\n      id\\n      name\\n      state\\n      trending\\n      owner {\\n        id\\n        username\\n        display_name\\n        style {\\n          color\\n          paint_id\\n          __typename\\n        }\\n        __typename\\n      }\\n      flags\\n      host {\\n        url\\n        files {\\n          name\\n          format\\n          width\\n          height\\n          __typename\\n        }\\n        __typename\\n      }\\n      __typename\\n    }\\n    __typename\\n  }\\n}\"}",
        "method": "POST"
    })
    .then(response => response.json())
    .then(json => render(json, '#modalMain'));
}


//nav search
waitForElm("#navSearch").then(input => {
    input.addEventListener('focus', () => {
        input.blur();
    });
});