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

        // get all listeners
        getListeners()
        // get all keywords
        getAllKeywords()
        // get all users
        getUsers()


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
        let category_num_general = document.getElementById("num-of-categories-general")
        category_num.innerHTML = categories.length
        category_num_general.innerHTML = categories.length
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
            categories.forEach(async category => {
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
                var media_links = []
                await fetch("/category/all_media_links")
                .then(res => res.json())
                .then(data => {
                    media_links = data.mediaLinks
                })
                .catch(err => {
                    alert(err)
                })

                category_item.appendChild(category_buttons_div)
                main_category_item.appendChild(category_item)
                categories_list.appendChild(main_category_item)
                // add event listeners to the buttons
                let edit_category_button = category_buttons_div.children[0]
                let delete_category_button = category_buttons_div.children[1]
                let arrow_down_button = category_buttons_div.children[2]
                // edit category
                edit_category_button.addEventListener("click", () => {
                    // Change the Create Category Container color, add a close button, change the title to Edit Category, and add the category name and media links to the container
                    let create_category_container = document.getElementById("form-category")
                    create_category_container.style.backgroundColor = "#6325fe4f"
                    document.getElementById("form-header").classList.add("form-header-edit-container")
                    document.getElementById("form-header").innerHTML = `
                        <h1>Edit Category</h1>
                        <div class="close-button">
                            <button class="close-button"><i class='bx bx-x'></i></button>
                        </div>
                    `

                    // add the category name to the input
                    document.getElementById("category-name").value = category.category_name
                    // add the media links to the media links container
                    let media_links_container = document.getElementById("media_links")
                    media_links_container.innerHTML = ""
                    let wanted_media_links = []
                    media_links.forEach(media_link => {
                        if(media_link.category_id === category._id){
                            wanted_media_links.push(media_link)
                        }
                    })
                    if(wanted_media_links.length !== 0){
                        media_links_container.style.justifyContent = "flex-start"
                        media_links_container.style.padding = "2% 5%"
                        media_links_container.style.width = "90%"
                        wanted_media_links.forEach(media_link => {
                            media_links_container.innerHTML += `
                                <div class="medialink_row">
                                    <input type="text" placeholder="Media Link" value="${media_link.media_link_name == undefined? media_link.mediaLink_name:media_link.media_link_name}">
                                    <button class="remove-media-link-button">-</button>
                                </div>
                            `
                        })
                    }
                    else{
                        media_links_container.innerHTML = `
                            <div id="empty_media_links">
                                <h4>No media links added</h4>
                            </div>
                        `
                        media_links_container.style.justifyContent = "center"
                        media_links_container.style.padding = "0"
                        media_links_container.style.width = "100%"
                    }
                    // add event listeners to the remove media link buttons
                    let remove_media_link_buttons = document.getElementsByClassName("remove-media-link-button")
                    for(let i = 0; i < remove_media_link_buttons.length; i++){
                        remove_media_link_buttons[i].addEventListener("click", (e) => {
                            media_links_container.removeChild(e.target.parentElement)
                        })
                    }

                    document.getElementById("action-button").innerHTML = `
                        <button id="edit-category-button">Edit Category</button>
                    `
                    document.getElementById("edit-category-button").addEventListener("click", () => {
                        // edit category
                        let category_name = document.getElementById("category-name").value
                        //validation
                        if(category_name === ""){
                            alert("Please enter a category name")
                            return
                        }
                        let category_query = {
                            category_name: category_name
                        }
                        fetch("/category/edit/"+category._id, {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(category_query)
                        })
                        .then(res => res.json())
                        .then(data => {
                            //get the wanted media linked only
                            let wanted_media_links = []
                            media_links.forEach(media_link => {
                                if(media_link.category_id === category._id){
                                    wanted_media_links.push(media_link)
                                }
                            })


                            // add media links to their database
                            let new_media_links = document.getElementById("media_links").children
                            let media_links_array = []
                            
                            for(let i = 0; i < new_media_links.length; i++){
                                // validate if any of the list empty
                                if(new_media_links[i].children[0].value === ""){
                                    alert("Please enter the missing media link")
                                    return
                                }
                                
                                //check if the media link is already in the database
                                let media_link_exists = false
                                for(let media_link of wanted_media_links) {
                                    console.log(media_link)
                                    if(media_link.mediaLink === new_media_links[i].children[0].value){
                                        // remove it from the array
                                        media_link_exists = true
                                    }
                                    fetch("/category/delete_media_link/"+media_link._id, {
                                        method: "GET",
                                        headers: {
                                            "Content-Type": "application/json"
                                        }
                                    })
                                }
                                
                                if(!media_link_exists){
                                    media_links_array.push({
                                        mediaLink_name: new_media_links[i].children[0].value,
                                        mediaLink: new_media_links[i].children[0].value,
                                        category_id: data.category._id
                                    })
                                }

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
                                alert("Category edited successfully")
                                let media_links = document.getElementById("media_links")
                                media_links.innerHTML = `
                                    <div id="empty_media_links">
                                        <h4>No media links added</h4>
                                    </div>
                                `
                                //convert the container to Create Category
                                create_category_container.style.backgroundColor = "rgba(251, 251, 251, 0.413)"
                                document.getElementById("form-header").classList.remove("form-header-edit-container")
                                document.getElementById("form-header").innerHTML = `
                                    <h1>Create Category</h1>
                                `
                                // convert the button to add button
                                document.getElementById("action-button").innerHTML = `
                                    <button id="add-category-button">Create</button>
                                `

                                media_links.style.justifyContent = "center"
                                media_links.style.padding = "0"
                                media_links.style.width = "100%"
                                document.getElementById("category-name").value = ""
                                getCategories()
                                getUsedCategories()
                                getMediaLinks()
                            })
                        })

                    })

                    // add event listener to the close button
                    let close_button = create_category_container.children[0].children[1]
                    close_button.classList.add("close-button-form-container")
                    close_button.addEventListener("click", () => {
                        // reset the container to its original state
                        create_category_container.style.backgroundColor = "rgba(251, 251, 251, 0.413)"
                        document.getElementById("category-name").value = ""
                        media_links_container.innerHTML = `
                            <div id="empty_media_links">
                                <h4>No media links added</h4>
                            </div>
                        `
                        document.getElementById("action-button").innerHTML = `
                            <button id="add-category-button">Create</button>
                        `
                        
                        media_links_container.style.justifyContent = "center"
                        media_links_container.style.padding = "0"
                        media_links_container.style.width = "100%"
                        document.getElementById("form-header").classList.remove("form-header-edit-container")
                        document.getElementById("form-header").innerHTML = `
                            <h1>Create Category</h1>
                            `
                })
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
                arrow_down_button.addEventListener("click", async () => {
                    // remove the arrow down button
                    let media_links_div = document.createElement("div")
                    media_links_div.classList.add("media-links-div")
                    media_links_div.innerHTML = `
                        <h4>Media Links</h4>
                        <h5 style="text-align: center">No media links created</h5>
                    `
                    let media_links_list = document.createElement("div")
                    media_links_list.classList.add("media-links-list")

                    // category_item.style.height = "auto"
                        // toggle the arrow down button
                        if(arrow_down_button.children[0].classList.contains("bx-chevron-down")){
                            arrow_down_button.children[0].classList.remove("bx-chevron-down")
                            arrow_down_button.children[0].classList.add("bx-chevron-up")
                            // change the height of the category_item
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
                                        <div class="media-link-item-container">${media_link.media_link_name == undefined? media_link.mediaLink_name:media_link.media_link_name}</div>
                                    `
                                })
                            }
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
            let media_link_num_general = document.getElementById("num-of-media-links-general")
            media_link_num_general.innerHTML = media_links.length
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
        let used_category_num_general = document.getElementById("num-of-used-categories-general")
        used_category_num.innerHTML = used_categories.length
        used_category_num_general.innerHTML = used_categories.length
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

// get all users
const getUsers = () => {
    fetch("/user/getAllUsers")
    .then(res => res.json())
    .then(data => {
        let users = data
        let user_num = document.getElementById("num-of-users")
        user_num.innerHTML = users.length
    })
}

// get all listeners
const getListeners = () => {
    fetch("/listener/all")
    .then(res => res.json())
    .then(data => {
        let listeners = data.listeners
        let listener_num = document.getElementById("num-of-listeners")
        listener_num.innerHTML = listeners.length
    })
}

// get all keywords
const getAllKeywords = () => {
    fetch("/listener/getAllKeywords")
    .then(res => res.json())
    .then(data => {
        let keywords = data.keywords
        let keyword_num = document.getElementById("num-of-keywords")
        keyword_num.innerHTML = keywords.length
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
            let media_links = document.getElementById("media_links")
            media_links.innerHTML = `
                <div id="empty_media_links">
                    <h4>No media links added</h4>
                </div>
            `
            media_links.style.justifyContent = "center"
            media_links.style.padding = "0"
            media_links.style.width = "100%"
            document.getElementById("category-name").value = ""
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