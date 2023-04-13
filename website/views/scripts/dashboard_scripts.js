
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
    await fetch('/listener/id/'+userData._id, {
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
                            viewListener(listenersData[0]._id, listenersData[0].listener_name)
                            viewListenerMentions(listenersData[0]._id, listenersData[0].listener_name)
                        }
                    })
                }
                else{
                    console.log(res.status)
                }
            }).catch((err) => {
                console.log(err)
            })
}

var gradient;
function getGradient(ctx, chartArea) {
    gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(133, 92, 248, 0.4)');
    gradient.addColorStop(1, 'rgba(133, 92, 248, 0)');

  return gradient;
}

var mentionschart
var mentionschartlabels = []
var mentionschartdata = []

var topsourceschart
var topsourcesdata = []

var posmentionschart
var posmentionslabels = []
var posmentionsdata = []

var topkeywordschart
var topkeywordslabels = []
var topkeywordsdata = []

var sentimentsharechart
// var sentimentsharelabels = []
var sentimentsharedata = []

var sentimentsourcechart
var sentimentsourcepos = []
var sentimentsourceneu = []
var sentimentsourceneg = []

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
            ctx = document.getElementById('mentionslinechart');
            mentionschart = new Chart(
                ctx,
                {         
                 type: 'line',
                    data:  
                     {
                        labels: mentionschartlabels,
                        datasets: [{
                            label: 'Mentions over time',
                            order: screenLeft,
                            data: mentionschartdata,
                            fill: true,
                            borderWidth: 2.5,
                            backgroundColor: function(context) {
                                const chart = context.chart;
                                const {ctx, chartArea} = chart;
                        
                                if (!chartArea) {
                                  // This case happens on initial chart load
                                  return null;
                                }
                                return getGradient(ctx, chartArea);
                              },
                            borderColor: 'rgba(133, 92, 248, 0.6)',
                            // tension: 0.1
                            pointStyle: false,
                        
                        }],
                        
                    },
                    options: {
                            plugins: {

                                legend: {
                                    display: false,
                                },
                                }}
                },
                
            );
            // 
            ctx = document.getElementById('topSources'),
            topsourceschart = new Chart(
                ctx,
                {         
                    type: 'bar',
                    data:  
                     {
                        labels: 
                        ['News',
                        'Twitter',
                        'YouTube',
                        'Television',
                        'Radio',
                        'Podcasts'],
                        datasets: [{
                            label: 'Top keyword mentions',
                            data: topsourcesdata,
                            backgroundColor: [
                              'rgb(133,92,248)',
                              'rgba(133, 92, 248, 0.8)',
                              'rgba(133, 92, 248, 0.6)',
                              'rgba(133, 92, 248, 0.5)',
                              'rgba(133, 92, 248, 0.4)',
                              'rgba(101, 101, 102,0.4)',
                            ],
                            borderColor: [
                              'rgb(133,92,248)',
                              'rgba(133, 92, 248, 0.8)',
                              'rgba(133, 92, 248, 0.6)',
                              'rgba(133, 92, 248, 0.5)',
                              'rgba(133, 92, 248, 0.4)',
                              'rgba(101, 101, 102, 0.4)',
                            ],
                            borderWidth: 1
                          }]
                        
                        },
                    options: {
                        plugins: {

                            legend: {
                                display: false,
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
            posmentionschart = new Chart(
                ctx,
                {         
                 type: 'line',
                    data:  
                     {
                        labels: posmentionslabels,
                        datasets: [{
                            label: 'Positive mentions over time',
                            order: screenLeft,
                            data: posmentionsdata,
                            fill: true,
                            backgroundColor: "rgb(206, 234, 226)",
                            borderColor: 'rgb(137,102,232)',
                            tension: 0.5,
                            borderWidth: 1.2
                        }],
                        
                        
                    },options: {
                            plugins: {

                                legend: {
                                    display: false,
                                },
                                },
                                elements: {
                                    point:{
                                        backgroundColor: 'rgb(137,110,240)',
                                    }
                                }
                        }
                },
                
            );
            // 
            ctx = document.getElementById('topKeywords'),
            topkeywordschart = new Chart(
                ctx,
                {
                    type: 'bar',
                    data:  
                     {
                        labels: topkeywordslabels,
                        datasets: [{
                            label: 'Top keyword mentions',
                            data: topkeywordsdata,
                            backgroundColor: [
                                'rgb(133,92,248)',
                              'rgba(133, 92, 248, 0.8)',
                              'rgba(133, 92, 248, 0.6)',
                              'rgba(133, 92, 248, 0.5)',
                              'rgba(101, 101, 102,0.4)',
                            ],
                            borderColor: [
                              'rgb(133,92,248)',
                              'rgba(133, 92, 248, 0.8)',
                              'rgba(133, 92, 248, 0.6)',
                              'rgba(133, 92, 248, 0.5)',
                              'rgba(101, 101, 102, 0.4)',
                            ],
                            borderWidth: 1
                          }]
                        
                        }
                    ,
                    options: {
                        indexAxis: 'y',
                        plugins: {

                            legend: {
                                display: false,
                            },
                            }
                      }
                },
                
            );
            // 
            ctx = document.getElementById('sentimentShare'),
            sentimentsharechart = new Chart(
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
                            label: 'Number of mentions',
                            data: sentimentsharedata,
                            backgroundColor: [
                                'rgb(133,92,248)',
                                'rgba(80,55,149)',
                                'rgb(18,0,29)',
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
            sentimentsource = new Chart(
                ctx,
                {         
                    type: 'bar',
                    data: {
                        labels:
                        ['News',
                        'Twitter',
                        'YouTube',
                        'Television',
                        'Radio',
                        'Podcasts'],
                        datasets: [
                        {label: 'Positive',
                        data: sentimentsourcepos,
                    backgroundColor:'rgba(133, 92, 248, 0.6)'},
                        {label: 'Neutral',
                        data: sentimentsourceneu,
                    backgroundColor:'rgba(133, 92, 248)'},
                        {label: 'Negative',
                        data: sentimentsourceneg,
                    backgroundColor:'rgb(18,0,29)',}
                        ]
                    },
                      options: {
                      plugins: {
                        legend: {
                            // position: 'bottom',
                            display: false,
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
            // ctx = document.getElementById('topTopics'),
            // new Chart(
            //     ctx,
            //     {         
            //         type: 'bubble',
            //         data: {
            //             labels: ['January',
            //             'February',
            //             'March',
            //             'April',
            //             'May',
            //             'June',],
                        
            //         data: [65, 59, 80, 81, 56, 55, 40]},
            //         options: {
            //           responsive: true,
            //           plugins: {
            //             legend: {
            //               position: 'bottom',
            //             },
            //             title: {
            //               display: true,
            //               text: 'Top topics'
            //             }
            //           }
            //         },
            //     },
                
            // );
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

    await fetch('/listener/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "listener_name": listenerName,
            "listener_status": "inactive",
            "user_id": userData._id,
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
                            alert("Listener added successfully")
                        }
                        else{
                            console.log(res.status)
                        }
                    }).catch((err) => {
                        console.log(err)
                    })
                }
                
            })
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
    let listener_html_2 = document.getElementById("listeners_list_items_2")
    let listener_html_inner = `<h4>No Listeners Created</h4>`
    let listener_html_inner_2 = `<h4>No Listeners Created</h4>`
    if(listeners.length > 0){
        listener_html_inner = ``
        listener_html_inner_2 = ``
        for(let i = 0; i < listeners.length; i++){
            listener_html_inner += `
            <div id="${listeners[i]._id}" class="listeners_list_item ${(i==0)?'active':'inactive'}" onclick="viewListener('${listeners[i]._id}', '${listeners[i].listener_name}')">
                <h3>${listeners[i].listener_name}</h3>
            </div>
            `
            listener_html_inner_2 += `
            <div id="${listeners[i]._id}_2" class="listeners_list_item ${(i==0)?'active':'inactive'}" onclick="viewListenerMentions('${listeners[i]._id}', '${listeners[i].listener_name}')">
                <h3>${listeners[i].listener_name}</h3>
            </div>
            `
        }
    }
    listener_html.innerHTML = listener_html_inner
    listener_html_2.innerHTML = listener_html_inner_2
}

async function viewListener(listenerid, listenername){
    let listenernamecontainer = document.getElementById("listener_name")
    listenernamecontainer.innerHTML = listenername
    let listener_html = document.getElementById("listeners_list_items")
    Array.from(listener_html.children).forEach((node) => {
        if(node.id === listenerid){
            if(node.classList.contains("inactive")){
            node.classList.remove("inactive")
            node.classList.add("active")}
        }
        else{
            if(node.classList.contains("active")){
            node.classList.remove("active")
            node.classList.add("inactive")}
        }
    })
    await fetch('/listener/result/'+listenerid,{  
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            }}).then(async (res) => {
                if(res.status==200){
                    await res.json().then((data) => {
                        var listener_results = []
                        var mentions = 0
                        for(let i = 0; i < data["result"].length; i++){
                            var jsonvar = JSON.parse(data["result"][i]["result"])
                            jsonvar["created_at"] = data["result"][i]["created_at"]
                            listener_results.push(jsonvar)

                    }

                    var twitter_pos = 0
                    var twitter_neg = 0
                    var twitter_neu = 0
                    var news_pos = 0
                    var news_neg = 0 
                    var news_neu = 0

                    mentionschartdata = []
                    mentionschartlabels = []

                    topkeywordsdata = []
                    topkeywordslabels = []
                    topsourcesdata = [0,0,0,0,0,0]

                    posmentionsdata = []
                    posmentionslabels = []
                    keywordmentions = []

                    sentimentsourcepos = [0,0,0,0,0,0]
                    sentimentsourceneu = [0,0,0,0,0,0]
                    sentimentsourceneg = [0,0,0,0,0,0]

                    sentimentsharedata = [0,0,0]
                    for(let i = 0; i < listener_results.length; i++){
                        mentions = 0
                        for(let j = 0; j < listener_results[i].length; j++){
                            let keyword = Object.keys(listener_results[i][j])[0]
                            let twitter_text = listener_results[i][j][keyword]["twitter"]["text"]["preprocessed_text"]
                            let news_text = listener_results[i][j][keyword]["news"]["text"]
                            
                            let twitter_sen = listener_results[i][j][keyword]["twitter"]["sentiment"]
                            let news_sen = listener_results[i][j][keyword]["news"]["sentiment"]
                            twitter_pos = count(twitter_sen, 'positive')
                            twitter_neg = count(twitter_sen, 'negative')
                            twitter_neu = count(twitter_sen, 'neutral')
                            news_pos = count(news_sen, 'positive')
                            news_neg = count(news_sen, 'negative')
                            news_neu = count(news_sen, 'neutral')

                            if(keywordmentions[keyword] == undefined)
                                keywordmentions[keyword] = (twitter_text.length + news_text.length)
                            else
                                keywordmentions[keyword] += (twitter_text.length + news_text.length)

                            if(sentimentsharedata[0] == 0 && sentimentsharedata[1] == 0 && sentimentsharedata[2] == 0){
                                sentimentsharedata[0]=(twitter_pos+news_pos)
                                sentimentsharedata[1]=(twitter_neu+news_neu)
                                sentimentsharedata[2]=(twitter_neg+news_neg)}
                            else{
                                sentimentsharedata[0]+=(twitter_pos+news_pos)
                                sentimentsharedata[1]+=(twitter_neu+news_neu)
                                sentimentsharedata[2]+=(twitter_neg+news_neg)}


                            sentimentsourcepos[0] += news_pos
                            sentimentsourcepos[1] += twitter_pos
                            sentimentsourceneu[0] += news_neu
                            sentimentsourceneu[1] += twitter_neu
                            sentimentsourceneg[0] += news_neg
                            sentimentsourceneg[1] += twitter_neg

                            // console.log(twitter_pos)
                            // let yt_text = listener_results[i][j][keyword]["youtube"]["text"]
                            // let podcast_text = listener_results[i][j][keyword]["podcast"]["text"]

                            mentions += twitter_text.length + news_text.length
                            // console.log(twitter_text.length)
                            topsourcesdata[0]+=news_text.length
                            topsourcesdata[1]+=twitter_text.length

                           
    
                        }
                        console.log(sentimentsharedata)

                        // console.log('b')          
                        // console.log(keywordmentions)
                        // keywordmentions.sort(function(first, second) {
                        //         return second[1] - first[1];
                        // })
                        // keywordmentions = keywordmentions.slice(0,5)
                        // console.log('a')
                        // console.log(keywordmentions)   

                        mentionschartdata.push(mentions)
                        var created_at = new Date(listener_results[i]["created_at"].substring(0,listener_results[i]["created_at"].indexOf('T')))
                        mentionschartlabels.push(created_at.getDate()+'/'+(created_at.getMonth()+1))
                       
                        posmentionslabels.push(created_at.getDate()+'/'+(created_at.getMonth()+1))
                        posmentionsdata.push((twitter_pos+news_pos))

                    }    
                    var items = Object.keys(keywordmentions).map(function(key) {
                        return [key, keywordmentions[key]];
                      });
                    items.sort(function(first, second) {
                            return second[1] - first[1];
                    })
                    keywordmentions = items.slice(0,5)

                    for(let i = 0; i < keywordmentions.length; i++){
                        topkeywordsdata[i] = keywordmentions[i][1]
                        topkeywordslabels[i] = keywordmentions[i][0]
                    }
                    topkeywordschart.data.labels = topkeywordslabels
                    topkeywordschart.data.datasets[0].data = topkeywordsdata
                    topkeywordschart.update()

                    mentionschart.data.labels = mentionschartlabels
                    mentionschart.data.datasets[0].data = mentionschartdata
                    mentionschart.update()
                    topsourceschart.data.datasets[0].data = topsourcesdata
                    topsourceschart.update()

                    posmentionschart.data.labels = posmentionslabels
                    posmentionschart.data.datasets[0].data = posmentionsdata
                    posmentionschart.update()

                    sentimentsourcechart.data.datasets[0].data = sentimentsourcepos
                    sentimentsourcechart.data.datasets[1].data = sentimentsourceneu
                    sentimentsourcechart.data.datasets[2].data = sentimentsourceneg
                    sentimentsourcechart.update()

                    sentimentsharechart.data.datasets[0].data = sentimentsharedata
                    sentimentsharechart.update()

                })
        }
    }).catch((err) => {
        console.log(err)
    })
}

const sentiment = {
    "negative":`<button type="button" class="Negative" id="Negative">Negative</button>`,
    "positive":`<button type="button" class="Positive" id="Positive">Positive</button>`, 
    "neutral":`<button type="button" class="Neutral" id="Neutral">Neutral</button>`
}
const spam = {
    "0":"",
    "1": `<button type="button" class="Spam" id="Spam"><i class='bx bx-error'></i> Spam</button>`
}

// Pagination
var currentPage = 0
var source_parts = 0

async function viewListenerMentions(listenerid, listenername){
    let listenernamecontainer = document.getElementById("listener_name_mentions")
    listenernamecontainer.innerHTML = listenername
    let listener_html = document.getElementById("listeners_list_items_2")
    Array.from(listener_html.children).forEach((node) => {
        if(node.id === listenerid+"_2"){
            if(node.classList.contains("inactive")){
                node.classList.remove("inactive")
                node.classList.add("active")
            }
        }
        else{
            if(node.classList.contains("active")){
                node.classList.remove("active")
                node.classList.add("inactive")
            }
        }
    })
    document.getElementById("table-container").style.display = "none"
    document.getElementById("loading-container").style.display = "flex"
    await fetch('/listener/result/'+listenerid,{  
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
    }}).then(async (res) => {
        if(res.status==200){
            await res.json().then((data) => {
                var listener_results = []
                for(let i = 0; i < data["result"].length; i++){
                    var jsonvar = JSON.parse(data["result"][i]["result"])
                    jsonvar["created_at"] = data["result"][i]["created_at"]
                    listener_results.push(jsonvar)
                }
                currentPage = 0
                source_parts = 0
                // Initialize pagination div
                let pagination_div = document.getElementById("pagination_div")
                pagination_div.innerHTML = ""
                // calculate number of pages
                const all_listener_length = listener_results.length
                var pages = 0
                
                for(let i = 0; i < all_listener_length; i++){
                    const listener_length = listener_results[i].length
                    for(let j = 0; j < listener_length; j++){
                        const keyword = Object.keys(listener_results[i][j])[0]
                        pages += listener_results[i][j][keyword]["twitter"]["text"]["preprocessed_text"].length
                        pages += listener_results[i][j][keyword]["news"]["text"].length
                        source_parts++
                    }
                }
                // console.log(pages)
                pages = Math.ceil(pages/50)
                
                // create pagination div
                //add previous button
                let previous = document.createElement("div")
                previous.classList.add("button-pagination")
                previous.innerHTML = "<i class='bx bx-chevron-left' ></i> Previous"
                previous.addEventListener("click", () => {
                    let pages = document.getElementsByClassName("page")
                    if(currentPage > 0){
                        for(let j = 0; j < pages.length; j++){
                            pages[j].classList.remove("active")
                        }
                        currentPage--
                        pages[currentPage].classList.add("active")
                        viewMentions(listener_results)
                    }
                })
                pagination_div.appendChild(previous)
                let pagination_numbers = document.createElement("div")
                pagination_numbers.classList.add("pagination-numbers")
                for(let i = 0; i < pages; i++){
                    let page = document.createElement("div")
                    page.classList.add("page")
                    page.innerHTML = i+1
                    page.addEventListener("click", () => {
                        let pages = document.getElementsByClassName("page")
                        for(let j = 0; j < pages.length; j++){
                            pages[j].classList.remove("active")
                        }
                        page.classList.add("active")
                        currentPage = i
                        viewMentions(listener_results)
                    })
                    pagination_numbers.appendChild(page)
                }
                pagination_div.appendChild(pagination_numbers)
                // add next button
                let next = document.createElement("div")
                next.classList.add("button-pagination")
                next.innerHTML = "Next <i class='bx bx-chevron-right' ></i>"
                next.addEventListener("click", () => {
                    let pages = document.getElementsByClassName("page")
                    if(currentPage < pages.length-1){
                        for(let j = 0; j < pages.length; j++){
                            pages[j].classList.remove("active")
                        }
                        currentPage++
                        pages[currentPage].classList.add("active")
                        viewMentions(listener_results)
                    }
                })
                pagination_div.appendChild(next)
                // set first page active
                let pages_by_class = document.getElementsByClassName("page")
                pages_by_class[0].classList.add("active")
                

            viewMentions(listener_results)

        })



        // res.json().then(data => {
        //     const listener_results = data["result"].map(({result,created_at}) => ({
        //         ...JSON.parse(result),
        //         created_at
        //     }))
        //     currentPage = 0
        //     source_parts = 0
        //     // Initialize pagination div
        //     let pagination_div = document.getElementById("pagination_div")
        //     pagination_div.innerHTML = ""
        //     // calculate number of pages
        //     const all_listener_length = listener_results.length
        //     var pages = 0
            
        //     for(let i = 0; i < all_listener_length; i++){
        //         const listener_length = listener_results[i].length
        //         for(let j = 0; j < listener_length; j++){
        //             const keyword = Object.keys(listener_results[i][j])[0]
        //             pages += listener_results[i][j][keyword]["twitter"]["text"]["preprocessed_text"].length
        //             pages += listener_results[i][j][keyword]["news"]["text"].length
        //             source_parts++
        //         }
        //     }
        //     // console.log(pages)
        //     pages = Math.ceil(pages/50)
            
        //     // create pagination div
        //     //add previous button
        //     let previous = document.createElement("div")
        //     previous.classList.add("button-pagination")
        //     previous.innerHTML = "<i class='bx bx-chevron-left' ></i> Previous"
        //     previous.addEventListener("click", () => {
        //         let pages = document.getElementsByClassName("page")
        //         if(currentPage > 0){
        //             for(let j = 0; j < pages.length; j++){
        //                 pages[j].classList.remove("active")
        //             }
        //             currentPage--
        //             pages[currentPage].classList.add("active")
        //             viewMentions(listener_results)
        //         }
        //     })
        //     pagination_div.appendChild(previous)
        //     let pagination_numbers = document.createElement("div")
        //     pagination_numbers.classList.add("pagination-numbers")
        //     for(let i = 0; i < pages; i++){
        //         let page = document.createElement("div")
        //         page.classList.add("page")
        //         page.innerHTML = i+1
        //         page.addEventListener("click", () => {
        //             let pages = document.getElementsByClassName("page")
        //             for(let j = 0; j < pages.length; j++){
        //                 pages[j].classList.remove("active")
        //             }
        //             page.classList.add("active")
        //             currentPage = i
        //             viewMentions(listener_results)
        //         })
        //         pagination_numbers.appendChild(page)
        //     }
        //     pagination_div.appendChild(pagination_numbers)
        //     // add next button
        //     let next = document.createElement("div")
        //     next.classList.add("button-pagination")
        //     next.innerHTML = "Next <i class='bx bx-chevron-right' ></i>"
        //     next.addEventListener("click", () => {
        //         let pages = document.getElementsByClassName("page")
        //         if(currentPage < pages.length-1){
        //             for(let j = 0; j < pages.length; j++){
        //                 pages[j].classList.remove("active")
        //             }
        //             currentPage++
        //             pages[currentPage].classList.add("active")
        //             viewMentions(listener_results)
        //         }
        //     })
        //     pagination_div.appendChild(next)
        //     // set first page active
        //     let pages_by_class = document.getElementsByClassName("page")
        //     pages_by_class[0].classList.add("active")
            

        // viewMentions(listener_results)
        // })
        }
    }).catch((err) => {
        console.log(err)
    })
}

var view_more_onclick = []

function viewMentions(listener_results){
    let mentions_table = document.getElementById("mentions-table")
                    
                    var innerHTML = ``
                    mentions_table.innerHTML = `
                        <tr>
                            <th scope = "col"><i class='bx bx-list-ul icon'></i>Date</th>
                            <th scope="col">
                                <i class='bx bx-list-ul icon'></i>
                                Mention</th>
                            <th scope="col">
                                <i class='bx bx-list-ul icon'></i>
                                Source</th>
                            <th scope="col">
                                <i class='bx bx-list-ul icon'></i>Sentiment</th>
                            <th scope="col">
                                <i class='bx bx-list-ul icon'></i>Summary</th>
                            <th scope="col">
                                <i class='bx bx-list-ul icon'></i>URL</th>
                        </tr>
                    `
                    let all_listener_length = listener_results.length
                    view_more_onclick = []
                    for(let i = 0; i < all_listener_length; i++){
                        const listener_length = listener_results[i].length
                        for(let j = 0; j < listener_length; j++){
                            const keyword = Object.keys(listener_results[i][j])[0]
                            //calculate the start and end indices for the current page
                            const start_index = (currentPage)* Math.floor(50/source_parts)
                            const end_index = start_index + Math.floor(50/source_parts)
                            
                            //TWITTER
                            const twitter_text = listener_results[i][j][keyword]["twitter"]["text"]["preprocessed_text"]
                            const twitter_links_dates = listener_results[i][j][keyword]["twitter"]["links_dates"].slice(start_index,end_index)
                            const twitter_sentiment = listener_results[i][j][keyword]["twitter"]["sentiment"].slice(start_index,end_index)
                            const twitter_spam_tweets = listener_results[i][j][keyword]["twitter"]["spam"].slice(start_index,end_index)
                            //NEWS
                            const news_text = listener_results[i][j][keyword]["news"]["text"]
                            const news_links = listener_results[i][j][keyword]["news"]["links"].slice(start_index,end_index)
                            const news_links_dates = listener_results[i][j][keyword]["news"]["publishedAt"].slice(start_index,end_index)
                            const news_sentiment = listener_results[i][j][keyword]["news"]["sentiment"].slice(start_index,end_index)

                            //TWITTER
                            const tweet_row = twitter_text.slice(start_index,end_index).map((tweet, k) => {
                                tweet = preprocess_text(tweet)
                                // tweet = truncateText(tweet,twitter_sentiment[k],twitter_links_dates[k]["link"],twitter_links_dates[k]["date"],keyword,"twitter")
                                
                                let tweet_published_at = format_date(twitter_links_dates[k]["date"])
                                mentions_table.appendChild(generateTweetRow(keyword, tweet,tweet_published_at,twitter_sentiment[k],twitter_links_dates[k]["link"],twitter_spam_tweets[k]))
                            })
                            innerHTML += tweet_row.join("")

                            //NEWS
                            const news_rows = news_text.slice(start_index,end_index).map((news, k) => {
                                news = preprocess_text(news)
                                // news = truncateText(news,news_sentiment[k],news_links[k],news_links_dates[k],keyword,"news")
                                let news_published_at = format_date(news_links_dates[k])
                                mentions_table.appendChild(generateNewsRow(keyword,news,news_published_at,news_sentiment[k],news_links[k]))
                            })
                            innerHTML += news_rows.join("")
                            
                        }
                    }
                    document.getElementById("table-container").style.display = "block"
                    document.getElementById("loading-container").style.display = "none"
                    // mentions_table.innerHTML += innerHTML
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

  //"${twitter_text[k]}","twitter","${twitter_sentiment[k]}",${twitter_links_dates[k]},"${twitter_spam_tweets[k]}",${keyword}
function popUpMention(text,type,sentiment,link,date,keyword){
//wrap keyword in span
let wrapped_keyword = "<span style='color: green; font-weight: 900'>" + keyword + "</span>"
text = text.replace(keyword, wrapped_keyword)
text = text.replace(keyword.toLowerCase(), wrapped_keyword)
text = text.replace(keyword.toUpperCase(), wrapped_keyword)
// format date
let date_obj = new Date(date)
let formatted_date = date_obj.getDate() + "/" + date_obj.getMonth() + "/" + date_obj.getFullYear()

let popUp = document.getElementById("mention_popup")
popUp.style.display = "flex"
popUp.innerHTML = `
<div class='popup_container'>
    <div class='popup_header_row'>
        <button onclick='closePopUp()'><i class='bx bx-x' ></i></button>
    </div>
    <h1 class='popup_keyword_header'>${keyword}</h1>
    <div class='popup_text'><bdi>${text}</bdi></div>
</div>
`
}

function closePopUp(){
    let popUp = document.getElementById("mention_popup")
    popUp.style.display = "none"
}

function preprocess_text(tweet){
    tweet = tweet.replace(/\s+/g, ' ').replace(/"/g, '\\"')
    return tweet
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function truncateText(text, sentiment, link, date, keyword,source) {
    let text_container = document.createElement("div")
    text_container.className = "mention_text"
    text_container.innerHTML = `<p><bdi>${text}</bdi></p>`
    if (text.length > 128) {
        text_container.innerHTML = ""
        let id = generateUniqueId();
        // create button
        let button = document.createElement("button");
        button.innerHTML = "View more <i class='bx bx-expand-alt'></i>";
        button.id = id;
        button.onclick = function () {
            popUpMention(text,source,sentiment,link,date,keyword)
        }
        let text_p = document.createElement("p")
        let text_bdi = document.createElement("bdi")
        text_bdi.innerHTML = text.slice(0,128)
        text_bdi.appendChild(document.createElement("br"))
        text_bdi.appendChild(button)
        text_p.appendChild(text_bdi)
        text_container.appendChild(text_p)
    }
    return text_container;
}

function format_date(date) {
    let tweetPublishedAt = new Date(date);
    return tweetPublishedAt.getDate() + "/" + (tweetPublishedAt.getMonth() + 1) + "/" + tweetPublishedAt.getFullYear();
}

function wrapKeyword(text, keyword) {
    const wrappedKeyword = `<span style="color: green; font-weight: 900">${keyword}</span>`;
    text = text.replace(keyword, wrappedKeyword);
    text = text.replace(keyword.toLowerCase(), wrappedKeyword);
    text = text.replace(keyword.toUpperCase(), wrappedKeyword);
    return text;
}

function generateTweetRow(keyword, tweet, tweet_published_at, tweet_sentiment, tweet_link,tweet_spam){
    // create row
    let row = document.createElement("tr");
    // create needed columns
    let item_publish_date = document.createElement("td")
    item_publish_date.id = "Data"
    item_publish_date.innerHTML = tweet_published_at
    row.appendChild(item_publish_date)

    let mention_text = document.createElement("td")
    mention_text.appendChild(truncateText(tweet, tweet_sentiment, tweet_link, tweet_published_at, keyword,"twitter"))
    row.appendChild(mention_text)

    let source_item = document.createElement("td")
    let source_item_div = document.createElement("div")
    source_item_div.className = "source_item"
    let source_item_button = document.createElement("button")
    source_item_button.type = "button"
    source_item_button.className = "Twitter"
    source_item_button.id = "Twitter"
    source_item_button.innerHTML = "Twitter"
    
    source_item_div.appendChild(source_item_button)
    source_item_div.innerHTML += spam[tweet_spam]
    source_item.appendChild(source_item_div)
    row.appendChild(source_item)

    let sentiment_item = document.createElement("td")
    sentiment_item.innerHTML = sentiment[tweet_sentiment]
    row.appendChild(sentiment_item)

    let summary_item = document.createElement("td")
    summary_item.id = "Summary"
    summary_item.innerHTML = "Twitter"
    row.appendChild(summary_item)

    let action_item = document.createElement("td")
    let action_item_div = document.createElement("div")
    let action_item_button_open = document.createElement("button")
    action_item_button_open.type = "button"
    action_item_button_open.id = "Open"
    action_item_button_open.onclick = function () {
        window.open(tweet_link, '_blank')
    }
    let action_item_button_open_i = document.createElement("i")
    action_item_button_open_i.className = "bx bx-link-external"
    action_item_button_open.appendChild(action_item_button_open_i)
    action_item_button_open.innerHTML += "Open"
    action_item_div.appendChild(action_item_button_open)
    let action_item_button_copy = document.createElement("button")
    action_item_button_copy.type = "button"
    action_item_button_copy.onclick = function () {
        copyToClipboard(tweet_link)
    }
    action_item_button_copy.id = "Copy"
    let action_item_button_copy_i = document.createElement("i")
    action_item_button_copy_i.className = "bx bx-copy"
    action_item_button_copy.appendChild(action_item_button_copy_i)
    action_item_button_copy.innerHTML += "Copy"
    action_item_div.appendChild(action_item_button_copy)
    action_item.appendChild(action_item_div)
    row.appendChild(action_item)
    return row
}

function generateNewsRow(keyword,news, news_published_at, news_sentiment, news_link){
    let row = document.createElement("tr")
    let item_publish_date = document.createElement("td")
    item_publish_date.id = "Data"
    item_publish_date.innerHTML = news_published_at
    row.appendChild(item_publish_date)

    let mention_text = document.createElement("td")
    mention_text.appendChild(truncateText(news, news_sentiment, news_link, news_published_at, keyword,"news"))
    row.appendChild(mention_text)

    let source_item = document.createElement("td")
    let source_item_div = document.createElement("div")
    source_item_div.className = "source_item"
    let source_item_button = document.createElement("button")
    source_item_button.type = "button"
    source_item_button.className = "News"
    source_item_button.id = "News"
    source_item_button.innerHTML = "News"

    source_item_div.appendChild(source_item_button)
    source_item.appendChild(source_item_div)
    row.appendChild(source_item)

    let sentiment_item = document.createElement("td")
    sentiment_item.innerHTML = sentiment[news_sentiment]
    row.appendChild(sentiment_item)

    let summary_item = document.createElement("td")
    summary_item.id = "Summary"
    summary_item.innerHTML = "News"
    row.appendChild(summary_item)

    let action_item = document.createElement("td")
    let action_item_div = document.createElement("div")
    let action_item_button_open = document.createElement("button")
    action_item_button_open.type = "button"
    action_item_button_open.id = "Open"
    action_item_button_open.onclick = function () {
        window.open(news_link, '_blank')
    }
    let action_item_button_open_i = document.createElement("i")
    action_item_button_open_i.className = "bx bx-link-external"
    action_item_button_open.appendChild(action_item_button_open_i)
    action_item_button_open.innerHTML += "Open"
    action_item_div.appendChild(action_item_button_open)
    let action_item_button_copy = document.createElement("button")
    action_item_button_copy.type = "button"
    action_item_button_copy.onclick = function () {
        copyToClipboard(news_link)
    }
    action_item_button_copy.id = "Copy"
    let action_item_button_copy_i = document.createElement("i")
    action_item_button_copy_i.className = "bx bx-copy"
    action_item_button_copy.appendChild(action_item_button_copy_i)
    action_item_button_copy.innerHTML += "Copy"
    action_item_div.appendChild(action_item_button_copy)
    action_item.appendChild(action_item_div)
    row.appendChild(action_item)
    return row
}

