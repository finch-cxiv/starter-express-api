const fetch = require("node-fetch");
var express = require('express');
var app = express();
app.use(express.text())
app.use(express.urlencoded({ extended: true }))
const port = 443

var VARIABLES = {
    CLIENT_ID: "f010187a-625c-474a-b9c5-461445989809",
    CLIENT_SECRET: "finch-secret-sandbox-OSydjzrk29pgQp-pkPevkGPP8vnbtPLNLO-5EBOq",
    URL_FINCH: "https://api.tryfinch.com",
    FINCH_API_VERSION: "2020-09-17",
    PRODUCTS: "company directory individual employment payment pay_statement",
    REDIRECT_URI: "https://cxiv.io/finch_tech_assessment_user_login.html",
    AUTHORIZATION: "Bearer a27549f6-5630-45a3-b80d-697b45533a03",
    DIRECTORY: "empty",
};

var URL_REQUEST = "";
var HEADERS = { nothing: "nothing" };
var DATA_R = { nothing: "nothing" };

var server = app.listen(port, () => {
    console.log(`cxiv_fba listening on port ${port}`)
})

app.get('/hello', (req, res) => {
    console.log("/hello ran")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.send("cxiv_fba is up and running")
    res.end();
})

app.post('/goodbye', (req, res) => {
    console.log("/goodbye ran")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send("end session");
    server.close();
})

app.post('/begin_auth', (req, res) => {
    console.log("/begin_auth ran")
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.json({
        redirect:
            'https://connect.tryfinch.com/authorize?&client_id=' +
            VARIABLES.CLIENT_ID +
            '&products=' + VARIABLES.PRODUCTS +
            '&redirect_uri=' +
            VARIABLES.REDIRECT_URI + '&sandbox=true'

    })
    res.end();
})

app.post('/accept_code', (req, res) => {
    console.log("accept_code_ran")
    var code = req.body
    console.log(code)

    var data = {
        client_id: VARIABLES.CLIENT_ID,
        client_secret: VARIABLES.CLIENT_SECRET,
        code: code,
        redirect_uri: VARIABLES.REDIRECT_URI
    }

    api_finch('/auth/token', 'POST', data)
        .then((response) => {
            console.log(response)
            var token = "Bearer " + response.access_token
            VARIABLES.AUTHORIZATION = token
            console.log("WITHIN THEN POST ACCEPT CODE")
            console.log(VARIABLES.AUTHORIZATION)
        })

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/json');
    res.json({ this_is_just_what_was_sent: { requestBody: req.body } })
    res.end();
})

app.get('/company', (req, res) => {
    console.log("/company ran")
    api_finch('/employer/company', 'GET', 'null')
        .then((response) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Content-Type', 'application/json');
            res.json(response)
            res.end();
        })

})

app.get('/directory', (req, res) => {
    console.log("/directory ran")

    api_finch('/employer/directory', 'GET', 'null')
        .then((response) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Content-Type', 'application/json');
            res.json(response)
            res.end();
        })

})

app.post('/employer_individual', (req, res) => {
    console.log("/employer_individual ran")

    individual_id = req.body
    console.log(individual_id)

    var data = {
        requests: [
            { individual_id: individual_id }
        ]
    }

    api_finch('/employer/individual', 'POST', data)
        .then((response) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Content-Type', 'application/json');
            res.json(response)
            res.end();
        })

})

app.post('/employer_employment', (req, res) => {
    console.log("employer_employment ran")

    individual_id = req.body
    console.log(individual_id)

    var data = {
        requests: [
            { individual_id: individual_id }
        ]
    }

    api_finch('/employer/employment', 'POST', data)
        .then((response) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Headers', '*');
            res.setHeader('Content-Type', 'application/json');
            res.json(response)
            res.end();
        })

})

async function api_finch(resource, method, data) {

    URL_REQUEST = VARIABLES.URL_FINCH + resource

    if (resource === '/auth/token') {
        HEADERS = {
            'Content-Type': 'application/json'
        }
    }
    else {
        HEADERS = {
            Authorization: VARIABLES.AUTHORIZATION,
            'Finch-API-Version': VARIABLES.FINCH_API_VERSION,
            'Content-Type': 'application/json'
        }
    }

    if (method === 'GET') {
        var BODY_R = null
    }
    else {
        var BODY_R = JSON.stringify(data)
    }

    var data_resolve = await fetch(URL_REQUEST, { method: method, headers: HEADERS, body: BODY_R })
        .then(data => data.json())
        .then(data => {
            DATA_R = data
            return (DATA_R)
        })
        .catch((error) => {
            console.error(error)
        })
    return data_resolve
}