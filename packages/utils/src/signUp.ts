export const signUp = async(username : string, password : string)=>{

    if(!username || !password) return Response.json({msg : "Unable to SignUp"}, {status : 500})

    try{
        const res = await fetch(`/api/register`,{
            method : "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })

        if(res.ok){
            return {ok : true, url : '/main'}
        }
    }
    catch(e){
        return {ok : false};
    }

}