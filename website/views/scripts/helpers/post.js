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

}