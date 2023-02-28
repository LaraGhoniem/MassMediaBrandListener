async function login(){
    await fetch('/user/signin', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        })
    }).then((res) => {
        if(res.status === 200){
            window.location.href = '/view/dashboard'
        }
        else{
            console.log(res.status)
        }
    }).catch((err) => {
        console.log(err)
    })
}