// import { response } from "express";
import {
    Post
} from "./helpers/post.js";
import {
    User
} from "./helpers/user.js";
import ChartDataPreparer from "./helpers/chart_data_preparer.js";
// event listeners
// logout button
document.getElementById("user-logout").addEventListener("click", async () => await User.logout());
//navigation

let nav_slider = document.getElementById('navigation')
let nav_settings_slider = document.getElementById('navigation-settings')
let nav_buttons = nav_slider.children
let nav_settings_buttons = nav_settings_slider.children
// nav_buttons += nav_settings_buttons
for (let i = 0; i < nav_buttons.length; i++) {
    nav_buttons[i].addEventListener('click', () => {
        navigate(i + 1)
    })
}
for (let i = 0; i < nav_settings_buttons.length; i++) {
    nav_settings_buttons[i].addEventListener('click', () => {
        navigate(i + 4)
    })
}
// add keyword button
document.getElementById("add-keyword").addEventListener("click", () => {
    addKeyword()
})
var keywordValues = [];
document.getElementById('continue-add-listener').addEventListener("click", () => {
    let keywords = document.querySelectorAll("#keyword-input-container > div > input");

    let error = false

    let listenerName = document.getElementById("new-listener-name").value;
    if (listenerName === "") {
        document.getElementById("new-listener-name").style.border = "3px solid red";
        document.getElementById("error-message").innerHTML = "Please enter a listener name";
        error = true
    }
    if (keywords.length === 0) {
        document.getElementById("keyword-input-container").style.border = "3px solid red";
        document.getElementById("error-message").innerHTML += "\nPlease enter at least one keyword";
        error = true
    }
    for (let keyword of keywords) {
        if (keyword.value === "") {
            keyword.style.border = "3px solid red";
            document.getElementById("error-message").innerHTML += "\nPlease enter a keyword";
            error = true
            return;
        } else {
            keywordValues.push(keyword.value);
        }
    }

    if (!error) {
        document.querySelector(".pop-up-content").style.display = "none";
        document.querySelector(".pop-up-content-categories").style.display = "block";
    }
})
// add listener popup
document.querySelectorAll(".listener-header-row button").forEach(function (button) {
    button.addEventListener("click", function () {
        document.getElementById("add-listener-popup").style.display = "flex";
        document.getElementById("add-listener-popup").style.opacity = 1;
        document.getElementById("pagination_fixed_position").style.display = "none";
    });
});

// add keyword pop up in edit listener
document.getElementById("close-keyword-popup").addEventListener("click", () => {
    document.getElementById("add-keyword-button").value = ""
    document.getElementById("add-keyword-popup-container").style.display = "none";
})
document.getElementById("close-edit-keyword-popup").addEventListener("click", () => {
    document.getElementById("edit-keyword-button").value = ""
    document.getElementById("edit-keyword-popup-container").style.display = "none";
})



function validateEditForm() {
    let addlistenerName = document.getElementById("addlistenerName");
    let addCompanyName = document.getElementById("addCompanyName");
    let addlistenerEmail = document.getElementById("addlistenerEmail");

    if (addlistenerName.value.trim() === "") {
        alert("Please enter your name.");
        addlistenerName.focus();
        return false;
    }
    if (addCompanyName.value.trim() === "") {
        alert("Please enter your company name.");
        addCompanyName.focus();
        return false;
    }
    if (addlistenerEmail.value.trim() === "") {
        alert("Please enter your email.");
        addlistenerEmail.focus();
        return false;
    } else if (!validateEmail(addlistenerEmail.value.trim())) {
        alert("Please enter a valid email address.");
        addlistenerEmail.focus();
        return false;
    }
    return true;
}

function validateEmail(email) {
    let specialChar = /\S+@\S+\.\S+/;
    return specialChar.test(email);
}



document.getElementById("Update-Profile").addEventListener("click", function (event) {
    event.preventDefault();

    if (validateEditForm() == true) {
        fetch('/user/editProfile ', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: document.getElementById('addlistenerName').value,
                email: document.getElementById('addlistenerEmail').value,
                company: document.getElementById('addCompanyName').value,
                currentPassword: document.getElementById("currentpassword").value,
                newPassword: document.getElementById("Newpassword").value,
                confirmPassword: document.getElementById('confirmpassword').value
            })
        }).then((res) => {
            if (res.status === 200) {
                res.json().then((data) => {
                    user.data.user = data.user.name
                    user.data.user = data.user.email
                    user.data.user = data.user.company
                    user.data.user = data.user.currentPassword
                    user.data.user = data.user.newPassword
                    user.data.user = data.user.confirmPassword
                    document.getElementById("user-name").innerHTML = data.user.name
                    alert("Profile updated successfully")
                })
            } else {
                console.log(res.status)
            }
        }).catch((err) => {
            console.log(err)
        });
    }
});

document.getElementById('Reset-profile').addEventListener('click', () => {
    document.getElementById('addlistenerName').value = user.data.user.name;
    document.getElementById('addCompanyName').value = user.data.user.company;
    document.getElementById('addlistenerEmail').value = user.data.user.email;
    document.getElementById('currentpassword').value = '';
    document.getElementById('Newpassword').value = '';
    document.getElementById('confirmpassword').value = '';
});


// close add listener popup
document.getElementById("cancel-button").addEventListener("click", () => {
    document.querySelector(".pop-up-content-categories").style.display = "none"
    document.querySelector(".pop-up-content").style.display = "block"
    document.getElementById("add-listener-popup").style.display = "none";
    document.getElementById("add-listener-popup").style.opacity = 0;
    document.getElementById("new-listener-name").value = "";
    document.getElementById("keyword-input-container").innerHTML = `<div style="text-align: center; width: 100%">Click on the add button above to add a keyword</div>`;
    document.getElementById("error-message").innerHTML = "";
    document.getElementById("keyword-input-container").style.border = "none";
    document.getElementById("new-listener-name").style.border = "2px solid #5B5B5B";
    document.getElementById("pagination_fixed_position").style.display = "flex";
    keywordValues = [];
    keywordCount = 0
});
// back button on add listener popup
document.getElementById("back-button").addEventListener("click", () => {
    if (document.querySelector(".pop-up-content-categories").style.display === "block") {
        document.querySelector(".pop-up-content").style.display = "block";
        document.querySelector(".pop-up-content-categories").style.display = "none";
        document.getElementById("error-message").innerHTML = "";
    } else {
        document.getElementById("add-listener-popup").style.display = "none";
        document.getElementById("add-listener-popup").style.opacity = 0;
        document.getElementById("new-listener-name").value = "";
        document.getElementById("keyword-input-container").innerHTML = `<div style="text-align: center; width: 100%">Click on the add button above to add a keyword</div>`;
        document.getElementById("error-message").innerHTML = "";
        document.getElementById("keyword-input-container").style.border = "none";
        document.getElementById("new-listener-name").style.border = "2px solid #5B5B5B";
        document.getElementById("pagination_fixed_position").style.display = "flex";
        keywordValues = [];
        keywordCount = 0;
    }
})
var user = {}
var listenersData = []
var categories = []

function displayProfileData() {
    document.getElementById("addlistenerName").value = user.data.user.name
    document.getElementById("addlistenerEmail").value = user.data.user.email
    document.getElementById("addCompanyName").value = user.data.user.company
}

window.onload = async function () {
    user = await User.create()
    document.getElementById("user-name").innerHTML = user.data.user.name
    User.getListeners(user.data.user._id, (data) => {
        if (data.listener.length != 0) {
            listenersData = data.listener
            view_listeners_buttons(listenersData)
            displayProfileData()
            view_listener_graphs(listenersData[0]._id, listenersData[0].listener_name)
            view_listener_mentions(listenersData[0]._id, listenersData[0].listener_name)
        }
        else{
            // stop the loading animation and add an empty div
            document.getElementById("loading-container-charts").style.display = "none"
            document.getElementById("loading-container").style.display = "none"
            document.getElementById("empty-result-charts").style.display = "none"
            document.getElementById("listener_data_api").style.display = "none"
            document.getElementById("empty-result-charts").style.display = "none"
            document.getElementById("empty-result").style.display = "none"
            document.getElementById("listeners_list_items").style.display = "none"
            document.getElementById("listeners_list_items_2").style.display = "none"
            document.getElementById("no-listeners-created-container").style.display = "flex"
        }
    })
    // get all categories from database
    let post = new Post("/category/all")
    post.get((data) => {
        categories = data.category
        viewCategories(categories)
    })
}

document.getElementById('navigation-2').classList.add('active')

var gradient;

function getGradient(ctx, chartArea) {
    gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, 'rgba(133, 92, 248, 0.4)');
    gradient.addColorStop(1, 'rgba(133, 92, 248, 0)');

    return gradient;
}
const chosenCategories = [];

function viewCategories(categories) {
    const container = document.querySelector('.category-container');

    for (let i = 0; i < categories.length; i += 2) {
        const column = document.createElement('div');
        column.classList.add('category-column');

        const item1 = document.createElement('div');
        item1.classList.add('category-item');
        item1.textContent = categories[i].category_name;
        const checkIcon1 = document.createElement('span');
        checkIcon1.classList.add('check-icon');
        checkIcon1.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#353535"/>
        <path d="M28 14L17 25L12 20" stroke="#C7BEFF" stroke-opacity="0.87" stroke-width="4" stroke-linecap="square"/>
        </svg>
        `;
        item1.appendChild(checkIcon1);
        item1.addEventListener('click', () => {
            if (item1.dataset.bgColor === '#C7BEFF') {
                item1.style.backgroundColor = '';
                item1.dataset.bgColor = '';
                checkIcon1.style.display = 'none';
                chosenCategories.splice(chosenCategories.indexOf(categories[i]), 1);
            } else {
                item1.style.backgroundColor = '#C7BEFF';
                item1.dataset.bgColor = '#C7BEFF';
                checkIcon1.style.display = 'block';
                chosenCategories.push(categories[i]);
            }
        });
        column.appendChild(item1);

        if (categories[i + 1]) {
            const item2 = document.createElement('div');
            item2.classList.add('category-item');
            item2.textContent = categories[i + 1].category_name;
            const checkIcon2 = document.createElement('span');
            checkIcon2.classList.add('check-icon');
            checkIcon2.innerHTML = `
        <svg width="30" height="30" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#353535"/>
        <path d="M28 14L17 25L12 20" stroke="#C7BEFF" stroke-opacity="0.87" stroke-width="4" stroke-linecap="square"/>
        </svg>
        `;
            item2.appendChild(checkIcon2);
            item2.addEventListener('click', () => {
                if (item2.dataset.bgColor === '#C7BEFF') {
                    item2.style.backgroundColor = '';
                    item2.dataset.bgColor = '';
                    checkIcon2.style.display = 'none';
                    chosenCategories.splice(chosenCategories.indexOf(categories[i + 1]), 1);
                } else {
                    item2.style.backgroundColor = '#C7BEFF';
                    item2.dataset.bgColor = '#C7BEFF';
                    checkIcon2.style.display = 'block';
                    chosenCategories.push(categories[i + 1]);
                }
            });
            column.appendChild(item2);
        }

        container.appendChild(column);
    }

    let submitButton = document.getElementById("submit-listener")
    submitButton.addEventListener("click", () => {
        let listenerName = document.getElementById("new-listener-name").value
        let listenerKeywords = keywordValues
        let listenerCategories = chosenCategories.map((category) => {
            return category._id
        })
        let listener = {
            listener_name: listenerName,
            listener_keywords: listenerKeywords,
            listener_categories: listenerCategories
        }
        User.addListener(user.data.user._id, listener, () => {
            User.getListeners(user.data.user._id, (data) => {
                listenersData = data.listener
                view_listeners_buttons(listenersData)
                view_listener_graphs(listenersData[0]._id, listenersData[0].listener_name)
                view_listener_mentions(listenersData[0]._id, listenersData[0].listener_name)
            })
            document.getElementById("add-listener-popup").style.display = "none";
        })
    })
}

// MENTIONS OVER TIME CHART //
// The variable that handles the ChartJS object
var mentionschart
var ctx = document.getElementById('mentionslinechart');
mentionschart = new Chart(
    ctx, {
        type: 'line',
        data: {
            labels: mentionschartlabels,
            datasets: [{
                label: 'Mentions over time',
                order: screenLeft,
                data: mentionschartdata,
                fill: true,
                borderWidth: 2.5,
                backgroundColor: function (context) {
                    const chart = context.chart;
                    const {
                        ctx,
                        chartArea
                    } = chart;

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
            }
        }
    },

);
// The labels that will be displayed below the graph. Mainly the labels will be the dates these listeners worked on.
var mentionschartlabels = []
// The numbers that will be shown on the graph.
var mentionschartdata = []

// TOP SOURCES CHART //
ctx = document.getElementById('topSources')
var topsourceschart = new Chart(
    ctx, {
        type: 'bar',
        data: {
            labels: ['YouTube',
                'Podcasts',
                'Twitter',
                'News'
            ],
            datasets: [{
                label: 'Top keyword mentions',
                data: [],
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
var topsourcesdata = []

// POSITIVE MENTIONS OVER TIME CHART //
ctx = document.getElementById('posMentions')
var positive_mentions_over_time_chart = new Chart(
    ctx, {
        type: 'line',
        data: {
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


        },
        options: {
            plugins: {

                legend: {
                    display: false,
                },
            },
            elements: {
                point: {
                    backgroundColor: 'rgb(137,110,240)',
                }
            }
        }
    },
);
var posmentionslabels = []
var posmentionsdata = []

ctx = document.getElementById('topKeywords').getContext('2d')
var topkeywordschart = new Chart(
    ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Top keyword mentions',
                data: [],
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
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false,
                },
            }
        }
    },

);
var topkeywordslabels = []
var topkeywordsdata = []


// Sentiment Share Chart //
var sentimentsharedata = []
ctx = document.getElementById('sentimentShare')
var sentimentsharechart = new Chart(
    ctx, {
        type: 'pie',
        data: {
            labels: [
                'Positive',
                'Neutral',
                'Negative'
            ],
            datasets: [{
                label: 'Number of mentions',
                data: [],
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

// Sentiment By Source Chart //
ctx = document.getElementById('sentimentSource')
var sentiment_source_chart = new Chart(
    ctx, {
        type: 'bar',
        data: {
            labels: ['youtube', 'podcast', 'twitter', 'news'],
            datasets: [{
                    label: 'Positive',
                    data: sentimentsourcepos,
                    backgroundColor: 'rgba(133, 92, 248, 0.6)'
                },
                {
                    label: 'Neutral',
                    data: sentimentsourceneu,
                    backgroundColor: 'rgba(133, 92, 248)'
                },
                {
                    label: 'Negative',
                    data: sentimentsourceneg,
                    backgroundColor: 'rgb(18,0,29)',
                }
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
var sentimentsourcepos = []
var sentimentsourceneu = []
var sentimentsourceneg = []

var keywordmentions = []

function navigate(page) {
    User.getListeners(user.data.user._id, (data) => {
        listenersData = data.listener
    })
    // remove active class from all buttons of navigation
    let nav_slider = document.getElementById('navigation')
    let nav_settings_slider = document.getElementById('navigation-settings')
    let nav_buttons = nav_slider.children
    let nav_settings_buttons = nav_settings_slider.children
    // nav_buttons += nav_settings_buttons
    for (let i = 0; i < nav_buttons.length; i++) {
        nav_buttons[i].removeAttribute('class')
    }
    for (let i = 0; i < nav_settings_buttons.length; i++) {
        nav_settings_buttons[i].removeAttribute('class')
    }
    document.getElementById('navigation-' + page).classList.add('active')
    if (page === 1) {
        document.getElementById("view-listeners").style.display = "block";
        document.getElementById("web-mentions").style.display = "none";
        document.getElementById("Account-Settings").style.display = "none";
        document.getElementById("keyword-Settings").style.display = "none";
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
    } else if (page === 2) {
        document.getElementById("view-listeners").style.display = "none";
        document.getElementById("web-mentions").style.display = "block";
        document.getElementById("Account-Settings").style.display = "none";
        document.getElementById("keyword-Settings").style.display = "none";
    } else if (page === 4) {
        document.getElementById("view-listeners").style.display = "none";
        document.getElementById("web-mentions").style.display = "none";
        document.getElementById("Account-Settings").style.display = "block";
        document.getElementById("keyword-Settings").style.display = "none";
    } else if (page === 5) {
        document.getElementById("view-listeners").style.display = "none";
        document.getElementById("web-mentions").style.display = "none";
        document.getElementById("Account-Settings").style.display = "none";
        document.getElementById("keyword-Settings").style.display = "block";
        get_edit_listeners(listenersData)
    }
}

var keywordCount = 0;

function addKeyword() {
    let keywords = document.getElementById("keyword-input-container");

    // remove initial div on first click
    if (keywordCount === 0) {
        keywords.removeChild(keywords.firstElementChild);
    }

    keywordCount++;
    let keyword = document.createElement("div");
    keyword.setAttribute("class", "keyword-input");
    keyword.setAttribute("id", "keyword-container-" + keywordCount);
    keyword.innerHTML = `
        <input type="text" id="keyword-input-${keywordCount}" placeholder="Keyword">
        <button id='remove-${keywordCount}'>
            <svg width="28" height="28" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.08496 13H20.9135" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `;
    keywords.appendChild(keyword);

    let removeButton = document.getElementById(`remove-${keywordCount}`);
    removeButton.addEventListener('click', () => {
        keywordCount--;
        keyword.remove();

        // add message if this was the last div
        if (keywords.childElementCount === 0) {
            let message = document.createElement("div");
            message.setAttribute("style", "text-align: center; width: 100%");
            message.textContent = "Click on the add button above to add a keyword";
            keywords.appendChild(message);
        }
    });
}
function addKeyword1(){
    let keywords = document.getElementById("keyword-input-container");

    // remove initial div on first click
    if (keywordCount === 0) {
        keywords.removeChild(keywords.firstElementChild);
    }

    keywordCount++;
    let keyword = document.createElement("div");
    keyword.setAttribute("class", "keyword-input");
    keyword.setAttribute("id", "keyword-container-" + keywordCount);
    keyword.innerHTML = `
        <input type="text" id="keyword-input-${keywordCount}" placeholder="Keyword">
        <button id='remove-${keywordCount}'>
            <svg width="28" height="28" viewBox="0 0 28 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.08496 13H20.9135" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    `;
    keywords.appendChild(keyword);

    let removeButton = document.getElementById(`remove-${keywordCount}`);
    removeButton.addEventListener('click', () => {
        keywordCount--;
        keyword.remove();

        // add message if this was the last div
        if (keywords.childElementCount === 0) {
            let message = document.createElement("div");
            message.setAttribute("style", "text-align: center; width: 100%");
            message.textContent = "Click on the add button above to add a keyword";
            keywords.appendChild(message);
        }
    });
}


function view_listeners_buttons(listeners) {
    let listener_html = document.getElementById("listeners_list_items")
    let listener_html_2 = document.getElementById("listeners_list_items_2")
    listener_html.innerHTML = `<h4>No Listeners Created</h4>`
    listener_html_2.innerHTML = `<h4>No Listeners Created</h4>`
    if (listeners.length > 0) {
        listener_html.innerHTML = ""
        listener_html_2.innerHTML = ""
        for (let i = 0; i < listeners.length; i++) {
            let listener_div = document.createElement("div")
            listener_div.setAttribute("id", listeners[i]._id)
            listener_div.setAttribute("class", "listeners_list_item")
            if (i == 0)
                listener_div.classList.add("active")
            else
                listener_div.classList.add("inactive")
            listener_div.addEventListener("click", () => {
                view_listener_graphs(listeners[i]._id, listeners[i].listener_name)
            })

            let listener_name = document.createElement("h3")
            listener_name.innerHTML = listeners[i].listener_name
            listener_div.appendChild(listener_name)
            listener_html.appendChild(listener_div)

            let listener_div_2 = document.createElement("div")
            listener_div_2.setAttribute("id", listeners[i]._id + "_2")
            listener_div_2.setAttribute("class", "listeners_list_item")
            if (i == 0)
                listener_div_2.classList.add("active")
            else
                listener_div_2.classList.add("inactive")
            listener_div_2.addEventListener("click", () => {
                view_listener_mentions(listeners[i]._id, listeners[i].listener_name)
            })

            let listener_name_2 = document.createElement("h3")
            listener_name_2.innerHTML = listeners[i].listener_name
            listener_div_2.appendChild(listener_name_2)
            listener_html_2.appendChild(listener_div_2)
            // listener_div_2.appendChild(listener_div_2)
            // listener_div_2.appendChild(listener_name_3)
            // listener_html_2.appendChild(listener_div_3)
        }
    }
}

async function view_listener_graphs(listenerid, listenername) {
    let listenernamecontainer = document.getElementById("listener_name")
    listenernamecontainer.innerHTML = listenername
    let listener_html = document.getElementById("listeners_list_items")
    Array.from(listener_html.children).forEach((node) => {
        if (node.id === listenerid) {
            if (node.classList.contains("inactive")) {
                node.classList.remove("inactive")
                node.classList.add("active")
            }
        } else {
            if (node.classList.contains("active")) {
                node.classList.remove("active")
                node.classList.add("inactive")
            }
        }
    })
    document.getElementById("listener_data_api").style.display = "none"
    document.getElementById("empty-result-charts").style.display = "none"
    document.getElementById("loading-container-charts").style.display = "flex"
    await fetch('/listener/result/' + listenerid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(async (res) => {
        if (res.status == 200) {
            await res.json().then((data) => {
                if (data.result.length === 0) {
                    document.getElementById("listener_data_api").style.display = "none"
                    document.getElementById("empty-result-charts").style.display = "flex"
                    document.getElementById("loading-container-charts").style.display = "none"
                } else {
                    var listener_data = data["result"]
                    listener_data.sort((a, b) => (a.created_at > b.created_at) ? 1 : -1)
                    let chartPreparer = new ChartDataPreparer(listener_data)

                    // MENTIONS CHART DATA
                    var mentions_chart_data = chartPreparer.mentions_over_time_chart_data()
                    mentionschartlabels = mentions_chart_data[0]
                    mentionschartdata = mentions_chart_data[1]

                    // POSITIVE MENTIONS OVER TIME DATA
                    var pos_mentions_chart_data = chartPreparer.pos_mentions_over_time_chart_data()
                    posmentionslabels = pos_mentions_chart_data[0]
                    posmentionsdata = pos_mentions_chart_data[1]


                    // SENTIMENT BY SOURCE DATA
                    var sentiment_data = chartPreparer.sentiment_source_chart_data()

                    // TOP KEYWORDS CHART
                    var keywords_data = chartPreparer.top_keywords_chart_data()
                    let topKeywords = Object.entries(keywords_data).sort((a, b) => b[1] - a[1]).slice(0, 3);
                    topkeywordslabels = topKeywords.map(entry => entry[0]);
                    topkeywordsdata = topKeywords.map(entry => entry[1]);

                    var sentiment_counts = chartPreparer.sentiment_share_chart_data()

                        // use these numbers in the summary
                        document.getElementById("mentions-number").innerHTML = sentiment_counts[0] + sentiment_counts[1] + sentiment_counts[2]
                        document.getElementById("mentions-number-positive").innerHTML = sentiment_counts[0]
                        document.getElementById("mentions-number-neutral").innerHTML = sentiment_counts[1]
                        document.getElementById("mentions-number-negative").innerHTML = sentiment_counts[2]

                        // SOURCE SHARE //
                        var source_counts = chartPreparer.sources_chart_data()
                        document.getElementById("mentions-number-youtube").innerHTML = source_counts[0] == 0? "-" : source_counts[0]
                        document.getElementById("mentions-number-podcast").innerHTML = source_counts[1] == 0? "-" : source_counts[1]
                        document.getElementById("mentions-number-twitter").innerHTML = source_counts[2] == 0? "-" : source_counts[2]
                        document.getElementById("mentions-number-news").innerHTML = source_counts[3] == 0? "-" : source_counts[3]

                    // SOURCE SHARE //
                    var source_counts = chartPreparer.sources_chart_data()

                    // update the charts
                    /** Positive Mentions **/
                    positive_mentions_over_time_chart.data.labels = posmentionslabels
                    positive_mentions_over_time_chart.data.datasets[0].data = posmentionsdata
                    positive_mentions_over_time_chart.update()

                    /** MENTIONS CHART **/
                    mentionschart.data.labels = mentionschartlabels
                    mentionschart.data.datasets[0].data = mentionschartdata
                    mentionschart.update()

                    /** SENTIMENT BY SOURCE CHART **/
                    sentiment_source_chart.data.datasets[0].data = [sentiment_data['youtube']['positive'], sentiment_data['podcast']['positive'], sentiment_data['twitter']['positive'], sentiment_data['news']['positive']]
                    sentiment_source_chart.data.datasets[1].data = [sentiment_data['youtube']['neutral'], sentiment_data['podcast']['neutral'], sentiment_data['twitter']['neutral'], sentiment_data['news']['neutral']]
                    sentiment_source_chart.data.datasets[2].data = [sentiment_data['youtube']['negative'], sentiment_data['podcast']['negative'], sentiment_data['twitter']['negative'], sentiment_data['news']['negative']]
                    sentiment_source_chart.update()

                    /** TOP KEYWORDS CHART **/
                    topkeywordschart.data.labels = topkeywordslabels
                    topkeywordschart.data.datasets[0].data = topkeywordsdata
                    topkeywordschart.update()

                    /** SENTIMENT SHARE CHART **/
                    sentimentsharechart.data.datasets[0].data = sentiment_counts
                    sentimentsharechart.update()

                    /** SOURCE SHARE CHART **/
                    topsourceschart.data.datasets[0].data = source_counts
                    topsourceschart.update()

                    // remove the loading screen to view the data
                    document.getElementById("loading-container-charts").style.display = "none"
                    document.getElementById("listener_data_api").style.display = "flex"
                    document.getElementById("empty-result-charts").style.display = "none"
                }
            })
        }
    }).catch((err) => {
        console.log(err)
    })
}

function get_edit_listeners(listeners){
    let listeners_container = document.getElementById("listeners_list_items_edit")
    listeners_container.innerHTML = ""
    let listener_name_header = document.getElementById("listener_name_3")
    let counter = 0
    for(let listener in listeners){
        let listener_div = document.createElement("div")
        listener_div.setAttribute("id", listeners[listener]._id)
        listener_div.setAttribute("class", "listeners_list_item")
        listener_div.innerHTML = `<h3>${listeners[listener].listener_name}</h3>`
        if (counter++ == 0){
            listener_div.classList.add("active")
            listener_name_header.innerHTML = listeners[listener].listener_name
            get_edit_keywords(listeners[listener]._id)
        }
        else
            listener_div.classList.add("inactive")
        listener_div.onclick =  () => {
            for(let child = 0; child < listeners_container.children.length; child++){
                if(listeners_container.children[child].id == listeners[listener]._id){
                    listeners_container.children[child].classList.remove("inactive")
                    listeners_container.children[child].classList.add("active")
                    continue
                }
                listeners_container.children[child].classList.remove("active")
                listeners_container.children[child].classList.add("inactive")
                listener_name_header.innerHTML = listeners[listener].listener_name
            }
            get_edit_keywords(listeners[listener]._id)
        }
        listeners_container.appendChild(listener_div)
    }
}

function get_edit_keywords(listener_id){
    let keywords_container = document.getElementById("edit_keywords_table")
    keywords_container.innerHTML = ""
    document.getElementById("add-keyword-edit").onclick = () => {
        // view a pop-up
        document.getElementById("add-keyword-popup-container").style.display = "flex"
        document.getElementById("add-keyword-button").onclick = () => {
            let keyword = document.getElementById("add-keyword-input").value
            document.getElementById("add-keyword-input").value = ""
            fetch('/keyword/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    keyword: keyword,
                    listener_id: listener_id
                })
            }).then(response=>response.json()).then(data=>{
                get_edit_keywords(listener_id)
                document.getElementById("add-keyword-popup-container").style.display = "none"
            })
        }
    }
    fetch('/keyword/view/'+listener_id).then(response=>response.json()).then(data=>{
        const keyword_table = document.getElementById("edit_keywords_table")
        keyword_table.innerHTML = `
        <thead>
            <tr>
                <th>Keyword</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        `
        
        for(let keyword in data["keywords"]){
            const row = keyword_table.insertRow()
            row.insertCell().textContent = data["keywords"][keyword]["keyword"]
            let edit_button = document.createElement("button")
            edit_button.setAttribute("class", "rounded-btn")
            edit_button.textContent = "Edit"
            edit_button.addEventListener("click", () => {
                let keyword_input = document.getElementById("edit-keyword-input")
                keyword_input.value = data["keywords"][keyword]["keyword"]
                let keyword_id = data["keywords"][keyword]["_id"]
                let edit_keyword_button = document.getElementById("edit-keyword-button")
                document.getElementById("edit-keyword-popup-container").style.display = "flex"
                    document.getElementById("edit-keyword-button").onclick = () => {
                        let keyword = document.getElementById("edit-keyword-input").value
                        document.getElementById("edit-keyword-input").value = ""
                        fetch('/keyword/'+keyword_id+ '/' + keyword, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                keyword: keyword,
                            })
                        }).then(response=>response.json()).then(data=>{
                            get_edit_keywords(listener_id)
                            document.getElementById("edit-keyword-popup-container").style.display = "none"
                        })
                    }
            })
            row.insertCell().appendChild(edit_button)
            let delete_button = document.createElement("button")
            delete_button.setAttribute("class", "rounded-btn")
            delete_button.textContent = "Delete"
            delete_button.addEventListener("click", () => {
                let keyword_id = data["keywords"][keyword]["_id"]
                fetch('/keyword/delete/'+keyword_id, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }).then(response=>response.json()).then(data=>{
                    console.log(data)
                    get_edit_keywords(listener_id)
                })
            })
            row.insertCell().appendChild(delete_button)
        }
        
        document.getElementById("edit_keywords_table").style.display = "table"
        document.getElementById("loading-container-edit-keywords").style.display = "none"
    })
}

const sentiment = {
    "negative": `<button type="button" class="Negative" id="Negative">Negative</button>`,
    "positive": `<button type="button" class="Positive" id="Positive">Positive</button>`,
    "neutral": `<button type="button" class="Neutral" id="Neutral">Neutral</button>`
}
const spam = {
    "0": "",
    "1": `<button type="button" class="Spam" id="Spam"><i class='bx bx-error'></i> Spam</button>`
}

// Pagination
var currentPage = 0

async function view_listener_mentions(listenerid, listenername){
    currentPage = 0
    let listenernamecontainer = document.getElementById("listener_name_mentions")
    listenernamecontainer.innerHTML = listenername
    let listener_html = document.getElementById("listeners_list_items_2")
    Array.from(listener_html.children).forEach((node) => {
        if (node.id === listenerid + "_2") {
            if (node.classList.contains("inactive")) {
                node.classList.remove("inactive")
                node.classList.add("active")
            }
        } else {
            if (node.classList.contains("active")) {
                node.classList.remove("active")
                node.classList.add("inactive")
            }
        }
    })
    document.getElementById("table-container").style.display = "none"
    document.getElementById("empty-result").style.display = "none"
    document.getElementById("loading-container").style.display = "flex"
    await fetch('/listener/result/' + listenerid, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(async (res) => {
        if (res.status == 200) {
            await res.json().then((data) => {
                if (data["result"].length == 0) {
                    document.getElementById("loading-container").style.display = "none"
                    document.getElementById("table-container").style.display = "none"
                    document.getElementById("empty-result").style.display = "flex"
                } else {
                    var listener = data["result"]
                    //sort by date from the latest
                    listener.sort((a, b) => (a.created_at < b.created_at) ? 1 : -1)
                    
                    let pages = Math.ceil(listener.length/50)
                    document.getElementById("pagination_fixed_position").innerHTML = `
                        <button id="previous_page"><i class='bx bx-chevron-left' ></i> Previous</button>
                        <div class="page_number_container" id="page_number_container"></div>
                        <button id="next_page">Next <i class='bx bx-chevron-right' ></i></button>
                    `
                    let page_number_container = document.getElementById("page_number_container")
                    page_number_container.innerHTML = `Page 1 of ${pages}`
                    // previous button
                    document.getElementById("previous_page").addEventListener("click", () => {
                        if(currentPage > 0){
                            console.log(currentPage)
                            currentPage--
                            page_number_container.innerHTML = `Page ${currentPage+1} of ${pages}`
                            viewMentions(listener)
                        }
                    })
                    document.getElementById("next_page").addEventListener("click", () => {
                        if (currentPage < pages - 1) {
                            currentPage++
                            page_number_container.innerHTML = `Page ${currentPage + 1} of ${pages}`
                            viewMentions(listener)
                        }
                    })
                    viewMentions(listener)
                }
            })
        }
    }).catch((err) => {
        console.log(err)
    })
}

async function deleteKeyword(keywordID, listenerID){
    document.getElementById(`delete-keyword-${keywordID}`).addEventListener("click", () =>{
        
    });
}

async function keywordsTable(listener_id){
    await fetch('/keyword/view/'+listener_id).then(response=>response.json()).then(data=>{
        const keyword_table = document.getElementById("edit_keywords_table")
        keyword_table.innerHTML = `
        <thead>
            <tr>
                <th>Keyword</th>
                <th></th>
                <th></th>
            </tr>
        </thead>
        `
        for(let keyword in data["keywords"]){
            const row = keyword_table.insertRow()
            row.insertCell().textContent = data["keywords"][keyword]["keyword"]
            let edit_button = document.createElement("button")
            edit_button.setAttribute("class", "rounded-btn")
            edit_button.textContent = "Edit"
            edit_button.addEventListener("click", () => {
                document.getElementById("edit-keyword-popup-container").style.display = "flex";
                document.getElementById("edit-keyword-input").value = data["keywords"][keyword]["keyword"]
                let keywordID = data["keywords"][keyword]["_id"]
                document.getElementById("edit-keyword-button").addEventListener("click", () => {
                    let keyword = document.getElementById("edit-keyword-input").value
                    if(keyword === ""){
                        alert("Please enter a keyword")
                    }
                    else{
                        fetch('/keyword/'+keywordID+"/" + keyword, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        }).then((res) => {
                            if (res.status === 200) {
                                res.json().then((data) => {
                                    alert("Keyword edited successfully")
                                    keywordsTable(listener_id)
                                })
                            } else {
                                console.log(res.status)
                            }
                        }).catch((err) => {
                            console.log(err)
                        });
                    }
                })
            })
            row.insertCell().appendChild(edit_button)
            // row.insertCell().innerHTML = `<button class="rounded-btn " id="edit-keyword-${data["keywords"][keyword]["_id"]}">Edit</button>`
            let delete_button = document.createElement("button")
            delete_button.setAttribute("class", "delete-btn")
            delete_button.textContent = "Delete"
            delete_button.addEventListener("click", () => {
                fetch('/keyword/delete/'+data["keywords"][keyword]["_id"], {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },}).then((res) => {
                    if (res.status === 200) {
                        res.json().then((data) => {
                            alert("Keyword deleted successfully")
                            keywordsTable(listener_id)
                        })
                    } else {
                        console.log(res.status)
                    }
                }).catch((err) => {
                    console.log(err)
                });
            })
            row.insertCell().appendChild(delete_button)
            // row.insertCell().innerHTML = `<button id ="delete-keyword-${data["keywords"][keyword]["_id"]}" class="delete-btn" >Delete</button>`
            // deleteKeyword(data["keywords"][keyword]["_id"], listener_id)
        }
    })
}

// async function viewkeywordsactions(listener_id, listener_name) {
//     let listener_name_header = document.getElementById("listener_name_3")
//     listener_name_header.innerHTML = listener_name
//     let listener_html = document.getElementById("listeners_list_items_3")
//     Array.from(listener_html.children).forEach((node) => {
//         if (node.id === listener_id + "_3") {
//             if (node.classList.contains("inactive")) {
//                 node.classList.remove("inactive")
//                 node.classList.add("active")
//             }
//         } else {
//             if (node.classList.contains("active")) {
//                 node.classList.remove("active")
//                 node.classList.add("inactive")
//             }
//         }
//     })
//     document.getElementById("edit_keywords_table").style.display = "none"
//     document.getElementById("edit_keywords_table").innerHTML = `
//         <thead>
//             <tr>
//                 <th>Keyword</th>
//                 <th></th>
//                 <th></th>
//             </tr>
//         </thead>
//     `

//     var button = document.getElementById("add-keyword-edit")

//     button.addEventListener("click", () => {
//         document.getElementById("add-keyword-popup-container").style.display = "flex";
//         document.getElementById("add-keyword-button").addEventListener("click", () => {
//             let keyword = document.getElementById("add-keyword-input").value
//             if(keyword === ""){
//                 alert("Please enter a keyword")
//             }
//             else{
//                 fetch('/keyword/add/', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json'
//                     },
//                     body: JSON.stringify({
//                         listener_id: listener_id,
//                         keyword: keyword
//                     })
//                 }).then((res) => {
//                     if (res.status === 200) {
//                         res.json().then((data) => {
//                             alert("Keyword added successfully")
//                             // viewkeywordsactions(listener_id,listener_name)
//                         })
//                     } else {
//                         console.log(res.status)
//                     }
//                 }).catch((err) => {
//                     console.log(err)
//                 });
//             }
//         })
//     })

//     document.getElementById("loading-container-edit-keywords").style.display = "flex"
//     let response =fetch('/keyword/view/'+listener_id)
//     .then(response=>response.json())
//     .then(data=>{ 
//         const keyword_table = document.getElementById("edit_keywords_table")
//         for(let keyword in data["keywords"]){
//             const row = keyword_table.insertRow()
//             row.insertCell().textContent = data["keywords"][keyword]["keyword"]
//             row.insertCell().innerHTML = `<button class="rounded-btn " id="edit-keyword-${data["keywords"][keyword]["_id"]}">Edit</button>`            
//             row.insertCell().innerHTML = `<button id ="delete-keyword-${data["keywords"][keyword]["_id"]}" class="delete-btn" >Delete</button>`

//             document.getElementById(`delete-keyword-${data["keywords"][keyword]["_id"]}`).addEventListener("click", () =>{
//                 fetch('/keyword/delete/'+data["keywords"][keyword]["_id"], {
//                 method: 'DELETE',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },}).then((res) => {
//                 if (res.status === 200) {
//                     res.json().then((data) => {
//                         alert("Keyword deleted successfully")
//                         viewkeywordsactions(listener_id,listener_name)
//                     })
//                 } else {
//                     console.log(res.status)
//                 }
//             }).catch((err) => {
//                 console.log(err)
//             });
//             });

//             document.getElementById(`edit-keyword-${data["keywords"][keyword]["_id"]}`).addEventListener('click', function() {
//                 document.getElementById("edit-keyword-popup-container").style.display = "flex"
//                 document.getElementById("edit-keyword-input").value = data["keywords"][keyword]["keyword"]
//                 document.getElementById("edit-keyword-button").addEventListener("click", () => {
//                     let new_keyword = document.getElementById("edit-keyword-input").value
//                     if(keyword === ""){
//                         alert("Please enter a keyword")
//                     } else if(keyword === data["keywords"][keyword]["keyword"]){
//                         alert("Please enter a keyword different from the current one")
//                     }
//                     else{
//                         document.getElementById("edit-keyword-input").value = ""
//                         updateKeyword(data["keywords"][keyword]["_id"],listener_id, new_keyword, listener_name);
//                     }
//                 })
//             });
//         }
//     }).then(()=>{
//         document.getElementById("loading-container-edit-keywords").style.display = "none"
//         document.getElementById("edit_keywords_table").style.display = "table"
        
//     })
// }

export function viewMentions(listener){
    let mentions_table = document.getElementById("mentions-table")
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
    const start_index = (currentPage) * 50
    const end_index = start_index + 50
    listener = listener.slice(start_index, end_index)
    const listener_length = listener.length
    for (let i = 0; i < listener_length; i++) {
        listener[i].created_at = new Date(listener[i].created_at)
        listener[i].created_at = listener[i].created_at.toLocaleDateString("en-US", {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        mentions_table.appendChild(generateRow(listener[i]))
    }
    document.getElementById("table-container").style.display = "block"
    document.getElementById("loading-container").style.display = "none"
}

function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

var source_icon = {
    "twitter": "<i class='bx bxl-twitter icon'></i>",
    "news": "<i class='bx bxs-news icon'></i>",
    "youtube": "<i class='bx bxl-youtube icon'></i>",
}

function popUpMention(row) {

    //wrap keyword in span
    let wrapped_keyword = "<span style='color: green; font-weight: 900'>" + row["keyword"] + "</span>"
    row.text = row.text.replace(row["keyword"], wrapped_keyword)
    row.text = row.text.replace(row["keyword"].toLowerCase(), wrapped_keyword)
    row.text = row.text.replace(row["keyword"].toUpperCase(), wrapped_keyword)
    // format date
    let date_obj = new Date(row["created_at"])
    let formatted_date = date_obj.getDate() + "/" + (date_obj.getMonth()+1) + "/" + date_obj.getFullYear()

    let popUp = document.getElementById("mention_popup")
    popUp.innerHTML = ""
    popUp.style.display = "flex"
    let popUp_div = document.createElement("div")
    popUp_div.classList.add("popup_container")
    let popUp_div_header = document.createElement("div")
    popUp_div_header.classList.add("popup_header_row")
    let popUp_div_header_button = document.createElement("button")
    popUp_div_header_button.addEventListener("click", () => {
        closePopUp()
    })
    popUp_div_header_button.innerHTML = "<i class='bx bx-x' ></i>"
    popUp_div_header.appendChild(popUp_div_header_button)
    popUp_div.appendChild(popUp_div_header)
    let popUp_div_header_h1 = document.createElement("h1")
    popUp_div_header_h1.classList.add("popup_keyword_header")
    var arabic = /[\u0600-\u06FF]/
    popUp_div_header_h1.innerHTML = row["keyword"]
    if (arabic.test(row["keyword"])) {
        popUp_div_header_h1.style.textAlign = "right"
        popUp_div_header_h1.style.direction = "rtl"
    }

    popUp_div.appendChild(popUp_div_header_h1)
    // Information Row
    let popUp_div_info = document.createElement("div")
    popUp_div_info.classList.add("popup_info_row")
    let popUp_div_info_date = document.createElement("div")
    popUp_div_info_date.classList.add("popup_info_date")
    popUp_div_info_date.innerHTML = formatted_date
    popUp_div_info.appendChild(popUp_div_info_date)
    let popUp_div_info_source_sentiment = document.createElement("div")

    let popUp_div_info_source = document.createElement("div")
    popUp_div_info_source.classList.add(row["source"])
    popUp_div_info_source.innerHTML = source_icon[row["source"]] + row["source"][0].toUpperCase() + row["source"].slice(1)
    popUp_div_info_source_sentiment.appendChild(popUp_div_info_source)

    let popUp_div_info_sentiment = document.createElement("div")
    popUp_div_info_sentiment.classList.add(row["sentiment"])
    popUp_div_info_sentiment.innerHTML = row["sentiment"][0].toUpperCase() + row["sentiment"].slice(1)
    popUp_div_info_source_sentiment.appendChild(popUp_div_info_sentiment)

    if (row["source"] == "twitter") {
        if (row["spam"] == "1") {
            let spam = document.createElement("div")
            spam.classList.add("spam")
            spam.innerHTML = "<i class='bx bx-flag'></i> Spam"
            popUp_div_info_source_sentiment.appendChild(spam)
        }
    }

    popUp_div_info.appendChild(popUp_div_info_source_sentiment)
    popUp_div.appendChild(popUp_div_info)

    // Text Row
    let popUp_div_text = document.createElement("div")
    popUp_div_text.classList.add("popup_text")
    popUp_div_text.innerHTML = row["text"]
    popUp_div.appendChild(popUp_div_text)
    popUp.appendChild(popUp_div)


    // popUp.innerHTML = `
    // <div class='popup_container'>
    //     <div class='popup_header_row'>
    //         <button onclick='closePopUp()'><i class='bx bx-x' ></i></button>
    //     </div>
    //     <h1 class='popup_keyword_header'>${row["keyword"]}</h1>
    //     <div class='popup_text'><bdi>${row["text"]}</bdi></div>
    // </div>
    // `
}

function closePopUp() {
    let popUp = document.getElementById("mention_popup")
    popUp.style.display = "none"
}

function preprocess_text(tweet) {
    tweet = tweet.replace(/\s+/g, ' ').replace(/"/g, '\\"')
    return tweet
}

function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

function truncateText(row) {
    let text_container = document.createElement("div")
    text_container.className = "mention_text"
    text_container.innerHTML = `<p><bdi>${row["text"]}</bdi></p>`
    if (row["text"].length > 128) {
        text_container.innerHTML = ""
        let id = generateUniqueId();
        // create button
        let button = document.createElement("button");
        button.innerHTML = "View more <i class='bx bx-expand-alt'></i>";
        button.id = id;
        button.onclick = function () {
            popUpMention(row)
        }
        let text_p = document.createElement("p")
        let text_bdi = document.createElement("bdi")
        text_bdi.innerHTML = row["text"].slice(0, 128)
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

function generateRow(mention) {
    let row = document.createElement("tr")

    //date row
    let item_publish_date = document.createElement("td")
    item_publish_date.id = "Data"
    item_publish_date.innerHTML = mention.created_at
    row.appendChild(item_publish_date)

    // mention text row
    let mention_text = document.createElement("td")
    mention_text.appendChild(truncateText(mention))
    row.appendChild(mention_text)

    // source row
    let source_item = document.createElement("td")
    let source_item_div = document.createElement("div")
    source_item_div.className = "source_item"
    let source_item_button = document.createElement("button")
    source_item_button.type = "button"
    source_item_button.className = mention.source.charAt(0).toUpperCase() + mention.source.slice(1)
    source_item_button.id = mention.source.charAt(0).toUpperCase() + mention.source.slice(1)
    source_item_button.innerHTML = mention.source.charAt(0).toUpperCase() + mention.source.slice(1)
    source_item_div.appendChild(source_item_button)
    if (mention.source == "twitter")
        source_item_div.innerHTML += spam[mention.spam]
    source_item.appendChild(source_item_div)
    row.appendChild(source_item)

    // sentiment row
    let sentiment_item = document.createElement("td")
    sentiment_item.innerHTML = sentiment[mention.sentiment]
    row.appendChild(sentiment_item)

    // summary row
    let summary_item = document.createElement("td")
    summary_item.id = "Summary"
    summary_item.innerHTML = mention.summary
    row.appendChild(summary_item)

    // action row[OPEN]
    let action_item = document.createElement("td")
    let action_item_div = document.createElement("div")
    let action_item_button_open = document.createElement("button")
    action_item_button_open.type = "button"
    action_item_button_open.id = "Open"
    action_item_button_open.onclick = function () {
        window.open(mention.link, '_blank')
    }
    let action_item_button_open_i = document.createElement("i")
    action_item_button_open_i.className = "bx bx-link-external"
    action_item_button_open.appendChild(action_item_button_open_i)
    action_item_button_open.innerHTML += "Open"
    action_item_div.appendChild(action_item_button_open)

    // action row[COPY]
    let action_item_button_copy = document.createElement("button")
    action_item_button_copy.type = "button"
    action_item_button_copy.onclick = function () {
        copyToClipboard(mention.link)
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