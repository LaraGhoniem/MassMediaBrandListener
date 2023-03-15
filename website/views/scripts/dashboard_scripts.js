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
            new Chart(
                ctx,
                {         
                    type: 'bar',
                    data:  
                     {
                        labels: ['News',
                        'Twitter',
                        'YouTube',
                        'Blogs',
                        'Podcasts'],
                        datasets: [{
                            label: 'Top keyword mentions',
                            data: [65, 59, 80, 81, 56],
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
                        'May',],
                        datasets: [{
                            label: 'Top keyword mentions',
                            data: [65, 59, 80, 81, 56],
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
            new Chart(
                ctx,
                {         
                    type: 'bar',
                    data: {
                        labels: ['News',
                        'Twitter',
                        'YouTube',
                        'Blogs',
                        'Podcasts'],
                        
                        datasets: [
                        {label: 'Positive',
                        data: [65, 59, 80, 81, 56, 55, 40],
                    backgroundColor:'rgba(133, 92, 248, 0.6)'},
                        {label: 'Neutral',
                        data: [75, 5, 10, 0, 45, 60, 10],
                    backgroundColor:'rgba(133, 92, 248)'},
                        {label: 'Negative',
                        data: [20, 15, 5, 30, 40, 10, 5],
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
            <div id="${listeners[i]._id}_2" class="listeners_list_item ${(i==0)?'active':'inactive'}" onclick="viewListenerMentions('${listeners[i]._id}')">
                <h3>${listeners[i].listener_name}</h3>
            </div>
            `
        }
    }
    listener_html.innerHTML = listener_html_inner
    listener_html_2.innerHTML = listener_html_inner_2
}

function viewListener(listenerid, listenername){
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
}

function viewListenerMentions(listenerid){
    let listener_html = document.getElementById("listeners_list_items_2")
    Array.from(listener_html.children).forEach((node) => {
        if(node.id === listenerid+"_2"){
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
}