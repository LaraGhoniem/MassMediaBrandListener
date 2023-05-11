import { User } from "./helpers/user.js";
var userData = {}
const checkRole = async () => {
    try{
        var role = ""
        const instance = new User()
        const response = await fetch("/session-data")
        const data = await response.json()
        instance.data = data
        if(!instance.data.user){
            throw("Session expired. Please login again")
        }
        else{
            role = instance.data.user.role
            userData = instance.data.user 
        }

        if(role === "admin"){
            return true
        }
        else if (role === "user"){
            return false
        }
        else{
            throw("Role not found")
        }
    }catch(err){
        // show popup that session expired and redirect to login page
        alert(err)
        location.href = "/view/login"
    }
}

// use the function 
checkRole().then((isAdmin) => {
    if(isAdmin){
        // update the name in the navbar
        document.getElementById("username-header").innerHTML = userData.name
        // add listeners to the sidebar
        let navigation_children = document.getElementById("navigation").children
        for(let i = 0; i < navigation_children.length; i++){
            navigation_children[i].addEventListener("click", (e) => {
                //remove -button from the id
                let id = e.target.id.split("-")
                id.pop()
                id = id.join("-")
                navigate(id)
            })
        }   
        // add listeners to the logout button
        document.getElementById("user-logout").addEventListener("click", () => User.logout())  
        
        // get all categories
        getCategories()
        // get all media links
        getMediaLinks()
        // get used categories
        getUsedCategories()

        // add category
        document.getElementById("add-category-button").addEventListener("click", () => addCategory())
        // add media link
        document.getElementById("add-media-link-button").addEventListener("click", () => addMediaLink())
    }
    else{
        location.href = "/"
    }
})

// Navigation function for the sidebar
const navigate = (page) => {
    let screens = {
        "general-dashboard": document.getElementById("general-dashboard"),
        "edit-categories": document.getElementById("edit-categories"),
    }
    for(let screen in screens)
        if(screen !== page)
            screens[screen].style.display = "none"
    screens[page].style.display = "block"
}

// logout function
const logout = () => {
    fetch("/user/logout")
    .then(res => res.json())
    .then(data => {
        if(data.success){
            location.href = "/view/login"
        }
        else{
            throw("Logout failed")
        }
    })
    .catch(err => {
        alert(err)
    })
}

// get all categories
const getCategories = () => {
    fetch("/category/all")
    .then(res => res.json())
    .then(data => {
        let categories = data.category
        let category_num = document.getElementById("num-of-categories")
        category_num.innerHTML = categories.length
        let categories_list = document.getElementById("categories_table")
        if(categories.length === 0){
            categories_list.innerHTML = `
                <div id="empty_categories">
                    <h4>No categories added</h4>
                </div>
            `
        }
        else{
            categories_list.innerHTML = ""
            categories.forEach(category => {
                let main_category_item = document.createElement("div")
                main_category_item.classList.add("main_category_item")
                let category_item = document.createElement("div")
                category_item.classList.add("category-item")
                category_item.innerHTML = `
                    <h4>${category.category_name}</h4>
                `
                let category_buttons_div = document.createElement("div")
                category_buttons_div.classList.add("category-item-buttons")
                category_buttons_div.innerHTML = `
                    <button class="edit-category-button"><i class='bx bxs-pencil'></i></button>
                    <button class="delete-category-button"><i class='bx bxs-trash' ></i></button>
                    <button class="arrow-down"><i class='bx bx-chevron-down' ></i></button>
                `
                category_item.appendChild(category_buttons_div)
                main_category_item.appendChild(category_item)
                categories_list.appendChild(main_category_item)
                // add event listeners to the buttons
                let edit_category_button = category_buttons_div.children[0]
                let delete_category_button = category_buttons_div.children[1]
                let arrow_down_button = category_buttons_div.children[2]
                // edit category
                edit_category_button.addEventListener("click", () => {

                })
                // delete category
                delete_category_button.addEventListener("click", () => {
                    fetch("/category/delete/"+category._id, {
                        method: "GET"
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert("Category deleted successfully")
                        getCategories()
                        getUsedCategories()
                        getMediaLinks()
                    })
                    .catch(err => {
                        alert(err)
                    })
                })
                // show media links
                arrow_down_button.addEventListener("click", () => {
                    // remove the arrow down button
                    let media_links_div = document.createElement("div")
                    media_links_div.classList.add("media-links-div")
                    media_links_div.innerHTML = `
                        <h4>Media Links</h4>
                        <h5>No media links created</h5>
                    `
                    let media_links_list = document.createElement("div")
                    media_links_list.classList.add("media-links-list")

                    // category_item.style.height = "auto"
                        // toggle the arrow down button
                        if(arrow_down_button.children[0].classList.contains("bx-chevron-down")){
                            arrow_down_button.children[0].classList.remove("bx-chevron-down")
                            arrow_down_button.children[0].classList.add("bx-chevron-up")
                            // change the height of the category_item
                            fetch("/category/all_media_links")
                            .then(res => res.json())
                            .then(data => {
                                let media_links = data.mediaLinks
                                let wanted_media_links = []
                                
                                media_links.forEach(media_link => {
                                    if(media_link.category_id === category._id){
                                        wanted_media_links.push(media_link)
                                    }
                                })
                                if(wanted_media_links.length !== 0){
                                    media_links_div.removeChild(media_links_div.children[1])
                                    wanted_media_links.forEach(media_link => {
                                        media_links_list.innerHTML += `
                                        <p>${media_link.media_link_name}</p>
                                        `
                                    })
                                }

                            })
                            .catch(err => {
                                alert(err)
                            })
                            media_links_div.appendChild(media_links_list)
                            main_category_item.appendChild(media_links_div)
                        }
                        else{
                            arrow_down_button.children[0].classList.remove("bx-chevron-up")
                            arrow_down_button.children[0].classList.add("bx-chevron-down")
                            main_category_item.removeChild(main_category_item.children[main_category_item.children.length - 1])
                        }
                    
                    
                })
            })
        }
        // categories_list.innerHTML = ""
        // categories.forEach(category => {
        //     let category_item = document.createElement("li")
        //     category_item.classList.add("list-group-item")
        //     category_item.innerHTML = category.name
        //     categories_list.appendChild(category_item)
        // })
    })
    .catch(err => {
        alert(err)
    })
}

// get all media links
const getMediaLinks = () => {
    fetch("/category/all_media_links")
    .then(res => res.json())
    .then(data => {
            let media_links = data.mediaLinks
            let media_link_num = document.getElementById("num-of-media-links")
            media_link_num.innerHTML = media_links.length
            // let media_links_list = document.getElementById("media-links-list")
            // media_links_list.innerHTML = ""
            // media_links.forEach(media_link => {
            //     let media_link_item = document.createElement("li")
            //     media_link_item.classList.add("list-group-item")
            //     media_link_item.innerHTML = media_link.name
            //     media_links_list.appendChild(media_link_item)
            // })
    })
    .catch(err => {
        alert(err)
    })
}

// get used categories
const getUsedCategories = () => {
    fetch("/category/used")
    .then(res => res.json())
    .then(data => {
        let used_categories = data.used_categories
        let used_category_num = document.getElementById("num-of-used-categories")
        used_category_num.innerHTML = used_categories.length
        // let used_categories_list = document.getElementById("used-categories-list")
        // used_categories_list.innerHTML = ""
        // used_categories.forEach(category => {
        //     let category_item = document.createElement("li")
        //     category_item.classList.add("list-group-item")
        //     category_item.innerHTML = category.name
        //     used_categories_list.appendChild(category_item)
        // })
    })
    .catch(err => {
        alert(err)
    })
}

// add category
const addCategory = () => {
    let category_name = document.getElementById("category-name").value
    //validation
    if(category_name === ""){
        alert("Please enter a category name")
        return
    }

    let category = {
        category_name: category_name
    }
    fetch("/category/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(category)
    })
    .then(res => res.json())
    .then(data => {
        // add media links to their database
        let media_links = document.getElementById("media_links").children
        let media_links_array = []
        for(let i = 0; i < media_links.length; i++){
            // validate if any of the list empty
            if(media_links[i].children[0].value === ""){
                alert("Please enter the missing media link")
                return
            }
            media_links_array.push({
                mediaLink_name: media_links[i].children[0].value,
                mediaLink: media_links[i].children[0].value,
                category_id: data.category._id
            })
        }
        fetch("/category/add_media_link", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(media_links_array)
        })
        .then(res => res.json())
        .then(data => {
            alert("Category added successfully")
            getCategories()
            getUsedCategories()
            getMediaLinks()
        })



        
    })
    .catch(err => {
        alert(err)
    })
}

// add media link
const addMediaLink = () => {
    let media_links = document.getElementById("media_links")
    //check if empty_media_links exists
    if(document.getElementById("empty_media_links")){
        media_links.removeChild(document.getElementById("empty_media_links"))
    }
    // change the justify content to flex-start and add some padding from top
    media_links.style.justifyContent = "flex-start"
    media_links.style.padding = "2% 5%"
    media_links.style.width = "90%"
    let media_link = document.createElement("div")
    media_link.classList.add("medialink_row")
    media_link.innerHTML = `
        <input type="text" placeholder="Media Link">
        <button class="remove-media-link-button">-</button>
    `
    let media_link_remove_button = media_link.children[1]
    media_link_remove_button.addEventListener("click", () => {
        media_links.removeChild(media_link)
    })
    media_links.appendChild(media_link)
}