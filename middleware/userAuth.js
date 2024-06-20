const  User = require('../models/userModel')

const isUser = async (req,res,next)=>{
    if(req.session.user_id){
       return next()
    }else{
       
       return res.redirect('/')
    }
}

const isLoggedUser = (req,res,next)=>{
    if(req.session.user_id){
       return res.redirect('/home')
    }else{
       return next()
    }
}
module.exports= {
    isUser,
    isLoggedUser,  
}