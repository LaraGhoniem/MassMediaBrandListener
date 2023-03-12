async function getDashboardData() {
  const response = await fetch("/listener-data");
  const data = await response.json();
  return data.user;
}
var userData = {}
var listenersData = []
getDashboardData().then((data) => {
    userData = data;
    getUserListeners()
})

async function logout(){
    await fetch('/user/signout', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        
        }
        }).then(async (res) => {
            if(res.status === 200){
                window.location.href = "/"
            }
            else{
                console.log(res.status)
            }
        }).catch((err) => {
            console.log(err)
        })
}

async function getUserListeners(){
    await fetch('/company/getCompany/'+userData._id, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        }
        }).then(async (res) => {
            if(res.status === 200){
                await res.json().then(async (company) => {
                    await fetch('/listener/id/'+company.data[0]._id, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            }
                            }).then(async (res) => {
                                if(res.status === 200){
                                    await res.json().then(async (data) => {
                                        if(data.listener.length != 0){
                                            listenersData = data.listener
                                            viewStats(listenersData)
                                        }
                                    })
                                }
                                else{
                                    console.log(res.status)
                                }
                            }).catch((err) => {
                                console.log(err)
                            })
                    })
                    }
                    else{
                        console.log(res.status)
                    }
                
                }).catch((err) => {
                    console.log(err)
                })
}

function navigate(page){
    // 0: Home Page 1: Add Listener Page 2: View Listeners Page 3: View Results Page
    if(page === 0){
            document.getElementById("home").style.display = "block";
            document.getElementById("add-listener").style.display = "none";
            document.getElementById("view-listeners").style.display = "none";
            document.getElementById("web-mentions").style.display = "none";
    }
    else if(page === 1){
            document.getElementById("home").style.display = "none";
            document.getElementById("add-listener").style.display = "block";
            document.getElementById("view-listeners").style.display = "none";
            document.getElementById("web-mentions").style.display = "none";
    }
    else if(page === 2){
            getUserListeners()
            document.getElementById("home").style.display = "none";
            document.getElementById("add-listener").style.display = "none";
            document.getElementById("view-listeners").style.display = "block";
            document.getElementById("web-mentions").style.display = "none";

            // 
            // 
            ctx = document.getElementById('mentionslinechart'),
            new Chart(
                ctx,
                {         
                 type: 'line',
                    data:  
                     {
                        labels: ['January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',],
                        datasets: [{
                            label: 'Mentions over time',
                            order: screenLeft,
                            data: [65, 59, 80, 81, 56, 55, 40],
                            fill: false,
                            borderColor: 'rgb(221,160,221)',
                            tension: 0.1
                        
                        }],
                        
                    },
                    options: {
                            plugins: {

                                legend: {
                                    position: 'bottom',
                                  },
                                }}
                },
                
            );
            // 
            ctx = document.getElementById('topSources'),
            new Chart(
                ctx,
                {         
                    type: 'bar',
                    data:  
                     {
                        labels: ['January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',],
                        datasets: [{
                            label: 'Top sources',
                            data: [65, 59, 80, 81, 56, 55, 40],
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.2)',
                              'rgba(255, 159, 64, 0.2)',
                              'rgba(255, 205, 86, 0.2)',
                              'rgba(75, 192, 192, 0.2)',
                              'rgba(54, 162, 235, 0.2)',
                              'rgba(153, 102, 255, 0.2)',
                              'rgba(201, 203, 207, 0.2)'
                            ],
                            borderColor: [
                              'rgb(255, 99, 132)',
                              'rgb(255, 159, 64)',
                              'rgb(255, 205, 86)',
                              'rgb(75, 192, 192)',
                              'rgb(54, 162, 235)',
                              'rgb(153, 102, 255)',
                              'rgb(201, 203, 207)'
                            ],
                            borderWidth: 1
                          }]
                        
                    },
                    options: {
                        plugins: {

                            legend: {
                                position: 'bottom',
                              },
                            },
                        indexAxis: 'y',
                      }
                },
                
            );
            // 
            // summary
            // 
            ctx = document.getElementById('posMentions'),
            new Chart(
                ctx,
                {         
                 type: 'line',
                    data:  
                     {
                        labels: ['January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',],
                        datasets: [{
                            label: 'Positive mentions over time',
                            order: screenLeft,
                            data: [65, 59, 80, 81, 56, 55, 40],
                            fill: true,
                            borderColor: 'rgb(221,160,221)',
                            tension: 0.5
                        
                        }],
                        
                        
                    },options: {
                            plugins: {

                                legend: {
                                    position: 'bottom',
                                  },
                                }
                        }
                },
                
            );
            // 
            ctx = document.getElementById('topKeywords'),
            new Chart(
                ctx,
                {
                    type: 'bar',
                    data:  
                     {
                        labels: ['January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',],
                        datasets: [{
                            label: 'Top keyword mentions',
                            data: [65, 59, 80, 81, 56, 55, 40],
                            backgroundColor: [
                              'rgba(255, 99, 132, 0.2)',
                              'rgba(255, 159, 64, 0.2)',
                              'rgba(255, 205, 86, 0.2)',
                              'rgba(75, 192, 192, 0.2)',
                              'rgba(54, 162, 235, 0.2)',
                              'rgba(153, 102, 255, 0.2)',
                              'rgba(201, 203, 207, 0.2)'
                            ],
                            borderColor: [
                              'rgb(255, 99, 132)',
                              'rgb(255, 159, 64)',
                              'rgb(255, 205, 86)',
                              'rgb(75, 192, 192)',
                              'rgb(54, 162, 235)',
                              'rgb(153, 102, 255)',
                              'rgb(201, 203, 207)'
                            ],
                            borderWidth: 1
                          }]
                        
                        }
                    ,
                    options: {
                        indexAxis: 'y',
                        plugins: {

                            legend: {
                                position: 'bottom',
                              },
                            }
                      }
                },
                
            );
            // 
            ctx = document.getElementById('sentimentShare'),
            new Chart(
                ctx,
                {         
                 type: 'pie',
                    data:  
                     {
                        labels: [
                            'Positive',
                            'Neutral',
                            'Negative'
                          ],
                          datasets: [{
                            label: 'Sentiment share',
                            data: [300, 50, 100],
                            backgroundColor: [
                              'rgb(255, 99, 132)',
                              'rgb(54, 162, 235)',
                              'rgb(255, 205, 86)'
                            ],
                            hoverOffset: 4
                          }]
                    },
                    options: {
                        plugins: {

                        legend: {
                            position: 'bottom',
                          },
                        }
                    }
                },
                
            );
            // 
            ctx = document.getElementById('sentimentSource'),
            new Chart(
                ctx,
                {         
                    type: 'bar',
                    data: {
                        labels: ['January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',],
                        
                        datasets: [
                        {label: 'Positive',
                        data: [65, 59, 80, 81, 56, 55, 40]},
                        {label: 'Neutral',
                        data: [75, 5, 10, 0, 45, 60, 10]},
                        {label: 'Negative',
                        data: [20, 15, 5, 30, 40, 10, 5]}
                        ]
                    },
                      options: {
                      plugins: {
                        legend: {
                            position: 'bottom',
                          },
                        title: {
                          display: true,
                          text: 'Sentiment by source'
                        },
                      },
                      responsive: true,
                      scales: {
                        x: {
                          stacked: true,
                        },
                        y: {
                          stacked: true
                        }
                      }
                    }
                },
                
            );
            // 
            ctx = document.getElementById('topTopics'),
            new Chart(
                ctx,
                {         
                    type: 'bubble',
                    data: {
                        labels: ['January',
                        'February',
                        'March',
                        'April',
                        'May',
                        'June',],
                        
                    data: [65, 59, 80, 81, 56, 55, 40]},
                    options: {
                      responsive: true,
                      plugins: {
                        legend: {
                          position: 'bottom',
                        },
                        title: {
                          display: true,
                          text: 'Top topics'
                        }
                      }
                    },
                },
                
            );
            // 
            // 
    }
    else if(page === 3){
        getUserListeners()
        document.getElementById("home").style.display = "none";
        document.getElementById("add-listener").style.display = "none";
        document.getElementById("view-listeners").style.display = "none";
        document.getElementById("web-mentions").style.display = "block";
}
}
var keywordCount = 1;
function removeKeyword(keyword){
    var keywords = document.getElementById("listener-keyword-container");
    if(keywords.children.length > 2){
        document.getElementById("keyword"+keyword).remove();
        keywordCount--;
    }
}
function addKeyword(){
    keywordCount++;
    var keywords = document.getElementById("listener-keyword-container");
    let keyword = document.createElement("div");
    keyword.setAttribute("class", "listenerKeywordInput");
    keyword.setAttribute("id", "keyword"+keywordCount);
    keyword.innerHTML = `
    <input type="text" id="keywordInput${keywordCount}" placeholder="Keyword">
    <button onclick="removeKeyword(${keywordCount})">-</button>
    `
    keywords.appendChild(keyword);
}
function copyEvent(id)
{
    var str = document.getElementById(id);
    window.getSelection().selectAllChildren(str);
    document.execCommand("Copy")
}

var listenerData = {}

async function saveListener(){
let keywords = document.getElementById("listener-keyword-container").children;
let keywordArray = [];
error = false
for(let i = 1; i < keywords.length; i++){
    if(keywords[i].children[0].value === ""){
        error = true
        break;
    }
    keywordArray.push(keywords[i].children[0].value);
}
let listenerName = document.getElementById("addlistenerName").value;
if(listenerName === "")
    error = true
let category = document.getElementById("keyword-category").value;
if(category == "0")
    error = true
if(!error){
let response = {
    listener_name: listenerName,
    listener_status: "inactive",
    company_id: userData.company_id,
    category_id: "63fb78b1737cba7b6d865aae"
}
// get company id by user id
await fetch('/company/getCompany/'+userData._id, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        }
        }).then(async (res) => {
            if(res.status === 200){
                console.log("Company found")
                //convert body to json
                await res.json().then(async (data) => {
                    let company_id = data.data[0]._id
                    await fetch('/listener/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "listener_name": listenerName,
                            "listener_status": "inactive",
                            "company_id": company_id,
                            "category_id": "63fb78b1737cba7b6d865aae"
                        })
                    }).then(async (res) => {
                        if(res.status === 200){
                            console.log("Listener added successfully")
                            await res.json().then(async (data) => {
                                console.log(data)
                                let listener_id = data.listener._id
                                
                                for(let i = 0; i < keywordArray.length; i++){
                                    await fetch('/keyword/add', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            "keyword": keywordArray[i],
                                            "listener_id": listener_id
                                        })
                                    }).then(async (res) => {
                                        if(res.status === 200){
                                            console.log("Keyword added successfully")
                                            await res.json().then(async (data) => {
                                                
                                            })
                                        }
                                        else{
                                            console.log(res.status)
                                        }
                                    }).catch((err) => {
                                        console.log(err)
                                    })
                                }
                                await fetch("http://127.0.0.1:85/listener/",{
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        "Access-Control-Allow-Origin":  "http://127.0.0.1:85",
                                                        "Access-Control-Allow-Methods": "POST",
                                                        "Access-Control-Allow-Headers": "Content-Type, Authorization"
                                                    },
                                                    body: JSON.stringify({
                                                        "listener_id": listener_id,
                                                        "name": listenerName,
                                                        "category": "63fb78b1737cba7b6d865aae",
                                                        "keywords": keywordArray,
                                                        "user_id": userData._id
                                                    })
                                                }).then((res) => {
                                                    if(res.status === 200){
                                                        console.log("Listener added to listener service")
                                                        res.json().then((data) => {
                                                            listenerData = data
                                                            console.log(listenerData)
                                                            innerHTML = ``
                                                            numOfPositiveSentiments = 0
                                                            numOfNegativeSentiments = 0
                                                            numOfNeutralSentiments = 0
                                                            numOfSpamTweets = 0
                                                            mentions = ""
                                                            for(let i = 0; i < listenerData.length; i++){
                                                                for(let j = 0; j < Object.keys(listenerData[i]).length; j++){
                                                                    numOfPositiveSentiments += count(listenerData[i][Object.keys(listenerData[i])[j]].news.sentiment, "positive") + count(listenerData[i][Object.keys(listenerData[i])[j]].twitter.sentiment, "positive")
                                                                    numOfNegativeSentiments = count(listenerData[i][Object.keys(listenerData[i])[j]].news.sentiment, "negative") + count(listenerData[i][Object.keys(listenerData[i])[j]].twitter.sentiment, "negative")
                                                                    numOfNeutralSentiments = count(listenerData[i][Object.keys(listenerData[i])[j]].news.sentiment, "neutral") + count(listenerData[i][Object.keys(listenerData[i])[j]].twitter.sentiment, "neutral")
                                                                    numOfSpamTweets = count(listenerData[i][Object.keys(listenerData[i])[j]].twitter.spam, "1")
                                                                    for(let k = 0; k < listenerData[i][Object.keys(listenerData[i])[j]].twitter.text.length; k++){
                                                                        mentions += "<div class='mentionContainer'>" + listenerData[i][Object.keys(listenerData[i])[j]].twitter.text[k] + "</div>"
                                                                    }
                                                                    for(let k = 0; k < listenerData[i][Object.keys(listenerData[i])[j]].news.text.length; k++){
                                                                        mentions += "<div class='mentionContainer'><p>" + listenerData[i][Object.keys(listenerData[i])[j]].news.text[k] + "</p></div>"
                                                                    }
                                                                }
                                                            }
                                                            innerHTML += `
                                                            <div class="listener-container">
                                                                <div>Positive Mentions <br> ${numOfPositiveSentiments}</div>
                                                                <div>Negative Mentions <br> ${numOfNegativeSentiments}</div>
                                                                <div>Neutral Mentions <br> ${numOfNeutralSentiments}</div>
                                                                <div>Spam Tweets <br> ${numOfSpamTweets}</div>
                                                            </div>
                                                            <div class="listener-mentions-container">
                                                            ${mentions}
                                                            </div>
                                                            `
                                                            document.getElementById("listener_data_api").innerHTML = innerHTML
                                                        })
                                                    }
                                                    else{
                                                        console.log(res.status)
                                                    }

                                                })
                            })
                        }
                        else{
                            console.log(res.status)
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
                )
            }
            else{
                console.log(res.status)
            }
        }).catch((err) => {
            console.log(err)
        })
}else{
    alert("Please fill out all fields")
}
}

function count(arr, value){
    let count = 0;
    for(let i = 0; i < arr.length; i++){
        if(arr[i] === value)
            count++;
    }
    return count;
}


function viewStats(listeners){
    let listener_html = document.getElementById("listeners_list_items")
    let listener_html_inner = `<h4>No Listeners Created</h4>`
    if(listeners.length > 0){
        listener_html_inner = ``
        for(let i = 0; i < listeners.length; i++){
            listener_html_inner += `
            <div class="listeners_list_item ${(i==0)?'active':'inactive'}">
                <h3>${listeners[i].listener_name}</h3>
            </div>
            `
        }
    }
    listener_html.innerHTML = listener_html_inner
}