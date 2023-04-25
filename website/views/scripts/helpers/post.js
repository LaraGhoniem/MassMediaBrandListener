export class Post{
    constructor(path, data= []){
        this.path = path
        this.data = data
    }
    async get(callback){
        await fetch(this.path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json().then(callback))
    }
    async post(data){
        return await fetch(this.path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json().then(data => data))
    }

}