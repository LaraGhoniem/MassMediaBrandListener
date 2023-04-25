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
    static async addListener(user_id, data,callback){
        //add listener to the database
        let listener_post = new Post('/listener/add')
        let listener_data = {
            listener_name: data.listener_name,
            user_id: user_id,
            categories: data.listener_categories
        }
        await listener_post.post(listener_data).then(listener => {
            //add keywords to the database
            let keyword_post = new Post('/keyword/add')
            let keywords = data.listener_keywords
            for(let keyword of keywords){
                keyword = {
                    keyword: keyword,
                    listener_id: listener.listener._id
                }
                keyword_post.post(keyword)
            }
        }).then(() => {
            callback()
        })
    }
}