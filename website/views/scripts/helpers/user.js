import { Post } from './post.js'
export class User{
    static async create(){
        const instance = new User()
        const response = await fetch("/listener-data")
        const data = await response.json()
        instance.data = data
        return instance
    }
    static async logout(){
        let post = new Post('/user/signout')
        await post.get(res => {
            window.location.href = "/"
        }).catch(err => {
            alert(err)
        })
    }
    static async getListeners(id,callback){
        let post = new Post('/listener/id/'+id)
        await post.get(data => {
            callback(data)
        })
    }
}