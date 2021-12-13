'use strict'

const API_URL = 'https://raw.githubusercontent.com/GeekBrainsTutorial/online-store-api/master/responses/'

function send(url, method = 'GET', data = '', headers = [], timeout = 60000) {
    return new Promise((res, rej) => {
        let xhr;

        if (window.XMLHttpRequest) {
            // Chrome, Mozilla, Opera, Safari
            xhr = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            // Internet Explorer
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
        }

        for([key, value] of Object.entries(headers)) {
            xhr.setRequestHeader(key, value)
        }

        xhr.timeout = timeout;

        xhr.ontimeout = rej;

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status < 400) {
                    res((xhr.responseText))
                } else {
                    rej(xhr.status)
                }
            }
        }

        xhr.open(method, url, true);

        xhr.send(data);
    }) 
}