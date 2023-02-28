var userData = {}
async function registerPersonalInfo(){
    await fetch('/user/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            name: document.getElementById('name').value,
            job_title: document.getElementById('jobTitle').value,
        })
    }).then((res) => {
        if(res.status === 200){
            res.json().then((data) => {
                document.getElementById("personalInfo").style.display = "none"
            document.getElementById("companyInfo").style.display = "flex"
                userData["id"] = data.user._id
                userData["email"] = data.user.email
                userData["password"] = document.getElementById('password').value
            })
        }
        else{
            console.log(res.status)
        }
    }).catch((err) => {
        console.log(err)
    })
}
async function registerCompanyInfo(){
    await fetch('/company/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            company_name: document.getElementById('companyName').value,
            company_address: document.getElementById('companyAddress').value,
            user_id: userData.id
        })
    }).then((res) => {
        if(res.status === 200){
            res.json().then((data) => {
                window.location.href = '/view/login'
            })
        }
        else{
            console.log(res.status)
        }
    }).catch((err) => {
        console.log(err)
    })
}